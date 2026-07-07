package com.clinicamedica.service;

import com.clinicamedica.model.ProntuarioClinico;
import com.clinicamedica.repository.AgendamentoRepository;
import com.clinicamedica.repository.ProntuarioClinicoRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProntuarioClinicoService {

    private final ProntuarioClinicoRepository prontuarioRepository;
    private final AgendamentoRepository agendamentoRepository;

    public ProntuarioClinicoService(ProntuarioClinicoRepository prontuarioRepository,
            AgendamentoRepository agendamentoRepository) {
        this.prontuarioRepository = prontuarioRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    @Transactional
    public ProntuarioClinico salvar(ProntuarioClinico prontuario) {
        validar(prontuario, null);
        return prontuarioRepository.save(prontuario);
    }

    public List<ProntuarioClinico> listarTodos() {
        return prontuarioRepository.findAll();
    }

    public ProntuarioClinico buscarPorId(Integer id) {
        return prontuarioRepository.findById(id)
                .orElseThrow(() -> new EmptyResultDataAccessException("Prontuário clínico não encontrado", 1));
    }

    public ProntuarioClinico buscarPorAgendamento(Integer idAgendamento) {
        validarAgendamentoExiste(idAgendamento);
        return prontuarioRepository.findByAgendamentoId(idAgendamento)
                .orElseThrow(() -> new EmptyResultDataAccessException(
                        "Prontuário clínico não encontrado para o agendamento", 1));
    }

    @Transactional
    public ProntuarioClinico atualizar(Integer id, ProntuarioClinico prontuario) {
        buscarPorId(id);
        validar(prontuario, id);
        prontuarioRepository.update(prontuario);
        return buscarPorId(id);
    }

    @Transactional
    public void excluir(Integer id) {
        buscarPorId(id);
        prontuarioRepository.delete(id);
    }

    private void validar(ProntuarioClinico prontuario, Integer idIgnorado) {
        validarAgendamentoExiste(prontuario.getIdAgendamento());

        Optional<ProntuarioClinico> existente = prontuarioRepository
                .findByAgendamentoId(prontuario.getIdAgendamento());

        if (existente.isPresent() && !existente.get().getIdProntuario().equals(idIgnorado)) {
            throw new IllegalArgumentException("Já existe prontuário clínico para este agendamento.");
        }
    }

    private void validarAgendamentoExiste(Integer idAgendamento) {
        agendamentoRepository.findById(idAgendamento)
                .orElseThrow(() -> new EmptyResultDataAccessException("Agendamento não encontrado", 1));
    }
}
