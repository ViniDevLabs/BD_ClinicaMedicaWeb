package com.clinicamedica.controller;

import com.clinicamedica.dto.request.AgendamentoRequestDTO;
import com.clinicamedica.dto.response.AgendamentoResponseDTO;
import com.clinicamedica.mapper.AgendamentoMapper;
import com.clinicamedica.model.Agendamento;
import com.clinicamedica.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> criar(@RequestBody @Valid AgendamentoRequestDTO dto) {
        Agendamento agendamento = AgendamentoMapper.toDomain(dto, null);
        Agendamento novoAgendamento = agendamentoService.salvar(agendamento);
        return new ResponseEntity<>(AgendamentoMapper.toResponse(novoAgendamento), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoResponseDTO>> listar() {
        List<Agendamento> agendamentos = agendamentoService.listarTodos();
        return ResponseEntity.ok(AgendamentoMapper.toResponseList(agendamentos));
    }

    @GetMapping("/horarios-disponiveis")
    public ResponseEntity<List<LocalTime>> listarHorariosDisponiveis(
            @RequestParam Integer idMedico,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(agendamentoService.listarHorariosDisponiveis(idMedico, data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoResponseDTO> buscarPorId(@PathVariable Integer id) {
        Agendamento agendamento = agendamentoService.buscarPorId(id);
        return ResponseEntity.ok(AgendamentoMapper.toResponse(agendamento));
    }

    @GetMapping("/medico/{idMedico}")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarPorMedico(@PathVariable Integer idMedico) {
        List<Agendamento> agendamentos = agendamentoService.listarPorMedico(idMedico);
        return ResponseEntity.ok(AgendamentoMapper.toResponseList(agendamentos));
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarPorPaciente(@PathVariable Integer idPaciente) {
        List<Agendamento> agendamentos = agendamentoService.listarPorPaciente(idPaciente);
        return ResponseEntity.ok(AgendamentoMapper.toResponseList(agendamentos));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<AgendamentoResponseDTO> cancelar(@PathVariable Integer id) {
        Agendamento agendamento = agendamentoService.cancelar(id);
        return ResponseEntity.ok(AgendamentoMapper.toResponse(agendamento));
    }

    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<AgendamentoResponseDTO> confirmar(@PathVariable Integer id) {
        Agendamento agendamento = agendamentoService.confirmar(id);
        return ResponseEntity.ok(AgendamentoMapper.toResponse(agendamento));
    }

    @PatchMapping("/{id}/realizar")
    public ResponseEntity<AgendamentoResponseDTO> realizar(@PathVariable Integer id) {
        Agendamento agendamento = agendamentoService.realizar(id);
        return ResponseEntity.ok(AgendamentoMapper.toResponse(agendamento));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgendamentoResponseDTO> atualizar(@PathVariable Integer id,
            @RequestBody @Valid AgendamentoRequestDTO dto) {
        Agendamento agendamento = AgendamentoMapper.toDomain(dto, id);
        Agendamento agendamentoAtualizado = agendamentoService.atualizar(id, agendamento);
        return ResponseEntity.ok(AgendamentoMapper.toResponse(agendamentoAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        agendamentoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
