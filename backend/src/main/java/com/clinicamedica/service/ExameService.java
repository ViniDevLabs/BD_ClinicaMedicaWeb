package com.clinicamedica.service;

import com.clinicamedica.model.Exame;
import com.clinicamedica.model.StatusExame;
import com.clinicamedica.repository.AgendamentoRepository;
import com.clinicamedica.repository.ExameRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExameService {

    private final ExameRepository exameRepository;
    private final AgendamentoRepository agendamentoRepository;

    public ExameService(ExameRepository exameRepository, AgendamentoRepository agendamentoRepository) {
        this.exameRepository = exameRepository;
        this.agendamentoRepository = agendamentoRepository;
    }

    @Transactional
    public Exame salvar(Exame exame) {
        if (exame.getStatus() != StatusExame.SOLICITADO) {
            throw new IllegalArgumentException("Novo exame deve iniciar com status SOLICITADO.");
        }

        validar(exame);
        return exameRepository.save(exame);
    }

    public List<Exame> listarTodos() {
        return exameRepository.findAll();
    }

    public List<Exame> listarPorAgendamento(Integer idAgendamento) {
        validarAgendamentoExiste(idAgendamento);
        return exameRepository.findByAgendamentoId(idAgendamento);
    }

    public Exame buscarPorId(Integer id) {
        return exameRepository.findById(id)
                .orElseThrow(() -> new EmptyResultDataAccessException("Exame não encontrado", 1));
    }

    @Transactional
    public Exame atualizar(Integer id, Exame exame) {
        Exame existente = buscarPorId(id);

        if (existente.getStatus() != exame.getStatus()) {
            validarTransicaoStatus(existente.getStatus(), exame.getStatus());
        }

        validar(exame);
        exameRepository.update(exame);
        return buscarPorId(id);
    }

    @Transactional
    public Exame cancelar(Integer id) {
        Exame exame = buscarPorId(id);
        validarTransicaoStatus(exame.getStatus(), StatusExame.CANCELADO);
        exameRepository.updateStatus(id, StatusExame.CANCELADO);
        return buscarPorId(id);
    }

    @Transactional
    public Exame anexarLaudo(Integer id, String arquivoLaudoPath) {
        Exame exame = buscarPorId(id);
        validarTransicaoStatus(exame.getStatus(), StatusExame.LAUDO_ANEXADO);
        exameRepository.anexarLaudo(id, arquivoLaudoPath, StatusExame.LAUDO_ANEXADO);
        return buscarPorId(id);
    }

    @Transactional
    public Exame concluir(Integer id) {
        Exame exame = buscarPorId(id);
        validarTransicaoStatus(exame.getStatus(), StatusExame.CONCLUIDO);
        exameRepository.updateStatus(id, StatusExame.CONCLUIDO);
        return buscarPorId(id);
    }

    @Transactional
    public void excluir(Integer id) {
        buscarPorId(id);
        exameRepository.delete(id);
    }

    private void validar(Exame exame) {
        validarAgendamentoExiste(exame.getIdAgendamento());
    }

    private void validarTransicaoStatus(StatusExame atual, StatusExame novoStatus) {
        if (atual == StatusExame.CONCLUIDO || atual == StatusExame.CANCELADO) {
            throw new IllegalArgumentException("Exame finalizado não pode mudar de status.");
        }

        boolean transicaoValida = (atual == StatusExame.SOLICITADO
                && (novoStatus == StatusExame.LAUDO_ANEXADO || novoStatus == StatusExame.CANCELADO))
                || (atual == StatusExame.LAUDO_ANEXADO
                        && (novoStatus == StatusExame.CONCLUIDO || novoStatus == StatusExame.CANCELADO));

        if (!transicaoValida) {
            throw new IllegalArgumentException("Transição de status inválida.");
        }
    }

    private void validarAgendamentoExiste(Integer idAgendamento) {
        agendamentoRepository.findById(idAgendamento)
                .orElseThrow(() -> new EmptyResultDataAccessException("Agendamento não encontrado", 1));
    }
}
