package com.clinicamedica.service;

import com.clinicamedica.config.SecurityUtils;
import com.clinicamedica.model.Atendente;
import com.clinicamedica.model.Pessoa;
import com.clinicamedica.repository.AtendenteRepository;
import com.clinicamedica.repository.PessoaRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AtendenteService {

    private final PessoaRepository pessoaRepository;
    private final AtendenteRepository atendenteRepository;
    private final PasswordEncoder passwordEncoder;

    public AtendenteService(PessoaRepository pessoaRepository, AtendenteRepository atendenteRepository,
            PasswordEncoder passwordEncoder) {
        this.pessoaRepository = pessoaRepository;
        this.atendenteRepository = atendenteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Atendente salvarAtendente(Atendente atendente) {
        Optional<Pessoa> pessoaExistente = pessoaRepository.findByCpf(atendente.getPessoa().getCpf());
        Pessoa pessoaParaVincular;

        if (pessoaExistente.isPresent()) {
            pessoaParaVincular = pessoaExistente.get();
        } else {
            String senhaHasheada = passwordEncoder.encode(atendente.getPessoa().getSenha());

            Pessoa novaPessoa = new Pessoa.Builder()
                    .cpf(atendente.getPessoa().getCpf())
                    .nome(atendente.getPessoa().getNome())
                    .email(atendente.getPessoa().getEmail())
                    .senha(senhaHasheada)
                    .dataNascimento(atendente.getPessoa().getDataNascimento())
                    .ehAdministrador(atendente.getPessoa().getEhAdministrador())
                    .build();

            pessoaParaVincular = pessoaRepository.save(novaPessoa);
        }

        Atendente atendentePronto = new Atendente.Builder()
                .pessoa(pessoaParaVincular)
                .matricula(atendente.getMatricula())
                .build();

        atendenteRepository.save(atendentePronto);
        return atendentePronto;
    }

    @Transactional
    public void excluirAtendente(Integer id) {
        // Valida a existência do atendente
        buscarPorId(id);

        atendenteRepository.delete(id);

        int perfisRestantes = pessoaRepository.countAssociatedProfiles(id);

        if (perfisRestantes == 0) {
            pessoaRepository.delete(id);
        }
    }

    public List<Atendente> listarTodos() {
        return atendenteRepository.findAll();
    }

    public Atendente buscarPorId(Integer id) {
        return atendenteRepository.findById(id)
                .orElseThrow(() -> new EmptyResultDataAccessException("Atendente não encontrado", 1));
    }

    @Transactional
    public Atendente atualizarAtendente(Integer id, Atendente atendenteAtualizado) {
        SecurityUtils.verificarPermissaoOuProprioId(id, "ADMINISTRADOR");

        Atendente existente = buscarPorId(id);
        atendenteAtualizado.getPessoa().setId(existente.getPessoa().getId());

        pessoaRepository.update(atendenteAtualizado.getPessoa());
        atendenteRepository.update(atendenteAtualizado);

        return atendenteAtualizado;
    }
}