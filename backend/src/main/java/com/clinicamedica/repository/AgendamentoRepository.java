package com.clinicamedica.repository;

import com.clinicamedica.model.Agendamento;
import com.clinicamedica.model.Atendente;
import com.clinicamedica.model.Medico;
import com.clinicamedica.model.Paciente;
import com.clinicamedica.model.Pessoa;
import com.clinicamedica.model.StatusAgendamento;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class AgendamentoRepository {

    private final JdbcTemplate jdbcTemplate;

    private static final String BASE_QUERY = "SELECT a.*, " +
            "p_pac.nome AS paciente_nome, p_pac.cpf AS paciente_cpf, " +
            "p_med.nome AS medico_nome, GROUP_CONCAT(me.especialidade) AS medico_especialidades, " +
            "p_atd.nome AS atendente_nome " +
            "FROM Agendamento a " +
            "INNER JOIN Paciente pac ON a.id_paciente = pac.id_pessoa " +
            "INNER JOIN Pessoa p_pac ON pac.id_pessoa = p_pac.id " +
            "INNER JOIN Medico med ON a.id_medico = med.id_pessoa " +
            "INNER JOIN Pessoa p_med ON med.id_pessoa = p_med.id " +
            "LEFT JOIN Medico_Especialidade me ON med.id_pessoa = me.id_medico " +
            "LEFT JOIN Atendente atd ON a.id_atendente = atd.id_pessoa " +
            "LEFT JOIN Pessoa p_atd ON atd.id_pessoa = p_atd.id ";

    private static final String GROUP_BY = " GROUP BY a.id_agendamento ";

    private static final String ORDER_BY = "  ORDER BY a.data_hora";

    public AgendamentoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Agendamento> rowMapper = (rs, rowNum) -> {
        Pessoa pessoaPaciente = new Pessoa.Builder()
                .id(rs.getInt("id_paciente"))
                .nome(rs.getString("paciente_nome"))
                .cpf(rs.getString("paciente_cpf"))
                .build();
        Paciente paciente = new Paciente.Builder().pessoa(pessoaPaciente).build();

        Integer idAtendente = rs.getObject("id_atendente", Integer.class);
        Atendente atendente = null;
        if (idAtendente != null) {
            Pessoa pessoaAtendente = new Pessoa.Builder()
                    .id(idAtendente)
                    .nome(rs.getString("atendente_nome"))
                    .build();
            atendente = new Atendente.Builder().pessoa(pessoaAtendente).build();
        }

        Pessoa pessoaMedico = new Pessoa.Builder()
                .id(rs.getInt("id_medico"))
                .nome(rs.getString("medico_nome"))
                .build();

        String espStr = rs.getString("medico_especialidades");
        List<String> especialidades = new ArrayList<>();
        if (espStr != null && !espStr.trim().isEmpty()) {
            for (String especialidade : espStr.split(",")) {
                especialidades.add(especialidade.trim());
            }
        }

        Medico medico = new Medico.Builder()
                .pessoa(pessoaMedico)
                .especialidades(especialidades)
                .build();

        return new Agendamento.Builder()
                .idAgendamento(rs.getInt("id_agendamento"))
                .paciente(paciente)
                .atendente(atendente)
                .medico(medico)
                .idAgendamentoPai(rs.getObject("id_agendamento_pai", Integer.class))
                .dataHora(rs.getObject("data_hora", LocalDateTime.class))
                .status(StatusAgendamento.fromValorBanco(rs.getString("status")))
                .build();
    };

    public Agendamento save(Agendamento agendamento) {
        String sql = "INSERT INTO Agendamento "
                + "(id_paciente, id_atendente, id_medico, id_agendamento_pai, data_hora, status) "
                + "VALUES (?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, agendamento.getPaciente().getPessoa().getId());
            ps.setObject(2, agendamento.getAtendente() != null ? agendamento.getAtendente().getPessoa().getId() : null);
            ps.setInt(3, agendamento.getMedico().getPessoa().getId());
            ps.setObject(4, agendamento.getIdAgendamentoPai());
            ps.setObject(5, agendamento.getDataHora());
            ps.setString(6, agendamento.getStatus().getValorBanco());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();

        if (key == null) {
            throw new IllegalStateException("Não foi possível obter o ID do agendamento recém-criado.");
        }

        return findById(key.intValue()).orElseThrow(
                () -> new IllegalStateException("Agendamento criado, mas não encontrado após a inserção."));
    }

    public void update(Agendamento agendamento) {
        String sql = "UPDATE Agendamento SET id_paciente = ?, id_atendente = ?, id_medico = ?, "
                + "id_agendamento_pai = ?, data_hora = ?, status = ? WHERE id_agendamento = ?";
        jdbcTemplate.update(sql,
                agendamento.getPaciente().getPessoa().getId(),
                agendamento.getAtendente() != null ? agendamento.getAtendente().getPessoa().getId() : null,
                agendamento.getMedico().getPessoa().getId(),
                agendamento.getIdAgendamentoPai(),
                agendamento.getDataHora(),
                agendamento.getStatus().getValorBanco(),
                agendamento.getIdAgendamento());
    }

    public void updateStatus(Integer id, StatusAgendamento status) {
        String sql = "UPDATE Agendamento SET status = ? WHERE id_agendamento = ?";
        jdbcTemplate.update(sql, status.getValorBanco(), id);
    }

    public List<Agendamento> findAll() {
        return jdbcTemplate.query(BASE_QUERY + GROUP_BY, rowMapper);
    }

    public Optional<Agendamento> findById(Integer id) {
        String sql = BASE_QUERY + " WHERE a.id_agendamento = ?" + GROUP_BY;
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }

    public List<Agendamento> findByMedicoId(Integer idMedico) {
        String sql = BASE_QUERY + " WHERE a.id_medico = ?" + GROUP_BY + ORDER_BY;
        return jdbcTemplate.query(sql, rowMapper, idMedico);
    }

    public List<Agendamento> findByPacienteId(Integer idPaciente) {
        String sql = BASE_QUERY + " WHERE a.id_paciente = ?" + GROUP_BY + ORDER_BY;
        return jdbcTemplate.query(sql, rowMapper, idPaciente);
    }

    public List<Agendamento> findAtivosByMedicoIdAndData(Integer idMedico, LocalDate data) {
        String sql = BASE_QUERY +
                " WHERE a.id_medico = ? AND DATE(a.data_hora) = ? AND a.status <> ? " +
                GROUP_BY + ORDER_BY;
        return jdbcTemplate.query(sql, rowMapper, idMedico, data, StatusAgendamento.CANCELADO.getValorBanco());
    }

    public boolean existsConflitoAtivo(Integer idMedico, LocalDateTime dataHora, Integer idIgnorado) {
        String sql = "SELECT COUNT(*) FROM Agendamento "
                + "WHERE id_medico = ? AND data_hora = ? AND status <> ? "
                + "AND (? IS NULL OR id_agendamento <> ?)";
        Integer total = jdbcTemplate.queryForObject(sql, Integer.class,
                idMedico,
                dataHora,
                StatusAgendamento.CANCELADO.getValorBanco(),
                idIgnorado,
                idIgnorado);
        return total != null && total > 0;
    }

    public void delete(Integer id) {
        jdbcTemplate.update("DELETE FROM Agendamento WHERE id_agendamento = ?", id);
    }
}