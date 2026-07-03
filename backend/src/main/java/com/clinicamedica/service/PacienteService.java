package com.clinicamedica.service;

import com.clinicamedica.config.SecurityUtils;
import com.clinicamedica.model.Paciente;
import com.clinicamedica.model.Pessoa;
import com.clinicamedica.repository.PacienteRepository;
import com.clinicamedica.repository.PessoaRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    private final PessoaRepository pessoaRepository;
    private final PacienteRepository pacienteRepository;
    private final PasswordEncoder passwordEncoder;

    public PacienteService(PessoaRepository pessoaRepository, PacienteRepository pacienteRepository,
            PasswordEncoder passwordEncoder) {
        this.pessoaRepository = pessoaRepository;
        this.pacienteRepository = pacienteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Paciente salvarPaciente(Paciente paciente) {
        Optional<Pessoa> pessoaExistente = pessoaRepository.findByCpf(paciente.getPessoa().getCpf());
        Pessoa pessoaParaVincular;

        if (pessoaExistente.isPresent()) {
            pessoaParaVincular = pessoaExistente.get();
        } else {
            String senhaHasheada = passwordEncoder.encode(paciente.getPessoa().getSenha());

            Pessoa novaPessoa = new Pessoa.Builder()
                    .cpf(paciente.getPessoa().getCpf())
                    .nome(paciente.getPessoa().getNome())
                    .email(paciente.getPessoa().getEmail())
                    .senha(senhaHasheada)
                    .dataNascimento(paciente.getPessoa().getDataNascimento())
                    .ehAdministrador(paciente.getPessoa().getEhAdministrador())
                    .build();

            pessoaParaVincular = pessoaRepository.save(novaPessoa);
        }

        Paciente pacientePronto = new Paciente.Builder()
                .pessoa(pessoaParaVincular)
                .convenio(paciente.getConvenio())
                .numCarteirinha(paciente.getNumCarteirinha())
                .build();

        pacienteRepository.save(pacientePronto);
        return pacientePronto;
    }

    @Transactional
    public void excluirPaciente(Integer id) {
        // Valida a existência do paciente
        buscarPorId(id);

        pacienteRepository.delete(id);

        int perfisRestantes = pessoaRepository.countAssociatedProfiles(id);

        if (perfisRestantes == 0) {
            pessoaRepository.delete(id);
        }
    }

    public List<Paciente> listarTodos() {
        return pacienteRepository.findAll();
    }

    public Paciente buscarPorId(Integer id) {
        SecurityUtils.verificarPermissaoOuProprioId(id, "ADMINISTRADOR", "ATENDENTE", "MEDICO");
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new EmptyResultDataAccessException("Paciente não encontrado", 1));
    }

    @Transactional
    public Paciente atualizarPaciente(Integer id, Paciente pacienteAtualizado) {
        SecurityUtils.verificarPermissaoOuProprioId(id, "ADMINISTRADOR", "ATENDENTE");

        Paciente existente = buscarPorId(id);
        pacienteAtualizado.getPessoa().setId(existente.getPessoa().getId());

        pessoaRepository.update(pacienteAtualizado.getPessoa());
        pacienteRepository.update(pacienteAtualizado);

        return pacienteAtualizado;
    }
}