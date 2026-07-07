package com.clinicamedica.repository;

import com.clinicamedica.model.DiaSemana;
import com.clinicamedica.model.DisponibilidadePadrao;
import com.clinicamedica.model.Medico;
import com.clinicamedica.model.Pessoa;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public class DisponibilidadePadraoRepository {

    private final JdbcTemplate jdbcTemplate;

    public DisponibilidadePadraoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<DisponibilidadePadrao> rowMapper = (rs, rowNum) -> {
        Medico medico = new Medico.Builder()
                .pessoa(new Pessoa.Builder().id(rs.getInt("id_medico")).build())
                .build();

        return new DisponibilidadePadrao.Builder()
                .idDisponibilidade(rs.getInt("id_disponibilidade"))
                .medico(medico)
                .dataInicio(rs.getObject("data_inicio", LocalDate.class))
                .dataFim(rs.getObject("data_fim", LocalDate.class))
                .horarioInicio(rs.getObject("horario_inicio", LocalTime.class))
                .horarioFim(rs.getObject("horario_fim", LocalTime.class))
                .diaSemana(DiaSemana.fromValorBanco(rs.getString("dia_semana")))
                .duracaoConsulta(rs.getInt("duracao_consulta"))
                .build();
    };

    public DisponibilidadePadrao save(DisponibilidadePadrao disponibilidade) {
        String sql = "INSERT INTO Disponibilidade_Padrao "
                + "(id_medico, data_inicio, data_fim, horario_inicio, horario_fim, dia_semana, duracao_consulta) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, disponibilidade.getMedico().getPessoa().getId());
            ps.setObject(2, disponibilidade.getDataInicio());
            ps.setObject(3, disponibilidade.getDataFim());
            ps.setObject(4, disponibilidade.getHorarioInicio());
            ps.setObject(5, disponibilidade.getHorarioFim());
            ps.setString(6, disponibilidade.getDiaSemana().getValorBanco());
            ps.setInt(7, disponibilidade.getDuracaoConsulta());
            return ps;
        }, keyHolder);

        return findById(keyHolder.getKey().intValue()).orElse(disponibilidade);
    }

    public void update(DisponibilidadePadrao disponibilidade) {
        String sql = "UPDATE Disponibilidade_Padrao SET id_medico = ?, data_inicio = ?, data_fim = ?, "
                + "horario_inicio = ?, horario_fim = ?, dia_semana = ?, duracao_consulta = ? "
                + "WHERE id_disponibilidade = ?";
        jdbcTemplate.update(sql,
                disponibilidade.getMedico().getPessoa().getId(),
                disponibilidade.getDataInicio(),
                disponibilidade.getDataFim(),
                disponibilidade.getHorarioInicio(),
                disponibilidade.getHorarioFim(),
                disponibilidade.getDiaSemana().getValorBanco(),
                disponibilidade.getDuracaoConsulta(),
                disponibilidade.getIdDisponibilidade());
    }

    public List<DisponibilidadePadrao> findAll() {
        return jdbcTemplate.query("SELECT * FROM Disponibilidade_Padrao", rowMapper);
    }

    public Optional<DisponibilidadePadrao> findById(Integer id) {
        String sql = "SELECT * FROM Disponibilidade_Padrao WHERE id_disponibilidade = ?";
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }

    public List<DisponibilidadePadrao> findByMedicoId(Integer idMedico) {
        String sql = "SELECT * FROM Disponibilidade_Padrao WHERE id_medico = ? ORDER BY data_inicio, horario_inicio";
        return jdbcTemplate.query(sql, rowMapper, idMedico);
    }

    public List<DisponibilidadePadrao> findValidasPorMedicoEData(Integer idMedico, LocalDate data, DiaSemana diaSemana) {
        String sql = "SELECT * FROM Disponibilidade_Padrao "
                + "WHERE id_medico = ? AND dia_semana = ? AND data_inicio <= ? "
                + "AND (data_fim IS NULL OR data_fim >= ?) "
                + "ORDER BY horario_inicio";
        return jdbcTemplate.query(sql, rowMapper, idMedico, diaSemana.getValorBanco(), data, data);
    }

    public Optional<Integer> findPrimeiraDuracaoPorMedico(Integer idMedico) {
        String sql = "SELECT duracao_consulta FROM Disponibilidade_Padrao "
                + "WHERE id_medico = ? ORDER BY data_inicio, horario_inicio LIMIT 1";
        return jdbcTemplate.query(sql, (rs, rowNum) -> rs.getInt("duracao_consulta"), idMedico).stream().findFirst();
    }

    public void delete(Integer id) {
        jdbcTemplate.update("DELETE FROM Disponibilidade_Padrao WHERE id_disponibilidade = ?", id);
    }
}
