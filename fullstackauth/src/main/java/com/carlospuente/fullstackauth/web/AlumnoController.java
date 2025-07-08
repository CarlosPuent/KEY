package com.carlospuente.fullstackauth.web;

import com.carlospuente.fullstackauth.domain.dto.AlumnoMateriaResponse;
import com.carlospuente.fullstackauth.domain.dto.AlumnoRequest;
import com.carlospuente.fullstackauth.domain.dto.AlumnoResponse;
import com.carlospuente.fullstackauth.service.AlumnoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/alumnos", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class AlumnoController {

    private final AlumnoService alumnoService;

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('READ:ALUMNOS')")
    public ResponseEntity<AlumnoResponse> getMe(@AuthenticationPrincipal Jwt jwt) {
        String auth0Id = jwt.getSubject();
        return ResponseEntity.ok(alumnoService.getMe(auth0Id));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('READ:ALUMNOS')")
    public ResponseEntity<List<AlumnoResponse>> getAll() {
        return ResponseEntity.ok(alumnoService.listAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ:ALUMNOS')")
    public ResponseEntity<AlumnoResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(alumnoService.getById(id));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAuthority('WRITE:ALUMNOS')")
    public ResponseEntity<AlumnoResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody AlumnoRequest request
    ) {
        String auth0Id = jwt.getSubject();
        var created = alumnoService.create(request, auth0Id);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAuthority('WRITE:ALUMNOS')")
    public ResponseEntity<AlumnoResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody AlumnoRequest request
    ) {
        return ResponseEntity.ok(alumnoService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE:ALUMNOS')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        alumnoService.delete(id);
    }
}

