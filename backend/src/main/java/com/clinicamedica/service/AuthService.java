package com.clinicamedica.service;

import com.clinicamedica.dto.request.LoginRequestDTO;
import com.clinicamedica.dto.response.LoginResponseDTO;
import com.clinicamedica.exception.CredenciaisInvalidasException;
import com.clinicamedica.model.Pessoa;
import com.clinicamedica.repository.PessoaRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AuthService {

    private final PessoaRepository pessoaRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    public AuthService(PessoaRepository pessoaRepository, PasswordEncoder passwordEncoder, JdbcTemplate jdbcTemplate) {
        this.pessoaRepository = pessoaRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    public LoginResponseDTO autenticar(LoginRequestDTO request) {
        // Busca a pessoa pelo CPF
        Pessoa pessoa = pessoaRepository.findByCpf(request.cpf())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas: Usuário não encontrado."));

        // Compara a senha digitada com o hash Argon2 armazenado no banco
        if (!passwordEncoder.matches(request.senha(), pessoa.getSenha())) {
            throw new CredenciaisInvalidasException("Credenciais inválidas: Senha incorreta.");
        }

        // Varre as tabelas filhas em busca de vínculos ativos
        List<String> perfis = new ArrayList<>();

        if (pessoa.getEhAdministrador() == 1) {
            perfis.add("ADMINISTRADOR");
        }

        if (ehMedico(pessoa.getId())) {
            perfis.add("MEDICO");
        }

        if (ehPaciente(pessoa.getId())) {
            perfis.add("PACIENTE");
        }

        if (ehAtendente(pessoa.getId())) {
            perfis.add("ATENDENTE");
        }

        if (perfis.isEmpty()) {
            throw new IllegalStateException("Erro de integridade: Usuário sem perfis atribuídos.");
        }

        return new LoginResponseDTO("SESSION_MOCK_TOKEN", pessoa.getNome(), pessoa.getEmail(), perfis);
    }

    private boolean existeRegistro(String sql, Integer idPessoa) {
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, idPessoa);
        return count != null && count > 0;
    }

    private boolean ehMedico(Integer idPessoa) {
        return existeRegistro(
                "SELECT COUNT(*) FROM Medico WHERE id_pessoa = ?",
                idPessoa);
    }

    private boolean ehPaciente(Integer idPessoa) {
        return existeRegistro(
                "SELECT COUNT(*) FROM Paciente WHERE id_pessoa = ?",
                idPessoa);
    }

    private boolean ehAtendente(Integer idPessoa) {
        return existeRegistro(
                "SELECT COUNT(*) FROM Atendente WHERE id_pessoa = ?",
                idPessoa);
    }
}