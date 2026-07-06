package com.clinicamedica.service;

import com.clinicamedica.model.ExcecaoAgenda;
import com.clinicamedica.repository.ExcecaoAgendaRepository;
import com.clinicamedica.repository.MedicoRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExcecaoAgendaService {

    private final ExcecaoAgendaRepository excecaoAgendaRepository;
    private final MedicoRepository medicoRepository;

    public ExcecaoAgendaService(ExcecaoAgendaRepository excecaoAgendaRepository, MedicoRepository medicoRepository) {
        this.excecaoAgendaRepository = excecaoAgendaRepository;
        this.medicoRepository = medicoRepository;
    }

    @Transactional
    public ExcecaoAgenda salvar(ExcecaoAgenda excecao) {
        validar(excecao);
        return excecaoAgendaRepository.save(excecao);
    }

    public List<ExcecaoAgenda> listarTodos() {
        return excecaoAgendaRepository.findAll();
    }

    public List<ExcecaoAgenda> listarPorMedico(Integer idMedico) {
        validarMedicoExiste(idMedico);
        return excecaoAgendaRepository.findByMedicoId(idMedico);
    }

    public ExcecaoAgenda buscarPorId(Integer id) {
        return excecaoAgendaRepository.findById(id)
                .orElseThrow(() -> new EmptyResultDataAccessException("Exceção de agenda não encontrada", 1));
    }

    @Transactional
    public ExcecaoAgenda atualizar(Integer id, ExcecaoAgenda excecao) {
        buscarPorId(id);
        validar(excecao);
        excecaoAgendaRepository.update(excecao);
        return buscarPorId(id);
    }

    @Transactional
    public void excluir(Integer id) {
        buscarPorId(id);
        excecaoAgendaRepository.delete(id);
    }

    private void validar(ExcecaoAgenda excecao) {
        validarMedicoExiste(excecao.getMedico().getPessoa().getId());

        boolean temInicio = excecao.getHorarioInicio() != null;
        boolean temFim = excecao.getHorarioFim() != null;

        if (temInicio != temFim) {
            throw new IllegalArgumentException("Horário de início e horário de fim devem ser informados juntos.");
        }

        if (excecao.getTipoExcecao().name().equals("ADICAO") && !temInicio) {
            throw new IllegalArgumentException("Exceção de adição deve informar horário de início e fim.");
        }

        if (temInicio && !excecao.getHorarioInicio().isBefore(excecao.getHorarioFim())) {
            throw new IllegalArgumentException("Horário de início deve ser anterior ao horário de fim.");
        }
    }

    private void validarMedicoExiste(Integer idMedico) {
        medicoRepository.findById(idMedico)
                .orElseThrow(() -> new EmptyResultDataAccessException("Médico não encontrado", 1));
    }
}
