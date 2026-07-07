package com.clinicamedica.repository;

import com.clinicamedica.model.ProntuarioClinico;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class ProntuarioClinicoRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProntuarioClinicoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ProntuarioClinico> rowMapper = (rs, rowNum) -> new ProntuarioClinico.Builder()
            .idProntuario(rs.getInt("id_prontuario"))
            .idAgendamento(rs.getInt("id_agendamento"))
            .diagnostico(rs.getString("diagnostico"))
            .prescricao(rs.getString("prescricao"))
            .registroObservacoes(rs.getString("registro_observacoes"))
            .build();

    public ProntuarioClinico save(ProntuarioClinico prontuario) {
        String sql = "INSERT INTO Prontuario_Clinico "
                + "(id_agendamento, diagnostico, prescricao, registro_observacoes) VALUES (?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, prontuario.getIdAgendamento());
            ps.setString(2, prontuario.getDiagnostico());
            ps.setString(3, prontuario.getPrescricao());
            ps.setString(4, prontuario.getRegistroObservacoes());
            return ps;
        }, keyHolder);

        return findById(keyHolder.getKey().intValue()).orElse(prontuario);
    }

    public void update(ProntuarioClinico prontuario) {
        String sql = "UPDATE Prontuario_Clinico SET id_agendamento = ?, diagnostico = ?, prescricao = ?, "
                + "registro_observacoes = ? WHERE id_prontuario = ?";
        jdbcTemplate.update(sql,
                prontuario.getIdAgendamento(),
                prontuario.getDiagnostico(),
                prontuario.getPrescricao(),
                prontuario.getRegistroObservacoes(),
                prontuario.getIdProntuario());
    }

    public List<ProntuarioClinico> findAll() {
        return jdbcTemplate.query("SELECT * FROM Prontuario_Clinico", rowMapper);
    }

    public Optional<ProntuarioClinico> findById(Integer id) {
        String sql = "SELECT * FROM Prontuario_Clinico WHERE id_prontuario = ?";
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }

    public Optional<ProntuarioClinico> findByAgendamentoId(Integer idAgendamento) {
        String sql = "SELECT * FROM Prontuario_Clinico WHERE id_agendamento = ?";
        return jdbcTemplate.query(sql, rowMapper, idAgendamento).stream().findFirst();
    }

    public void delete(Integer id) {
        jdbcTemplate.update("DELETE FROM Prontuario_Clinico WHERE id_prontuario = ?", id);
    }
}
