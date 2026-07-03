package com.clinicamedica.repository;

import com.clinicamedica.model.Paciente;
import com.clinicamedica.model.Pessoa;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class PacienteRepository {

    private final JdbcTemplate jdbcTemplate;

    public PacienteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Paciente> rowMapper = (rs, rowNum) -> {
        Pessoa pessoa = new Pessoa.Builder()
                .id(rs.getInt("id"))
                .cpf(rs.getString("cpf"))
                .nome(rs.getString("nome"))
                .email(rs.getString("email"))
                .senha(rs.getString("senha"))
                .dataNascimento(rs.getObject("data_nascimento", LocalDate.class))
                .ehAdministrador(rs.getInt("eh_administrador"))
                .build();

        return new Paciente.Builder()
                .pessoa(pessoa)
                .convenio(rs.getString("convenio"))
                .numCarteirinha(rs.getString("num_carteirinha"))
                .build();
    };

    public void save(Paciente paciente) {
        String sql = "INSERT INTO Paciente (id_pessoa, convenio, num_carteirinha) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, paciente.getPessoa().getId(), paciente.getConvenio(), paciente.getNumCarteirinha());
    }

    public void update(Paciente paciente) {
        String sql = "UPDATE Paciente SET convenio = ?, num_carteirinha = ? WHERE id_pessoa = ?";
        jdbcTemplate.update(sql, paciente.getConvenio(), paciente.getNumCarteirinha(), paciente.getPessoa().getId());
    }

    public List<Paciente> findAll() {
        String sql = "SELECT p.*, pa.convenio, pa.num_carteirinha FROM Paciente pa " +
                "INNER JOIN Pessoa p ON pa.id_pessoa = p.id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<Paciente> findById(Integer id) {
        String sql = "SELECT p.*, pa.convenio, pa.num_carteirinha FROM Paciente pa " +
                "INNER JOIN Pessoa p ON pa.id_pessoa = p.id WHERE pa.id_pessoa = ?";
        return jdbcTemplate.query(sql, rowMapper, id).stream().findFirst();
    }
}