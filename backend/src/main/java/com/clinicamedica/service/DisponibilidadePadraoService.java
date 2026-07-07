package com.clinicamedica.service;

import com.clinicamedica.model.DisponibilidadePadrao;
import com.clinicamedica.repository.DisponibilidadePadraoRepository;
import com.clinicamedica.repository.MedicoRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DisponibilidadePadraoService {

    private final DisponibilidadePadraoRepository disponibilidadePadraoRepository;
    private final MedicoRepository medicoRepository;

    public DisponibilidadePadraoService(DisponibilidadePadraoRepository disponibilidadePadraoRepository,
            MedicoRepository medicoRepository) {
        this.disponibilidadePadraoRepository = disponibilidadePadraoRepository;
        this.medicoRepository = medicoRepository;
    }

    @Transactional
    public DisponibilidadePadrao salvar(DisponibilidadePadrao disponibilidade) {
        validar(disponibilidade);
        return disponibilidadePadraoRepository.save(disponibilidade);
    }

    public List<DisponibilidadePadrao> listarTodos() {
        return disponibilidadePadraoRepository.findAll();
    }

    public List<DisponibilidadePadrao> listarPorMedico(Integer idMedico) {
        validarMedicoExiste(idMedico);
        return disponibilidadePadraoRepository.findByMedicoId(idMedico);
    }

    public DisponibilidadePadrao buscarPorId(Integer id) {
        return disponibilidadePadraoRepository.findById(id)
                .orElseThrow(() -> new EmptyResultDataAccessException("Disponibilidade padrão não encontrada", 1));
    }

    @Transactional
    public DisponibilidadePadrao atualizar(Integer id, DisponibilidadePadrao disponibilidade) {
        buscarPorId(id);
        validar(disponibilidade);
        disponibilidadePadraoRepository.update(disponibilidade);
        return buscarPorId(id);
    }

    @Transactional
    public void excluir(Integer id) {
        buscarPorId(id);
        disponibilidadePadraoRepository.delete(id);
    }

    private void validar(DisponibilidadePadrao disponibilidade) {
        validarMedicoExiste(disponibilidade.getMedico().getPessoa().getId());

        if (!disponibilidade.getHorarioInicio().isBefore(disponibilidade.getHorarioFim())) {
            throw new IllegalArgumentException("Horário de início deve ser anterior ao horário de fim.");
        }

        if (disponibilidade.getDataFim() != null && disponibilidade.getDataFim().isBefore(disponibilidade.getDataInicio())) {
            throw new IllegalArgumentException("Data final deve ser igual ou posterior à data inicial.");
        }
    }

    private void validarMedicoExiste(Integer idMedico) {
        medicoRepository.findById(idMedico)
                .orElseThrow(() -> new EmptyResultDataAccessException("Médico não encontrado", 1));
    }
}
