package com.clinicamedica.repository;

import com.clinicamedica.model.Atendente;
import com.clinicamedica.model.Pessoa;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class AtendenteRepository {

    private final JdbcTemplate jdbcTemplate;

    public AtendenteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Atendente> rowMapper = (rs, rowNum) -> {
        Pessoa pessoa = new Pessoa.Builder()
                .id(rs.getInt("id"))
                .cpf(rs.getString("cpf"))
                .nome(rs.getString("nome"))
                .email(rs.getString("email"))
                .senha(rs.getString("senha"))
                .dataNascimento(rs.getObject("data_nascimento", LocalDate.class))
                .ehAdministrador(rs.getInt("eh_administrador"))
                .build();

        return new Atendente.Builder()
                .pessoa(pessoa)
                .matricula(rs.getString("matricula"))
                .build();
    };

    public void save(Atendente atendente) {
        String sql = "INSERT INTO Atendente (id_pessoa, matricula) VALUES (?, ?)";
        jdbcTemplate.update(sql, atendente.getPessoa().getId(), atendente.getMatricula());
    }

    public void update(Atendente atendente) {
        String sql = "UPDATE Atendente SET matricula = ? WHERE id_pessoa = ?";
        jdbcTemplate.update(sql, atendente.getMatricula(), atendente.getPessoa().getId());
    }

    public List<Atendente> findAll() {
        String sql = "SELECT p.*, a.matricula FROM Atendente a " +
                "INNER JOIN Pessoa p ON a.id_pessoa = p.id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<Atendente> findById(Integer id) {
        String sql = "SELECT p.*, a.matricula FROM Atendente a " +
                "INNER JOIN Pessoa p ON a.id_pessoa = p.id WHERE a.id_pessoa = ?";
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }

    public void delete(Integer id) {
        String sql = "DELETE FROM Atendente WHERE id_pessoa = ?";
        jdbcTemplate.update(sql, id);
    }
}