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
import java.util.List;
import java.util.Optional;

@Repository
public class AgendamentoRepository {

    private final JdbcTemplate jdbcTemplate;

    public AgendamentoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Agendamento> rowMapper = (rs, rowNum) -> {
        Paciente paciente = new Paciente.Builder()
                .pessoa(new Pessoa.Builder().id(rs.getInt("id_paciente")).build())
                .build();

        Integer idAtendente = rs.getObject("id_atendente", Integer.class);
        Atendente atendente = idAtendente != null
                ? new Atendente.Builder().pessoa(new Pessoa.Builder().id(idAtendente).build()).build()
                : null;

        Medico medico = new Medico.Builder()
                .pessoa(new Pessoa.Builder().id(rs.getInt("id_medico")).build())
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

        return findById(keyHolder.getKey().intValue()).orElse(agendamento);
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
        return jdbcTemplate.query("SELECT * FROM Agendamento", rowMapper);
    }

    public Optional<Agendamento> findById(Integer id) {
        String sql = "SELECT * FROM Agendamento WHERE id_agendamento = ?";
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }

    public List<Agendamento> findByMedicoId(Integer idMedico) {
        String sql = "SELECT * FROM Agendamento WHERE id_medico = ? ORDER BY data_hora";
        return jdbcTemplate.query(sql, rowMapper, idMedico);
    }

    public List<Agendamento> findByPacienteId(Integer idPaciente) {
        String sql = "SELECT * FROM Agendamento WHERE id_paciente = ? ORDER BY data_hora";
        return jdbcTemplate.query(sql, rowMapper, idPaciente);
    }

    public List<Agendamento> findAtivosByMedicoIdAndData(Integer idMedico, LocalDate data) {
        String sql = "SELECT * FROM Agendamento "
                + "WHERE id_medico = ? AND DATE(data_hora) = ? AND status <> ? ORDER BY data_hora";
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
