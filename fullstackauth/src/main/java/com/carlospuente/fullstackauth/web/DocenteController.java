package com.carlospuente.fullstackauth.web;

import com.carlospuente.fullstackauth.domain.dto.DocenteRequest;
import com.carlospuente.fullstackauth.domain.dto.DocenteResponse;
import com.carlospuente.fullstackauth.service.DocenteService;
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
@RequestMapping(path = "/api/docentes", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class DocenteController {

    private final DocenteService docenteService;

    @GetMapping
    @PreAuthorize("hasAuthority('READ:DOCENTES')")
    public ResponseEntity<List<DocenteResponse>> getAll() {
        return ResponseEntity.ok(docenteService.listAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ:DOCENTES')")
    public ResponseEntity<DocenteResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(docenteService.getById(id));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAuthority('WRITE:DOCENTES')")
    public ResponseEntity<DocenteResponse> create(
            @Valid @RequestBody DocenteRequest request
    ) {
        var created = docenteService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAuthority('WRITE:DOCENTES')")
    public ResponseEntity<DocenteResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody DocenteRequest request
    ) {
        return ResponseEntity.ok(docenteService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE:DOCENTES')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        docenteService.delete(id);
    }
}