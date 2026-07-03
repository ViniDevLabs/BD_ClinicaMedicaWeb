package com.clinicamedica.controller;

import com.clinicamedica.dto.request.PacienteRequestDTO;
import com.clinicamedica.dto.response.PacienteResponseDTO;
import com.clinicamedica.mapper.PacienteMapper;
import com.clinicamedica.model.Paciente;
import com.clinicamedica.service.PacienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    private final PacienteService pacienteService;

    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    @PostMapping
    public ResponseEntity<PacienteResponseDTO> criar(@RequestBody @Valid PacienteRequestDTO dto) {
        Paciente paciente = PacienteMapper.toDomain(dto, null);
        Paciente novoPaciente = pacienteService.salvarPaciente(paciente);
        return new ResponseEntity<>(PacienteMapper.toResponse(novoPaciente), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PacienteResponseDTO>> listar() {
        List<Paciente> pacientes = pacienteService.listarTodos();
        return ResponseEntity.ok(PacienteMapper.toResponseList(pacientes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> buscarPorId(@PathVariable Integer id) {
        Paciente paciente = pacienteService.buscarPorId(id);
        return ResponseEntity.ok(PacienteMapper.toResponse(paciente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> atualizar(@PathVariable Integer id,
            @RequestBody @Valid PacienteRequestDTO dto) {
        Paciente pacienteParaAtualizar = PacienteMapper.toDomain(dto, id);
        Paciente pacienteAtualizado = pacienteService.atualizarPaciente(id, pacienteParaAtualizar);
        return ResponseEntity.ok(PacienteMapper.toResponse(pacienteAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        pacienteService.excluirPaciente(id);
        return ResponseEntity.noContent().build();
    }
}