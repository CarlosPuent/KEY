package com.carlospuente.fullstackauth.web;

import com.carlospuente.fullstackauth.domain.dto.MateriaRequest;
import com.carlospuente.fullstackauth.domain.dto.MateriaResponse;
import com.carlospuente.fullstackauth.service.MateriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/materias", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class MateriaController {

    private final MateriaService materiaService;

    @GetMapping
    @PreAuthorize("hasAuthority('READ:MATERIAS')")
    public ResponseEntity<List<MateriaResponse>> getAll() {
        return ResponseEntity.ok(materiaService.listAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ:MATERIAS')")
    public ResponseEntity<MateriaResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(materiaService.getById(id));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAuthority('WRITE:MATERIAS')")
    public ResponseEntity<MateriaResponse> create(
            @Valid @RequestBody MateriaRequest request
    ) {
        var created = materiaService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAuthority('WRITE:MATERIAS')")
    public ResponseEntity<MateriaResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody MateriaRequest request
    ) {
        return ResponseEntity.ok(materiaService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE:MATERIAS')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        materiaService.delete(id);
    }
}
