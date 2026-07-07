package com.clinicamedica.repository;

import com.clinicamedica.model.Exame;
import com.clinicamedica.model.LocalRealizacaoExame;
import com.clinicamedica.model.StatusExame;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class ExameRepository {

    private final JdbcTemplate jdbcTemplate;

    public ExameRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Exame> rowMapper = (rs, rowNum) -> new Exame.Builder()
            .idExame(rs.getInt("id_exame"))
            .idAgendamento(rs.getInt("id_agendamento"))
            .nomeExame(rs.getString("nome_exame"))
            .dataSolicitacao(rs.getObject("data_solicitacao", LocalDate.class))
            .localRealizacao(LocalRealizacaoExame.fromValorBanco(rs.getString("local_realizacao")))
            .observacoesMedicas(rs.getString("observacoes_medicas"))
            .arquivoLaudoPath(rs.getString("arquivo_laudo_path"))
            .status(StatusExame.fromValorBanco(rs.getString("status")))
            .build();

    public Exame save(Exame exame) {
        String sql = "INSERT INTO Exame "
                + "(id_agendamento, nome_exame, data_solicitacao, local_realizacao, observacoes_medicas, "
                + "arquivo_laudo_path, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, exame.getIdAgendamento());
            ps.setString(2, exame.getNomeExame());
            ps.setObject(3, exame.getDataSolicitacao());
            ps.setString(4, exame.getLocalRealizacao().getValorBanco());
            ps.setString(5, exame.getObservacoesMedicas());
            ps.setString(6, exame.getArquivoLaudoPath());
            ps.setString(7, exame.getStatus().getValorBanco());
            return ps;
        }, keyHolder);

        return findById(keyHolder.getKey().intValue()).orElse(exame);
    }

    public void update(Exame exame) {
        String sql = "UPDATE Exame SET id_agendamento = ?, nome_exame = ?, data_solicitacao = ?, "
                + "local_realizacao = ?, observacoes_medicas = ?, arquivo_laudo_path = ?, status = ? "
                + "WHERE id_exame = ?";
        jdbcTemplate.update(sql,
                exame.getIdAgendamento(),
                exame.getNomeExame(),
                exame.getDataSolicitacao(),
                exame.getLocalRealizacao().getValorBanco(),
                exame.getObservacoesMedicas(),
                exame.getArquivoLaudoPath(),
                exame.getStatus().getValorBanco(),
                exame.getIdExame());
    }

    public void updateStatus(Integer id, StatusExame status) {
        String sql = "UPDATE Exame SET status = ? WHERE id_exame = ?";
        jdbcTemplate.update(sql, status.getValorBanco(), id);
    }

    public void anexarLaudo(Integer id, String arquivoLaudoPath, StatusExame status) {
        String sql = "UPDATE Exame SET arquivo_laudo_path = ?, status = ? WHERE id_exame = ?";
        jdbcTemplate.update(sql, arquivoLaudoPath, status.getValorBanco(), id);
    }

    public List<Exame> findAll() {
        return jdbcTemplate.query("SELECT * FROM Exame", rowMapper);
    }

    public Optional<Exame> findById(Integer id) {
        String sql = "SELECT * FROM Exame WHERE id_exame = ?";
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }

    public List<Exame> findByAgendamentoId(Integer idAgendamento) {
        String sql = "SELECT * FROM Exame WHERE id_agendamento = ? ORDER BY data_solicitacao";
        return jdbcTemplate.query(sql, rowMapper, idAgendamento);
    }

    public void delete(Integer id) {
        jdbcTemplate.update("DELETE FROM Exame WHERE id_exame = ?", id);
    }
}
