package com.clinicamedica.controller;

import com.clinicamedica.dto.request.AtendenteRequestDTO;
import com.clinicamedica.dto.response.AtendenteResponseDTO;
import com.clinicamedica.mapper.AtendenteMapper;
import com.clinicamedica.model.Atendente;
import com.clinicamedica.service.AtendenteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/atendentes")
public class AtendenteController {

    private final AtendenteService atendenteService;

    public AtendenteController(AtendenteService atendenteService) {
        this.atendenteService = atendenteService;
    }

    @PostMapping
    public ResponseEntity<AtendenteResponseDTO> criar(@RequestBody @Valid AtendenteRequestDTO dto) {
        Atendente atendente = AtendenteMapper.toDomain(dto, null);
        Atendente novoAtendente = atendenteService.salvarAtendente(atendente);
        return new ResponseEntity<>(AtendenteMapper.toResponse(novoAtendente), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AtendenteResponseDTO>> listar() {
        List<Atendente> atendentes = atendenteService.listarTodos();
        return ResponseEntity.ok(AtendenteMapper.toResponseList(atendentes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AtendenteResponseDTO> buscarPorId(@PathVariable Integer id) {
        Atendente atendente = atendenteService.buscarPorId(id);
        return ResponseEntity.ok(AtendenteMapper.toResponse(atendente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AtendenteResponseDTO> atualizar(@PathVariable Integer id,
            @RequestBody @Valid AtendenteRequestDTO dto) {
        Atendente atendenteParaAtualizar = AtendenteMapper.toDomain(dto, id);
        Atendente atendenteAtualizado = atendenteService.atualizarAtendente(id, atendenteParaAtualizar);
        return ResponseEntity.ok(AtendenteMapper.toResponse(atendenteAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        atendenteService.excluirAtendente(id);
        return ResponseEntity.noContent().build();
    }
}