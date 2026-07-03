package com.clinicamedica.service;

import com.clinicamedica.model.Medico;
import com.clinicamedica.model.Pessoa;
import com.clinicamedica.repository.MedicoRepository;
import com.clinicamedica.repository.PessoaRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MedicoService {

    private final PessoaRepository pessoaRepository;
    private final MedicoRepository medicoRepository;

    public MedicoService(PessoaRepository pessoaRepository, MedicoRepository medicoRepository) {
        this.pessoaRepository = pessoaRepository;
        this.medicoRepository = medicoRepository;
    }

    @Transactional
    public Medico salvarMedico(Medico medico) {
        Pessoa pessoaSalva = pessoaRepository.save(medico.getPessoa());

        Medico medicoPronto = new Medico.Builder()
                .pessoa(pessoaSalva)
                .numero(medico.getNumero())
                .estado(medico.getEstado())
                .especialidades(medico.getEspecialidades())
                .build();

        medicoRepository.save(medicoPronto);
        return medicoPronto;
    }

    @Transactional
    public Medico atualizarMedico(Integer id, Medico medicoAtualizado) {
        Medico existente = buscarPorId(id);

        medicoAtualizado.getPessoa().setId(existente.getPessoa().getId());

        pessoaRepository.update(medicoAtualizado.getPessoa());
        medicoRepository.update(medicoAtualizado);

        return medicoAtualizado;
    }

    @Transactional
    public void excluirMedico(Integer id) {
        buscarPorId(id);
        pessoaRepository.delete(id);
    }

    public List<Medico> listarTodos() {
        return medicoRepository.findAll();
    }

    public Medico buscarPorId(Integer id) {
        return medicoRepository.findById(id)
                .orElseThrow(() -> new EmptyResultDataAccessException("Médico não encontrado", 1));
    }
}