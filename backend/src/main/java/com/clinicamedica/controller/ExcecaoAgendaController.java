package com.clinicamedica.controller;

import com.clinicamedica.dto.request.ExcecaoAgendaRequestDTO;
import com.clinicamedica.dto.response.ExcecaoAgendaResponseDTO;
import com.clinicamedica.mapper.ExcecaoAgendaMapper;
import com.clinicamedica.model.ExcecaoAgenda;
import com.clinicamedica.service.ExcecaoAgendaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/excecoes-agenda")
public class ExcecaoAgendaController {

    private final ExcecaoAgendaService excecaoAgendaService;

    public ExcecaoAgendaController(ExcecaoAgendaService excecaoAgendaService) {
        this.excecaoAgendaService = excecaoAgendaService;
    }

    @PostMapping
    public ResponseEntity<ExcecaoAgendaResponseDTO> criar(@RequestBody @Valid ExcecaoAgendaRequestDTO dto) {
        ExcecaoAgenda excecao = ExcecaoAgendaMapper.toDomain(dto, null);
        ExcecaoAgenda novaExcecao = excecaoAgendaService.salvar(excecao);
        return new ResponseEntity<>(ExcecaoAgendaMapper.toResponse(novaExcecao), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ExcecaoAgendaResponseDTO>> listar() {
        List<ExcecaoAgenda> excecoes = excecaoAgendaService.listarTodos();
        return ResponseEntity.ok(ExcecaoAgendaMapper.toResponseList(excecoes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExcecaoAgendaResponseDTO> buscarPorId(@PathVariable Integer id) {
        ExcecaoAgenda excecao = excecaoAgendaService.buscarPorId(id);
        return ResponseEntity.ok(ExcecaoAgendaMapper.toResponse(excecao));
    }

    @GetMapping("/medico/{idMedico}")
    public ResponseEntity<List<ExcecaoAgendaResponseDTO>> listarPorMedico(@PathVariable Integer idMedico) {
        List<ExcecaoAgenda> excecoes = excecaoAgendaService.listarPorMedico(idMedico);
        return ResponseEntity.ok(ExcecaoAgendaMapper.toResponseList(excecoes));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExcecaoAgendaResponseDTO> atualizar(@PathVariable Integer id,
            @RequestBody @Valid ExcecaoAgendaRequestDTO dto) {
        ExcecaoAgenda excecao = ExcecaoAgendaMapper.toDomain(dto, id);
        ExcecaoAgenda excecaoAtualizada = excecaoAgendaService.atualizar(id, excecao);
        return ResponseEntity.ok(ExcecaoAgendaMapper.toResponse(excecaoAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        excecaoAgendaService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
