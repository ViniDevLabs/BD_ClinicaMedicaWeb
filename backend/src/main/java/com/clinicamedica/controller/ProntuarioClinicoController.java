package com.clinicamedica.controller;

import com.clinicamedica.dto.request.ProntuarioClinicoRequestDTO;
import com.clinicamedica.dto.response.ProntuarioClinicoResponseDTO;
import com.clinicamedica.mapper.ProntuarioClinicoMapper;
import com.clinicamedica.model.ProntuarioClinico;
import com.clinicamedica.service.ProntuarioClinicoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prontuarios")
public class ProntuarioClinicoController {

    private final ProntuarioClinicoService prontuarioService;

    public ProntuarioClinicoController(ProntuarioClinicoService prontuarioService) {
        this.prontuarioService = prontuarioService;
    }

    @PostMapping
    public ResponseEntity<ProntuarioClinicoResponseDTO> criar(@RequestBody @Valid ProntuarioClinicoRequestDTO dto) {
        ProntuarioClinico prontuario = ProntuarioClinicoMapper.toDomain(dto, null);
        ProntuarioClinico novoProntuario = prontuarioService.salvar(prontuario);
        return new ResponseEntity<>(ProntuarioClinicoMapper.toResponse(novoProntuario), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProntuarioClinicoResponseDTO>> listar() {
        List<ProntuarioClinico> prontuarios = prontuarioService.listarTodos();
        return ResponseEntity.ok(ProntuarioClinicoMapper.toResponseList(prontuarios));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProntuarioClinicoResponseDTO> buscarPorId(@PathVariable Integer id) {
        ProntuarioClinico prontuario = prontuarioService.buscarPorId(id);
        return ResponseEntity.ok(ProntuarioClinicoMapper.toResponse(prontuario));
    }

    @GetMapping("/agendamento/{idAgendamento}")
    public ResponseEntity<ProntuarioClinicoResponseDTO> buscarPorAgendamento(@PathVariable Integer idAgendamento) {
        ProntuarioClinico prontuario = prontuarioService.buscarPorAgendamento(idAgendamento);
        return ResponseEntity.ok(ProntuarioClinicoMapper.toResponse(prontuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProntuarioClinicoResponseDTO> atualizar(@PathVariable Integer id,
            @RequestBody @Valid ProntuarioClinicoRequestDTO dto) {
        ProntuarioClinico prontuario = ProntuarioClinicoMapper.toDomain(dto, id);
        ProntuarioClinico prontuarioAtualizado = prontuarioService.atualizar(id, prontuario);
        return ResponseEntity.ok(ProntuarioClinicoMapper.toResponse(prontuarioAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        prontuarioService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
