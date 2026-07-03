package com.clinicamedica.service;

import com.clinicamedica.model.Atendente;
import com.clinicamedica.model.Pessoa;
import com.clinicamedica.repository.AtendenteRepository;
import com.clinicamedica.repository.PessoaRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AtendenteService {

    private final PessoaRepository pessoaRepository;
    private final AtendenteRepository atendenteRepository;

    public AtendenteService(PessoaRepository pessoaRepository, AtendenteRepository atendenteRepository) {
        this.pessoaRepository = pessoaRepository;
        this.atendenteRepository = atendenteRepository;
    }

    @Transactional
    public Atendente salvarAtendente(Atendente atendente) {
        Pessoa pessoaSalva = pessoaRepository.save(atendente.getPessoa());

        Atendente atendentePronto = new Atendente.Builder()
                .pessoa(pessoaSalva)
                .matricula(atendente.getMatricula())
                .build();

        atendenteRepository.save(atendentePronto);
        return atendentePronto;
    }

    @Transactional
    public Atendente atualizarAtendente(Integer id, Atendente atendenteAtualizado) {
        Atendente existente = buscarPorId(id);

        atendenteAtualizado.getPessoa().setId(existente.getPessoa().getId());

        pessoaRepository.update(atendenteAtualizado.getPessoa());
        atendenteRepository.update(atendenteAtualizado);

        return atendenteAtualizado;
    }

    @Transactional
    public void excluirAtendente(Integer id) {
        buscarPorId(id);
        pessoaRepository.delete(id);
    }

    public List<Atendente> listarTodos() {
        return atendenteRepository.findAll();
    }

    public Atendente buscarPorId(Integer id) {
        return atendenteRepository.findById(id)
                .orElseThrow(() -> new EmptyResultDataAccessException("Atendente não encontrado", 1));
    }
}