package com.clinicamedica.controller;

import com.clinicamedica.dto.request.MedicoRequestDTO;
import com.clinicamedica.dto.response.MedicoResponseDTO;
import com.clinicamedica.mapper.MedicoMapper;
import com.clinicamedica.model.Medico;
import com.clinicamedica.service.MedicoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicos")
public class MedicoController {

    private final MedicoService medicoService;

    public MedicoController(MedicoService medicoService) {
        this.medicoService = medicoService;
    }

    @PostMapping
    public ResponseEntity<MedicoResponseDTO> criar(@RequestBody @Valid MedicoRequestDTO dto) {
        Medico medico = MedicoMapper.toDomain(dto, null);

        Medico novoMedico = medicoService.salvarMedico(medico);

        return new ResponseEntity<>(MedicoMapper.toResponse(novoMedico), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MedicoResponseDTO>> listar() {
        List<Medico> medicos = medicoService.listarTodos();
        return ResponseEntity.ok(MedicoMapper.toResponseList(medicos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicoResponseDTO> buscarPorId(@PathVariable Integer id) {
        Medico medico = medicoService.buscarPorId(id);
        return ResponseEntity.ok(MedicoMapper.toResponse(medico));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicoResponseDTO> atualizar(@PathVariable Integer id,
            @RequestBody @Valid MedicoRequestDTO dto) {
        Medico medicoParaAtualizar = MedicoMapper.toDomain(dto, id);

        Medico medicoAtualizado = medicoService.atualizarMedico(id, medicoParaAtualizar);
        return ResponseEntity.ok(MedicoMapper.toResponse(medicoAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        medicoService.excluirMedico(id);
        return ResponseEntity.noContent().build();
    }
}