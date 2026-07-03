package com.clinicamedica.service;

import com.clinicamedica.model.Paciente;
import com.clinicamedica.model.Pessoa;
import com.clinicamedica.repository.PacienteRepository;
import com.clinicamedica.repository.PessoaRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PacienteService {

    private final PessoaRepository pessoaRepository;
    private final PacienteRepository pacienteRepository;

    public PacienteService(PessoaRepository pessoaRepository, PacienteRepository pacienteRepository) {
        this.pessoaRepository = pessoaRepository;
        this.pacienteRepository = pacienteRepository;
    }

    @Transactional
    public Paciente salvarPaciente(Paciente paciente) {
        Pessoa pessoaSalva = pessoaRepository.save(paciente.getPessoa());

        Paciente pacientePronto = new Paciente.Builder()
                .pessoa(pessoaSalva)
                .convenio(paciente.getConvenio())
                .numCarteirinha(paciente.getNumCarteirinha())
                .build();

        pacienteRepository.save(pacientePronto);
        return pacientePronto;
    }

    @Transactional
    public Paciente atualizarPaciente(Integer id, Paciente pacienteAtualizado) {
        Paciente existente = buscarPorId(id);

        pacienteAtualizado.getPessoa().setId(existente.getPessoa().getId());

        pessoaRepository.update(pacienteAtualizado.getPessoa());
        pacienteRepository.update(pacienteAtualizado);

        return pacienteAtualizado;
    }

    @Transactional
    public void excluirPaciente(Integer id) {
        buscarPorId(id);
        pessoaRepository.delete(id);
    }

    public List<Paciente> listarTodos() {
        return pacienteRepository.findAll();
    }

    public Paciente buscarPorId(Integer id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new EmptyResultDataAccessException("Paciente não encontrado", 1));
    }
}