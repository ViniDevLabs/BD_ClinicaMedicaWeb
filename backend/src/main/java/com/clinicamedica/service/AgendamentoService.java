package com.clinicamedica.service;

import com.clinicamedica.model.Agendamento;
import com.clinicamedica.model.DiaSemana;
import com.clinicamedica.model.DisponibilidadePadrao;
import com.clinicamedica.model.ExcecaoAgenda;
import com.clinicamedica.model.StatusAgendamento;
import com.clinicamedica.model.TipoExcecaoAgenda;
import com.clinicamedica.repository.AgendamentoRepository;
import com.clinicamedica.repository.AtendenteRepository;
import com.clinicamedica.repository.DisponibilidadePadraoRepository;
import com.clinicamedica.repository.ExcecaoAgendaRepository;
import com.clinicamedica.repository.MedicoRepository;
import com.clinicamedica.repository.PacienteRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final PacienteRepository pacienteRepository;
    private final AtendenteRepository atendenteRepository;
    private final MedicoRepository medicoRepository;
    private final DisponibilidadePadraoRepository disponibilidadePadraoRepository;
    private final ExcecaoAgendaRepository excecaoAgendaRepository;

    public AgendamentoService(AgendamentoRepository agendamentoRepository, PacienteRepository pacienteRepository,
            AtendenteRepository atendenteRepository, MedicoRepository medicoRepository,
            DisponibilidadePadraoRepository disponibilidadePadraoRepository,
            ExcecaoAgendaRepository excecaoAgendaRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.pacienteRepository = pacienteRepository;
        this.atendenteRepository = atendenteRepository;
        this.medicoRepository = medicoRepository;
        this.disponibilidadePadraoRepository = disponibilidadePadraoRepository;
        this.excecaoAgendaRepository = excecaoAgendaRepository;
    }

    @Transactional
    public Agendamento salvar(Agendamento agendamento) {
        if (agendamento.getStatus() != StatusAgendamento.AGENDADO) {
            throw new IllegalArgumentException("Novo agendamento deve iniciar com status AGENDADO.");
        }

        Integer idMedico = agendamento.getMedico().getPessoa().getId();
        medicoRepository.lockById(idMedico);

        validar(agendamento, null);
        return agendamentoRepository.save(agendamento);
    }

    public List<Agendamento> listarTodos() {
        return agendamentoRepository.findAll();
    }

    public List<Agendamento> listarPorMedico(Integer idMedico) {
        validarMedicoExiste(idMedico);
        return agendamentoRepository.findByMedicoId(idMedico);
    }

    public List<Agendamento> listarPorPaciente(Integer idPaciente) {
        validarPacienteExiste(idPaciente);
        return agendamentoRepository.findByPacienteId(idPaciente);
    }

    public List<LocalTime> listarHorariosDisponiveis(Integer idMedico, LocalDate data) {
        validarMedicoExiste(idMedico);
        return new ArrayList<>(gerarSlotsDisponiveis(idMedico, data).keySet());
    }

    public Agendamento buscarPorId(Integer id) {
        return agendamentoRepository.findById(id)
                .orElseThrow(() -> new EmptyResultDataAccessException("Agendamento não encontrado", 1));
    }

    @Transactional
    public Agendamento atualizar(Integer id, Agendamento agendamento) {
        Agendamento existente = buscarPorId(id);
        Integer idMedico = agendamento.getMedico().getPessoa().getId();
        medicoRepository.lockById(idMedico);

        if (existente.getStatus() != agendamento.getStatus()) {
            validarTransicaoStatus(existente.getStatus(), agendamento.getStatus());
        }

        validar(agendamento, id);
        agendamentoRepository.update(agendamento);
        return buscarPorId(id);
    }

    @Transactional
    public Agendamento cancelar(Integer id) {
        return alterarStatus(id, StatusAgendamento.CANCELADO);
    }

    @Transactional
    public Agendamento confirmar(Integer id) {
        return alterarStatus(id, StatusAgendamento.CONFIRMADO);
    }

    @Transactional
    public Agendamento realizar(Integer id) {
        return alterarStatus(id, StatusAgendamento.REALIZADO);
    }

    @Transactional
    public void excluir(Integer id) {
        buscarPorId(id);
        agendamentoRepository.delete(id);
    }

    private void validar(Agendamento agendamento, Integer idIgnorado) {
        validarPacienteExiste(agendamento.getPaciente().getPessoa().getId());
        validarMedicoExiste(agendamento.getMedico().getPessoa().getId());

        if (agendamento.getAtendente() != null) {
            validarAtendenteExiste(agendamento.getAtendente().getPessoa().getId());
        }

        if (agendamento.getIdAgendamentoPai() != null) {
            agendamentoRepository.findById(agendamento.getIdAgendamentoPai())
                    .orElseThrow(() -> new EmptyResultDataAccessException("Agendamento pai não encontrado", 1));
        }

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            return;
        }

        Integer idMedico = agendamento.getMedico().getPessoa().getId();
        LocalDate data = agendamento.getDataHora().toLocalDate();
        LocalTime horario = agendamento.getDataHora().toLocalTime();

        if (!gerarSlotsDisponiveis(idMedico, data, idIgnorado).containsKey(horario)) {
            throw new IllegalArgumentException("Horário não está disponível para este médico.");
        }

        if (agendamentoRepository.existsConflitoAtivo(idMedico, agendamento.getDataHora(), idIgnorado)) {
            throw new IllegalArgumentException("Já existe agendamento ativo para este médico no horário informado.");
        }
    }

    private Agendamento alterarStatus(Integer id, StatusAgendamento novoStatus) {
        Agendamento agendamento = buscarPorId(id);
        validarTransicaoStatus(agendamento.getStatus(), novoStatus);
        agendamentoRepository.updateStatus(id, novoStatus);
        return buscarPorId(id);
    }

    private void validarTransicaoStatus(StatusAgendamento atual, StatusAgendamento novoStatus) {
        if (atual == StatusAgendamento.REALIZADO || atual == StatusAgendamento.CANCELADO) {
            throw new IllegalArgumentException("Agendamento finalizado não pode mudar de status.");
        }

        boolean transicaoValida = (atual == StatusAgendamento.AGENDADO
                && (novoStatus == StatusAgendamento.CONFIRMADO || novoStatus == StatusAgendamento.CANCELADO))
                || (atual == StatusAgendamento.CONFIRMADO
                        && (novoStatus == StatusAgendamento.REALIZADO || novoStatus == StatusAgendamento.CANCELADO));

        if (!transicaoValida) {
            throw new IllegalArgumentException("Transição de status inválida.");
        }
    }

    private Map<LocalTime, Integer> gerarSlotsDisponiveis(Integer idMedico, LocalDate data) {
        return gerarSlotsDisponiveis(idMedico, data, null);
    }

    private Map<LocalTime, Integer> gerarSlotsDisponiveis(Integer idMedico, LocalDate data, Integer idAgendamentoIgnorado) {
        Map<LocalTime, Integer> slots = gerarSlotsBase(idMedico, data);
        List<ExcecaoAgenda> excecoes = excecaoAgendaRepository.findByMedicoIdAndData(idMedico, data);

        aplicarAdicoes(slots, excecoes, idMedico);
        aplicarBloqueios(slots, excecoes);
        removerAgendamentosOcupados(slots, idMedico, data, idAgendamentoIgnorado);

        return slots;
    }

    private Map<LocalTime, Integer> gerarSlotsBase(Integer idMedico, LocalDate data) {
        DiaSemana diaSemana = diaSemanaDaData(data);
        List<DisponibilidadePadrao> disponibilidades = disponibilidadePadraoRepository
                .findValidasPorMedicoEData(idMedico, data, diaSemana);
        Map<LocalTime, Integer> slots = new LinkedHashMap<>();

        for (DisponibilidadePadrao disponibilidade : disponibilidades) {
            adicionarSlots(slots,
                    disponibilidade.getHorarioInicio(),
                    disponibilidade.getHorarioFim(),
                    disponibilidade.getDuracaoConsulta());
        }

        return slots;
    }

    private void aplicarAdicoes(Map<LocalTime, Integer> slots, List<ExcecaoAgenda> excecoes, Integer idMedico) {
        Integer duracaoPadrao = disponibilidadePadraoRepository.findPrimeiraDuracaoPorMedico(idMedico).orElse(null);
        if (duracaoPadrao == null) {
            return;
        }

        excecoes.stream()
                .filter(excecao -> excecao.getTipoExcecao() == TipoExcecaoAgenda.ADICAO)
                .forEach(excecao -> adicionarSlots(slots, excecao.getHorarioInicio(), excecao.getHorarioFim(), duracaoPadrao));
    }

    private void aplicarBloqueios(Map<LocalTime, Integer> slots, List<ExcecaoAgenda> excecoes) {
        for (ExcecaoAgenda excecao : excecoes) {
            if (excecao.getTipoExcecao() != TipoExcecaoAgenda.BLOQUEIO) {
                continue;
            }

            if (excecao.getHorarioInicio() == null && excecao.getHorarioFim() == null) {
                slots.clear();
                return;
            }

            slots.entrySet().removeIf(entry -> horariosSobrepoem(
                    entry.getKey(),
                    entry.getKey().plusMinutes(entry.getValue()),
                    excecao.getHorarioInicio(),
                    excecao.getHorarioFim()));
        }
    }

    private void removerAgendamentosOcupados(Map<LocalTime, Integer> slots, Integer idMedico, LocalDate data,
            Integer idAgendamentoIgnorado) {
        agendamentoRepository.findAtivosByMedicoIdAndData(idMedico, data).stream()
                .filter(agendamento -> !agendamento.getIdAgendamento().equals(idAgendamentoIgnorado))
                .map(agendamento -> agendamento.getDataHora().toLocalTime())
                .forEach(slots::remove);
    }

    private void adicionarSlots(Map<LocalTime, Integer> slots, LocalTime inicio, LocalTime fim, Integer duracaoMinutos) {
        if (inicio == null || fim == null || duracaoMinutos == null || duracaoMinutos <= 0) {
            return;
        }

        LocalTime horario = inicio;
        while (!horario.plusMinutes(duracaoMinutos).isAfter(fim)) {
            slots.putIfAbsent(horario, duracaoMinutos);
            horario = horario.plusMinutes(duracaoMinutos);
        }
    }

    private boolean horariosSobrepoem(LocalTime inicioA, LocalTime fimA, LocalTime inicioB, LocalTime fimB) {
        return inicioA.isBefore(fimB) && fimA.isAfter(inicioB);
    }

    private DiaSemana diaSemanaDaData(LocalDate data) {
        DayOfWeek dayOfWeek = data.getDayOfWeek();
        return switch (dayOfWeek) {
            case MONDAY -> DiaSemana.SEGUNDA;
            case TUESDAY -> DiaSemana.TERCA;
            case WEDNESDAY -> DiaSemana.QUARTA;
            case THURSDAY -> DiaSemana.QUINTA;
            case FRIDAY -> DiaSemana.SEXTA;
            case SATURDAY -> DiaSemana.SABADO;
            case SUNDAY -> DiaSemana.DOMINGO;
        };
    }

    private void validarPacienteExiste(Integer idPaciente) {
        pacienteRepository.findById(idPaciente)
                .orElseThrow(() -> new EmptyResultDataAccessException("Paciente não encontrado", 1));
    }

    private void validarAtendenteExiste(Integer idAtendente) {
        atendenteRepository.findById(idAtendente)
                .orElseThrow(() -> new EmptyResultDataAccessException("Atendente não encontrado", 1));
    }

    private void validarMedicoExiste(Integer idMedico) {
        medicoRepository.findById(idMedico)
                .orElseThrow(() -> new EmptyResultDataAccessException("Médico não encontrado", 1));
    }
}
