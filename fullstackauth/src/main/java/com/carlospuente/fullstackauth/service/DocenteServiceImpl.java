package com.carlospuente.fullstackauth.service;

import com.carlospuente.fullstackauth.domain.dto.DocenteRequest;
import com.carlospuente.fullstackauth.domain.dto.DocenteResponse;
import com.carlospuente.fullstackauth.domain.mapper.DocenteMapper;
import com.carlospuente.fullstackauth.domain.model.DocenteEntity;
import com.carlospuente.fullstackauth.exception.ConflictException;
import com.carlospuente.fullstackauth.repository.DocenteRepository;
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
public class DocenteServiceImpl implements DocenteService {

    private static final Logger log = LoggerFactory.getLogger(DocenteServiceImpl.class);

    private final DocenteRepository repo;
    private final DocenteMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<DocenteResponse> listAll() {
        log.debug("Listando todos los docentes");
        return repo.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DocenteResponse getById(UUID id) {
        log.debug("Buscando docente por ID {}", id);
        DocenteEntity e = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado: " + id));
        return mapper.toResponse(e);
    }

    @Override
    public DocenteResponse create(DocenteRequest req) {
        log.debug("Creando docente: {}", req);
        validateRequest(req);

        // Prevención de duplicados por nombres+apellidos+fechaIngreso
        if (repo.existsByNombresAndApellidosAndFechaIngreso(
                req.nombres().trim(),
                req.apellidos().trim(),
                req.fechaIngreso())) {
            throw new ConflictException("Ya existe un docente con los mismos datos");
        }

        DocenteEntity e = mapper.toEntity(req);
        DocenteEntity saved = repo.save(e);
        log.info("Docente creado con ID {}", saved.getIdDocente());
        return mapper.toResponse(saved);
    }

    @Override
    public DocenteResponse update(UUID id, DocenteRequest req) {
        log.debug("Actualizando docente {} con {}", id, req);
        validateRequest(req);

        DocenteEntity e = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado: " + id));

        // Si cambian nombres/apellidos/fechaIngreso, evitar colisión
        boolean claveCambia = !e.getNombres().equalsIgnoreCase(req.nombres().trim())
                || !e.getApellidos().equalsIgnoreCase(req.apellidos().trim())
                || !e.getFechaIngreso().equals(req.fechaIngreso());
        if (claveCambia && repo.existsByNombresAndApellidosAndFechaIngreso(
                req.nombres().trim(),
                req.apellidos().trim(),
                req.fechaIngreso())) {
            throw new ConflictException("Otro docente ya posee esos mismos datos");
        }

        mapper.updateEntityFromDto(req, e);
        DocenteEntity updated = repo.save(e);
        log.info("Docente {} actualizado", id);
        return mapper.toResponse(updated);
    }

    @Override
    public void delete(UUID id) {
        log.debug("Eliminando docente {}", id);
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Docente no encontrado: " + id);
        }
        repo.deleteById(id);
        log.info("Docente {} eliminado", id);
    }

    private void validateRequest(DocenteRequest req) {
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
    }
}