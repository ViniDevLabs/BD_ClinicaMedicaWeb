package com.clinicamedica.repository;

import com.clinicamedica.model.ExcecaoAgenda;
import com.clinicamedica.model.Medico;
import com.clinicamedica.model.Pessoa;
import com.clinicamedica.model.TipoExcecaoAgenda;
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
public class ExcecaoAgendaRepository {

    private final JdbcTemplate jdbcTemplate;

    public ExcecaoAgendaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ExcecaoAgenda> rowMapper = (rs, rowNum) -> {
        Medico medico = new Medico.Builder()
                .pessoa(new Pessoa.Builder().id(rs.getInt("id_medico")).build())
                .build();

        return new ExcecaoAgenda.Builder()
                .idExcecao(rs.getInt("id_excecao"))
                .medico(medico)
                .dataExcecao(rs.getObject("data_excecao", LocalDate.class))
                .tipoExcecao(TipoExcecaoAgenda.fromValorBanco(rs.getString("tipo_excecao")))
                .horarioInicio(rs.getObject("horario_inicio", LocalTime.class))
                .horarioFim(rs.getObject("horario_fim", LocalTime.class))
                .build();
    };

    public ExcecaoAgenda save(ExcecaoAgenda excecao) {
        String sql = "INSERT INTO Excecao_Agenda "
                + "(id_medico, data_excecao, tipo_excecao, horario_inicio, horario_fim) "
                + "VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, excecao.getMedico().getPessoa().getId());
            ps.setObject(2, excecao.getDataExcecao());
            ps.setString(3, excecao.getTipoExcecao().getValorBanco());
            ps.setObject(4, excecao.getHorarioInicio());
            ps.setObject(5, excecao.getHorarioFim());
            return ps;
        }, keyHolder);

        return findById(keyHolder.getKey().intValue()).orElse(excecao);
    }

    public void update(ExcecaoAgenda excecao) {
        String sql = "UPDATE Excecao_Agenda SET id_medico = ?, data_excecao = ?, tipo_excecao = ?, "
                + "horario_inicio = ?, horario_fim = ? WHERE id_excecao = ?";
        jdbcTemplate.update(sql,
                excecao.getMedico().getPessoa().getId(),
                excecao.getDataExcecao(),
                excecao.getTipoExcecao().getValorBanco(),
                excecao.getHorarioInicio(),
                excecao.getHorarioFim(),
                excecao.getIdExcecao());
    }

    public List<ExcecaoAgenda> findAll() {
        return jdbcTemplate.query("SELECT * FROM Excecao_Agenda", rowMapper);
    }

    public Optional<ExcecaoAgenda> findById(Integer id) {
        String sql = "SELECT * FROM Excecao_Agenda WHERE id_excecao = ?";
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }

    public List<ExcecaoAgenda> findByMedicoId(Integer idMedico) {
        String sql = "SELECT * FROM Excecao_Agenda WHERE id_medico = ? ORDER BY data_excecao, horario_inicio";
        return jdbcTemplate.query(sql, rowMapper, idMedico);
    }

    public List<ExcecaoAgenda> findByMedicoIdAndData(Integer idMedico, LocalDate data) {
        String sql = "SELECT * FROM Excecao_Agenda WHERE id_medico = ? AND data_excecao = ? ORDER BY horario_inicio";
        return jdbcTemplate.query(sql, rowMapper, idMedico, data);
    }

    public void delete(Integer id) {
        jdbcTemplate.update("DELETE FROM Excecao_Agenda WHERE id_excecao = ?", id);
    }
}
