package com.carlospuente.fullstackauth.service;

import com.carlospuente.fullstackauth.domain.dto.AlumnoMateriaBoletaResponse;
import com.carlospuente.fullstackauth.domain.dto.AlumnoMateriaRequest;
import com.carlospuente.fullstackauth.domain.dto.AlumnoMateriaResponse;
import com.carlospuente.fullstackauth.domain.mapper.AlumnoMateriaMapper;
import com.carlospuente.fullstackauth.domain.model.AlumnoMateriaEntity;
import com.carlospuente.fullstackauth.repository.AlumnoMateriaRepository;
import com.carlospuente.fullstackauth.repository.AlumnoRepository;
import com.carlospuente.fullstackauth.repository.DocenteRepository;
import com.carlospuente.fullstackauth.repository.MateriaRepository;
import com.carlospuente.fullstackauth.exception.BadRequestException;
import com.carlospuente.fullstackauth.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import com.carlospuente.fullstackauth.domain.model.AlumnoEntity;
import com.carlospuente.fullstackauth.domain.model.DocenteEntity;
import com.carlospuente.fullstackauth.domain.model.MateriaEntity;
import com.carlospuente.fullstackauth.exception.ConflictException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class AlumnoMateriaServiceImpl implements AlumnoMateriaService {

    private static final Logger log = LoggerFactory.getLogger(AlumnoMateriaServiceImpl.class);
    private static final Pattern CICLO_PATTERN = Pattern.compile("^\\d{4}-[12]$");

    private final AlumnoMateriaRepository repo;
    private final AlumnoRepository alumnoRepo;
    private final MateriaRepository materiaRepo;
    private final DocenteRepository docenteRepo;
    private final AlumnoMateriaMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<AlumnoMateriaResponse> listAll() {
        log.debug("Listando todas las inscripciones");
        return repo.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlumnoMateriaBoletaResponse> listByAlumnoAuth0Id(String auth0Id) {
        // Asumiendo que tu repo puede buscar por auth0Id en AlumnoEntity
        // y luego traes sus relaciones a AlumnoMateriaEntity
        List<AlumnoMateriaEntity> relaciones = repo.findByAlumno_Auth0Id(auth0Id);
        return relaciones.stream().map(rel -> {
            String nombreMat = rel.getMateria().getNombreMateria();
            return new AlumnoMateriaBoletaResponse(rel.getId(), nombreMat, rel.getNotaFinal());
        }).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AlumnoMateriaResponse getById(UUID id) {
        log.debug("Buscando inscripción por ID {}", id);
        var e = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inscripción no encontrada: " + id));
        return mapper.toResponse(e);
    }

    @Override
    public AlumnoMateriaResponse create(AlumnoMateriaRequest req) {
        log.debug("Creando inscripcion: {}", req);
        validateRequest(req);

        AlumnoEntity alumno = alumnoRepo.findById(req.alumnoId())
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado: " + req.alumnoId()));
        MateriaEntity materia = materiaRepo.findById(req.materiaId())
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada: " + req.materiaId()));
        DocenteEntity docente = docenteRepo.findById(req.docenteId())
                .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado: " + req.docenteId()));

        // Prevención de duplicados: mismo alumno, misma materia y mismo ciclo
        if (repo.existsByAlumnoAndMateriaAndCiclo(alumno, materia, req.ciclo())) {
            throw new ConflictException("Ya existe una inscripción para este alumno, materia y ciclo");
        }

        var entity = mapper.toEntity(req);
        entity.setAlumno(alumno);
        entity.setMateria(materia);
        entity.setDocente(docente);
        var saved = repo.save(entity);
        log.info("Inscripción creada con ID {}", saved.getId());
        return mapper.toResponse(saved);
    }

    @Override
    public AlumnoMateriaResponse update(UUID id, AlumnoMateriaRequest req) {
        log.debug("Actualizando inscripción {} con {}", id, req);
        validateRequest(req);

        var e = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inscripción no encontrada: " + id));

        // Si cambian alumno, materia o ciclo, verificar duplicado
        boolean keyChanged = !e.getAlumno().getIdAlumno().equals(req.alumnoId())
                || !e.getMateria().getIdMateria().equals(req.materiaId())
                || !e.getCiclo().equals(req.ciclo());
        if (keyChanged
                && repo.existsByAlumnoAndMateriaAndCiclo(
                alumnoRepo.getReferenceById(req.alumnoId()),
                materiaRepo.getReferenceById(req.materiaId()),
                req.ciclo())) {
            throw new ConflictException("Otra inscripción ya usa el mismo alumno, materia y ciclo");
        }

        mapper.updateEntityFromDto(req, e);
        var updated = repo.save(e);
        log.info("Inscripción {} actualizada", id);
        return mapper.toResponse(updated);
    }

    @Override
    public void delete(UUID id) {
        log.debug("Eliminando inscripción {}", id);
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Inscripción no encontrada: " + id);
        }
        repo.deleteById(id);
        log.info("Inscripción {} eliminada", id);
    }

    private void validateRequest(AlumnoMateriaRequest req) {
        if (req.alumnoId() == null) {
            throw new BadRequestException("El alumnoId es obligatorio");
        }
        if (req.materiaId() == null) {
            throw new BadRequestException("El materiaId es obligatorio");
        }
        if (req.docenteId() == null) {
            throw new BadRequestException("El docenteId es obligatorio");
        }
        if (req.ciclo() == null || req.ciclo().isBlank()) {
            throw new BadRequestException("El ciclo es obligatorio");
        }
        if (!CICLO_PATTERN.matcher(req.ciclo()).matches()) {
            throw new BadRequestException("El ciclo debe tener formato YYYY-1 o YYYY-2");
        }
        if (req.notaFinal() == null) {
            throw new BadRequestException("La nota final es obligatoria");
        }
        if (req.notaFinal() < 0 || req.notaFinal() > 100) {
            throw new BadRequestException("La nota final debe estar entre 0 y 100");
        }
    }
}
