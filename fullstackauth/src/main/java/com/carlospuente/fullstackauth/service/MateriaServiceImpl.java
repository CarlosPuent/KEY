package com.carlospuente.fullstackauth.service;

import com.carlospuente.fullstackauth.domain.dto.MateriaRequest;
import com.carlospuente.fullstackauth.domain.dto.MateriaResponse;
import com.carlospuente.fullstackauth.domain.mapper.MateriaMapper;
import com.carlospuente.fullstackauth.domain.model.MateriaEntity;
import com.carlospuente.fullstackauth.exception.BadRequestException;
import com.carlospuente.fullstackauth.repository.MateriaRepository;
import com.carlospuente.fullstackauth.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import com.carlospuente.fullstackauth.exception.ConflictException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
@Transactional
public class MateriaServiceImpl implements MateriaService {

    private static final Logger log = LoggerFactory.getLogger(MateriaServiceImpl.class);
    private final MateriaRepository repo;
    private final MateriaMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<MateriaResponse> listAll() {
        log.debug("Listando todas las materias");
        return repo.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MateriaResponse getById(UUID id) {
        log.debug("Buscando materia por ID {}", id);
        MateriaEntity e = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada: " + id));
        return mapper.toResponse(e);
    }

    @Override
    public MateriaResponse create(MateriaRequest req) {
        log.debug("Creando materia: {}", req);
        validateRequest(req);

        // Verificar duplicados por nombre (ignore case)
        if (repo.existsByNombreMateriaIgnoreCase(req.nombreMateria().trim())) {
            throw new ConflictException("Ya existe una materia con el nombre '" + req.nombreMateria() + "'");
        }

        MateriaEntity e = mapper.toEntity(req);
        MateriaEntity saved = repo.save(e);
        log.info("Materia creada con ID {}", saved.getIdMateria());
        return mapper.toResponse(saved);
    }

    @Override
    public MateriaResponse update(UUID id, MateriaRequest req) {
        log.debug("Actualizando materia {} con {}", id, req);
        validateRequest(req);

        MateriaEntity e = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada: " + id));

        // Si el nombre cambia, comprobamos que no colisione con otra materia
        String nuevoNombre = req.nombreMateria().trim();
        if (!e.getNombreMateria().equalsIgnoreCase(nuevoNombre)
                && repo.existsByNombreMateriaIgnoreCase(nuevoNombre)) {
            throw new ConflictException("Otra materia ya usa el nombre '" + nuevoNombre + "'");
        }

        mapper.updateEntityFromDto(req, e);
        MateriaEntity updated = repo.save(e);
        log.info("Materia {} actualizada", id);
        return mapper.toResponse(updated);
    }

    @Override
    public void delete(UUID id) {
        log.debug("Eliminando materia {}", id);
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Materia no encontrada: " + id);
        }
        repo.deleteById(id);
        log.info("Materia {} eliminada", id);
    }

    private void validateRequest(MateriaRequest req) {
        if (req.nombreMateria() == null || req.nombreMateria().isBlank()) {
            throw new BadRequestException("El campo 'nombreMateria' es obligatorio");
        }
        String nombre = req.nombreMateria().trim();
        if (nombre.length() < 3 || nombre.length() > 100) {
            throw new BadRequestException("El nombre de la materia debe tener entre 3 y 100 caracteres");
        }
    }
}