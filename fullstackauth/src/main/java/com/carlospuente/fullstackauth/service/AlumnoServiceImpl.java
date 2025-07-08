package com.carlospuente.fullstackauth.service;

import com.carlospuente.fullstackauth.domain.model.AlumnoEntity;
import com.carlospuente.fullstackauth.exception.ConflictException;
import com.carlospuente.fullstackauth.repository.AlumnoRepository;
import com.carlospuente.fullstackauth.domain.dto.AlumnoRequest;
import com.carlospuente.fullstackauth.domain.dto.AlumnoResponse;
import com.carlospuente.fullstackauth.domain.mapper.AlumnoMapper;
import com.carlospuente.fullstackauth.exception.BadRequestException;
import com.carlospuente.fullstackauth.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
@Transactional
public class AlumnoServiceImpl implements AlumnoService {

    private static final Logger log = LoggerFactory.getLogger(AlumnoServiceImpl.class);

    private final AlumnoRepository repo;
    private final AlumnoMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<AlumnoResponse> listAll() {
        log.debug("Obteniendo lista completa de alumnos");
        return repo.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AlumnoResponse getById(UUID id) {
        log.debug("Buscando alumno por ID {}", id);
        AlumnoEntity e = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado: " + id));
        return mapper.toResponse(e);
    }

    @Override
    public AlumnoResponse create(AlumnoRequest req, String auth0Id) {
        log.debug("Creando alumno con datos {} y auth0Id={}", req, auth0Id);

        // Validaciones de negocio
        validateRequest(req);

        // Prevención de duplicados (por nombre+apellido+fechaIngreso)
        if (repo.existsByNombresAndApellidosAndFechaIngreso(
                req.nombres().trim(), req.apellidos().trim(), req.fechaIngreso())) {
            throw new ConflictException("Ya existe un alumno con los mismos datos");
        }

        AlumnoEntity e = mapper.toEntity(req);
        e.setAuth0Id(auth0Id);   // ← asigna aquí el auth0Id
        AlumnoEntity saved = repo.save(e);
        log.info("Alumno creado con ID {} (auth0Id={})", saved.getIdAlumno(), auth0Id);
        return mapper.toResponse(saved);
    }


    @Override
    public AlumnoResponse update(UUID id, AlumnoRequest req) {
        log.debug("Actualizando alumno {} con {}", id, req);

        validateRequest(req);

        AlumnoEntity e = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado: " + id));

        // Si cambian nombres/apellidos/fecha se evita colisión con otro registro
        if ((!e.getNombres().equalsIgnoreCase(req.nombres().trim())
                || !e.getApellidos().equalsIgnoreCase(req.apellidos().trim())
                || !e.getFechaIngreso().equals(req.fechaIngreso()))
                && repo.existsByNombresAndApellidosAndFechaIngreso(
                req.nombres().trim(), req.apellidos().trim(), req.fechaIngreso())) {
            throw new ConflictException("Otro alumno ya tiene esos mismos datos");
        }

        mapper.updateEntityFromDto(req, e);
        AlumnoEntity updated = repo.save(e);
        log.info("Alumno {} actualizado", id);
        return mapper.toResponse(updated);
    }

    @Override
    public void delete(UUID id) {
        log.debug("Eliminando alumno {}", id);
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Alumno no encontrado: " + id);
        }
        repo.deleteById(id);
        log.info("Alumno {} eliminado", id);
    }

    @Override
    @Transactional(readOnly = true)
    public AlumnoResponse getMe(String auth0Id) {
        log.debug("Buscando alumno por Auth0 ID {}", auth0Id);
        AlumnoEntity e = repo.findByAuth0Id(auth0Id)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado para Auth0 ID: " + auth0Id));
        return mapper.toResponse(e);
    }

    // --------------------------------------------------------
    // Validaciones comunes
    // --------------------------------------------------------
    private void validateRequest(AlumnoRequest req) {
        if (req.nombres() == null || req.nombres().isBlank()) {
            throw new BadRequestException("El campo 'nombres' es obligatorio");
        }
        if (req.apellidos() == null || req.apellidos().isBlank()) {
            throw new BadRequestException("El campo 'apellidos' es obligatorio");
        }
        if (req.nombres().length() > 100 || req.apellidos().length() > 100) {
            throw new BadRequestException("Los nombres o apellidos no pueden superar 100 caracteres");
        }
        if (req.fechaIngreso() == null) {
            throw new BadRequestException("La fecha de ingreso es obligatoria");
        }
        if (req.fechaIngreso().isAfter(LocalDate.now())) {
            throw new BadRequestException("La fecha de ingreso no puede ser futura");
        }
        if (req.direccion() == null || req.direccion().isBlank()) {
            throw new BadRequestException("La dirección es obligatoria");
        }
        if (req.direccion().length() > 255) {
            throw new BadRequestException("La dirección no puede superar 255 caracteres");
        }
        if (req.telefono() == null || req.telefono().isBlank()) {
            throw new BadRequestException("El teléfono es obligatorio");
        }
        // patrón simple: dígitos, espacios, guiones y opcional + prefijo país
        if (!req.telefono().matches("^\\+?[0-9\\-\\s]{7,20}$")) {
            throw new BadRequestException("El teléfono tiene un formato inválido");
        }
    }
}

