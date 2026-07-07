package com.clinicamedica.controller;

import com.clinicamedica.dto.request.AnexarLaudoRequestDTO;
import com.clinicamedica.dto.request.ExameRequestDTO;
import com.clinicamedica.dto.response.ExameResponseDTO;
import com.clinicamedica.mapper.ExameMapper;
import com.clinicamedica.model.Exame;
import com.clinicamedica.service.ExameService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exames")
public class ExameController {

    private final ExameService exameService;

    public ExameController(ExameService exameService) {
        this.exameService = exameService;
    }

    @PostMapping
    public ResponseEntity<ExameResponseDTO> criar(@RequestBody @Valid ExameRequestDTO dto) {
        Exame exame = ExameMapper.toDomain(dto, null);
        Exame novoExame = exameService.salvar(exame);
        return new ResponseEntity<>(ExameMapper.toResponse(novoExame), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ExameResponseDTO>> listar() {
        List<Exame> exames = exameService.listarTodos();
        return ResponseEntity.ok(ExameMapper.toResponseList(exames));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExameResponseDTO> buscarPorId(@PathVariable Integer id) {
        Exame exame = exameService.buscarPorId(id);
        return ResponseEntity.ok(ExameMapper.toResponse(exame));
    }

    @GetMapping("/agendamento/{idAgendamento}")
    public ResponseEntity<List<ExameResponseDTO>> listarPorAgendamento(@PathVariable Integer idAgendamento) {
        List<Exame> exames = exameService.listarPorAgendamento(idAgendamento);
        return ResponseEntity.ok(ExameMapper.toResponseList(exames));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExameResponseDTO> atualizar(@PathVariable Integer id,
            @RequestBody @Valid ExameRequestDTO dto) {
        Exame exame = ExameMapper.toDomain(dto, id);
        Exame exameAtualizado = exameService.atualizar(id, exame);
        return ResponseEntity.ok(ExameMapper.toResponse(exameAtualizado));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<ExameResponseDTO> cancelar(@PathVariable Integer id) {
        Exame exame = exameService.cancelar(id);
        return ResponseEntity.ok(ExameMapper.toResponse(exame));
    }

    @PatchMapping("/{id}/anexar-laudo")
    public ResponseEntity<ExameResponseDTO> anexarLaudo(@PathVariable Integer id,
            @RequestBody @Valid AnexarLaudoRequestDTO dto) {
        Exame exame = exameService.anexarLaudo(id, dto.arquivoLaudoPath());
        return ResponseEntity.ok(ExameMapper.toResponse(exame));
    }

    @PatchMapping("/{id}/concluir")
    public ResponseEntity<ExameResponseDTO> concluir(@PathVariable Integer id) {
        Exame exame = exameService.concluir(id);
        return ResponseEntity.ok(ExameMapper.toResponse(exame));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        exameService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
