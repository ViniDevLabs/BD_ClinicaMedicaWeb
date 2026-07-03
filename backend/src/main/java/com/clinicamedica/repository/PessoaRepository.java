package com.clinicamedica.repository;

import com.clinicamedica.model.Pessoa;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public class PessoaRepository {

    private final JdbcTemplate jdbcTemplate;

    public PessoaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Pessoa> rowMapper = (rs, rowNum) -> new Pessoa.Builder()
            .id(rs.getInt("id"))
            .cpf(rs.getString("cpf"))
            .nome(rs.getString("nome"))
            .email(rs.getString("email"))
            .senha(rs.getString("senha"))
            .dataNascimento(rs.getObject("data_nascimento", LocalDate.class))
            .ehAdministrador(rs.getInt("eh_administrador"))
            .build();

    public Pessoa save(Pessoa pessoa) {
        String sql = "INSERT INTO Pessoa (cpf, nome, email, senha, data_nascimento, eh_administrador) VALUES (?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, pessoa.getCpf());
            ps.setString(2, pessoa.getNome());
            ps.setString(3, pessoa.getEmail());
            ps.setString(4, pessoa.getSenha());
            ps.setObject(5, pessoa.getDataNascimento());
            ps.setInt(6, pessoa.getEhAdministrador());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();

        if (key == null) {
            throw new IllegalStateException(
                    "Falha crítica: O banco de dados não retornou o ID gerado para a Pessoa (CPF: " + pessoa.getCpf()
                            + ").");
        }

        pessoa.setId(key.intValue());
        return pessoa;
    }

    public Optional<Pessoa> findById(Integer id) {
        String sql = "SELECT * FROM Pessoa WHERE id = ?";
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }

    public void update(Pessoa pessoa) {
        String sql = "UPDATE Pessoa SET nome = ?, email = ?, senha = ?, data_nascimento = ?, eh_administrador = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                pessoa.getNome(),
                pessoa.getEmail(),
                pessoa.getSenha(),
                pessoa.getDataNascimento(),
                pessoa.getEhAdministrador(),
                pessoa.getId());
    }

    public void delete(Integer id) {
        String sql = "DELETE FROM Pessoa WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}