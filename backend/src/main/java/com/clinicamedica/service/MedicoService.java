package com.clinicamedica.service;

import com.clinicamedica.config.SecurityUtils;
import com.clinicamedica.model.Medico;
import com.clinicamedica.model.Pessoa;
import com.clinicamedica.repository.MedicoRepository;
import com.clinicamedica.repository.PessoaRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MedicoService {

    private final PessoaRepository pessoaRepository;
    private final MedicoRepository medicoRepository;
    private final PasswordEncoder passwordEncoder;

    public MedicoService(PessoaRepository pessoaRepository, MedicoRepository medicoRepository,
            PasswordEncoder passwordEncoder) {
        this.pessoaRepository = pessoaRepository;
        this.medicoRepository = medicoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Medico salvarMedico(Medico medico) {
        Optional<Pessoa> pessoaExistente = pessoaRepository.findByCpf(medico.getPessoa().getCpf());
        Pessoa pessoaParaVincular;

        if (pessoaExistente.isPresent()) {
            pessoaParaVincular = pessoaExistente.get();
        } else {
            String senhaCrua = medico.getPessoa().getSenha();
            if (senhaCrua == null || senhaCrua.trim().isEmpty()) {
                throw new IllegalArgumentException("A senha é obrigatória para novos cadastros.");
            }

            String senhaHasheada = passwordEncoder.encode(senhaCrua);

            Pessoa novaPessoa = new Pessoa.Builder()
                    .cpf(medico.getPessoa().getCpf())
                    .nome(medico.getPessoa().getNome())
                    .email(medico.getPessoa().getEmail())
                    .senha(senhaHasheada)
                    .dataNascimento(medico.getPessoa().getDataNascimento())
                    .ehAdministrador(medico.getPessoa().getEhAdministrador())
                    .build();

            pessoaParaVincular = pessoaRepository.save(novaPessoa);
        }

        Medico medicoPronto = new Medico.Builder()
                .pessoa(pessoaParaVincular)
                .numero(medico.getNumero())
                .estado(medico.getEstado())
                .especialidades(medico.getEspecialidades())
                .build();

        medicoRepository.save(medicoPronto);
        return medicoPronto;
    }

    @Transactional
    public void excluirMedico(Integer id) {
        // Valida a existência do médico
        buscarPorId(id);

        medicoRepository.delete(id);

        int perfisRestantes = pessoaRepository.countAssociatedProfiles(id);

        if (perfisRestantes == 0) {
            pessoaRepository.delete(id);
        }
    }

    public List<Medico> listarTodos() {
        return medicoRepository.findAll();
    }

    public Medico buscarPorId(Integer id) {
        return medicoRepository.findById(id)
                .orElseThrow(() -> new EmptyResultDataAccessException("Médico não encontrado", 1));
    }

    @Transactional
    public Medico atualizarMedico(Integer id, Medico medico) {
        SecurityUtils.verificarPermissaoOuProprioId(id, "ADMINISTRADOR");

        Medico existente = buscarPorId(id);
        medico.getPessoa().setId(existente.getPessoa().getId());

        String novaSenha = medico.getPessoa().getSenha();

        if (novaSenha != null && !novaSenha.trim().isEmpty()) {
            medico.getPessoa().setSenha(passwordEncoder.encode(novaSenha));
        } else {
            medico.getPessoa().setSenha(existente.getPessoa().getSenha());
        }

        pessoaRepository.update(medico.getPessoa());
        medicoRepository.update(medico);

        return medico;
    }
}