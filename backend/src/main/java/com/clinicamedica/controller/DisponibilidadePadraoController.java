package com.clinicamedica.controller;

import com.clinicamedica.dto.request.DisponibilidadePadraoRequestDTO;
import com.clinicamedica.dto.response.DisponibilidadePadraoResponseDTO;
import com.clinicamedica.mapper.DisponibilidadePadraoMapper;
import com.clinicamedica.model.DisponibilidadePadrao;
import com.clinicamedica.service.DisponibilidadePadraoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disponibilidades-padrao")
public class DisponibilidadePadraoController {

    private final DisponibilidadePadraoService disponibilidadePadraoService;

    public DisponibilidadePadraoController(DisponibilidadePadraoService disponibilidadePadraoService) {
        this.disponibilidadePadraoService = disponibilidadePadraoService;
    }

    @PostMapping
    public ResponseEntity<DisponibilidadePadraoResponseDTO> criar(
            @RequestBody @Valid DisponibilidadePadraoRequestDTO dto) {
        DisponibilidadePadrao disponibilidade = DisponibilidadePadraoMapper.toDomain(dto, null);
        DisponibilidadePadrao novaDisponibilidade = disponibilidadePadraoService.salvar(disponibilidade);
        return new ResponseEntity<>(DisponibilidadePadraoMapper.toResponse(novaDisponibilidade), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DisponibilidadePadraoResponseDTO>> listar() {
        List<DisponibilidadePadrao> disponibilidades = disponibilidadePadraoService.listarTodos();
        return ResponseEntity.ok(DisponibilidadePadraoMapper.toResponseList(disponibilidades));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisponibilidadePadraoResponseDTO> buscarPorId(@PathVariable Integer id) {
        DisponibilidadePadrao disponibilidade = disponibilidadePadraoService.buscarPorId(id);
        return ResponseEntity.ok(DisponibilidadePadraoMapper.toResponse(disponibilidade));
    }

    @GetMapping("/medico/{idMedico}")
    public ResponseEntity<List<DisponibilidadePadraoResponseDTO>> listarPorMedico(@PathVariable Integer idMedico) {
        List<DisponibilidadePadrao> disponibilidades = disponibilidadePadraoService.listarPorMedico(idMedico);
        return ResponseEntity.ok(DisponibilidadePadraoMapper.toResponseList(disponibilidades));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DisponibilidadePadraoResponseDTO> atualizar(@PathVariable Integer id,
            @RequestBody @Valid DisponibilidadePadraoRequestDTO dto) {
        DisponibilidadePadrao disponibilidade = DisponibilidadePadraoMapper.toDomain(dto, id);
        DisponibilidadePadrao disponibilidadeAtualizada = disponibilidadePadraoService.atualizar(id, disponibilidade);
        return ResponseEntity.ok(DisponibilidadePadraoMapper.toResponse(disponibilidadeAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        disponibilidadePadraoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
