package com.carlospuente.fullstackauth.web;

import com.carlospuente.fullstackauth.domain.dto.AlumnoMateriaBoletaResponse;
import com.carlospuente.fullstackauth.domain.dto.AlumnoMateriaRequest;
import com.carlospuente.fullstackauth.domain.dto.AlumnoMateriaResponse;
import com.carlospuente.fullstackauth.service.AlumnoMateriaService;
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
@RequestMapping(path = "/api/alumno-materias", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class AlumnoMateriaController {

    private final AlumnoMateriaService servicio;

    @GetMapping
    @PreAuthorize("hasAuthority('READ:ALUMNO_MATERIAS')")
    public ResponseEntity<List<AlumnoMateriaResponse>> getAll() {
        return ResponseEntity.ok(servicio.listAll());
    }


    @GetMapping("/me/boleta")
    @PreAuthorize("hasAuthority('READ:ALUMNO_MATERIAS')")
    public ResponseEntity<List<AlumnoMateriaBoletaResponse>> getMyBoleta(@AuthenticationPrincipal Jwt jwt) {
        String auth0Id = jwt.getSubject();
        var boleta = servicio.listByAlumnoAuth0Id(auth0Id);
        return ResponseEntity.ok(boleta);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ:ALUMNO_MATERIAS')")
    public ResponseEntity<AlumnoMateriaResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(servicio.getById(id));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAuthority('WRITE:ALUMNO_MATERIAS')")
    public ResponseEntity<AlumnoMateriaResponse> create(
            @Valid @RequestBody AlumnoMateriaRequest request
    ) {
        var created = servicio.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAuthority('WRITE:ALUMNO_MATERIAS')")
    public ResponseEntity<AlumnoMateriaResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody AlumnoMateriaRequest request
    ) {
        return ResponseEntity.ok(servicio.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE:ALUMNO_MATERIAS')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        servicio.delete(id);
    }
}
