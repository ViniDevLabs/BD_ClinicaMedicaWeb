package com.clinicamedica.repository;

import com.clinicamedica.model.Medico;
import com.clinicamedica.model.Pessoa;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.*;

@Repository
public class MedicoRepository {

    private final JdbcTemplate jdbcTemplate;

    public MedicoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final ResultSetExtractor<List<Medico>> medicoExtractor = rs -> {
        Map<Integer, Medico.Builder> medicoMap = new LinkedHashMap<>();
        Map<Integer, List<String>> especialidadesMap = new HashMap<>();

        while (rs.next()) {
            Integer idPessoa = rs.getInt("id");

            if (!medicoMap.containsKey(idPessoa)) {
                Pessoa pessoa = new Pessoa.Builder()
                        .id(idPessoa)
                        .cpf(rs.getString("cpf"))
                        .nome(rs.getString("nome"))
                        .email(rs.getString("email"))
                        .senha(rs.getString("senha"))
                        .dataNascimento(rs.getObject("data_nascimento", LocalDate.class))
                        .ehAdministrador(rs.getInt("eh_administrador"))
                        .build();

                medicoMap.put(idPessoa, new Medico.Builder()
                        .pessoa(pessoa)
                        .numero(rs.getInt("numero"))
                        .estado(rs.getString("estado")));

                especialidadesMap.put(idPessoa, new ArrayList<>());
            }

            String especialidade = rs.getString("especialidade");
            if (especialidade != null) {
                especialidadesMap.get(idPessoa).add(especialidade);
            }
        }

        List<Medico> result = new ArrayList<>();
        for (Map.Entry<Integer, Medico.Builder> entry : medicoMap.entrySet()) {
            entry.getValue().especialidades(especialidadesMap.get(entry.getKey()));
            result.add(entry.getValue().build());
        }
        return result;
    };

    public void save(Medico medico) {
        String sql = "INSERT INTO Medico (id_pessoa, numero, estado) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, medico.getPessoa().getId(), medico.getNumero(), medico.getEstado());
        saveEspecialidades(medico.getPessoa().getId(), medico.getEspecialidades());
    }

    public void update(Medico medico) {
        String sql = "UPDATE Medico SET numero = ?, estado = ? WHERE id_pessoa = ?";
        jdbcTemplate.update(sql, medico.getNumero(), medico.getEstado(), medico.getPessoa().getId());

        jdbcTemplate.update("DELETE FROM Medico_Especialidade WHERE id_medico = ?", medico.getPessoa().getId());
        saveEspecialidades(medico.getPessoa().getId(), medico.getEspecialidades());
    }

    private void saveEspecialidades(Integer idMedico, List<String> especialidades) {
        if (especialidades == null || especialidades.isEmpty())
            return;

        String sql = "INSERT INTO Medico_Especialidade (id_medico, especialidade) VALUES (?, ?)";
        jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                ps.setInt(1, idMedico);
                ps.setString(2, especialidades.get(i));
            }

            @Override
            public int getBatchSize() {
                return especialidades.size();
            }
        });
    }

    public List<Medico> findAll() {
        String sql = "SELECT p.*, m.numero, m.estado, me.especialidade " +
                "FROM Medico m " +
                "INNER JOIN Pessoa p ON m.id_pessoa = p.id " +
                "LEFT JOIN Medico_Especialidade me ON m.id_pessoa = me.id_medico";
        return jdbcTemplate.query(sql, medicoExtractor);
    }

    public Optional<Medico> findById(Integer id) {
        String sql = "SELECT p.*, m.numero, m.estado, me.especialidade " +
                "FROM Medico m " +
                "INNER JOIN Pessoa p ON m.id_pessoa = p.id " +
                "LEFT JOIN Medico_Especialidade me ON m.id_pessoa = me.id_medico " +
                "WHERE m.id_pessoa = ?";
        List<Medico> result = jdbcTemplate.query(sql, medicoExtractor, id);
        return !result.isEmpty() ? Optional.of(result.get(0)) : Optional.empty();
    }

    public void delete(Integer id) {
        jdbcTemplate.update("DELETE FROM Medico WHERE id_pessoa = ?", id);
    }
}