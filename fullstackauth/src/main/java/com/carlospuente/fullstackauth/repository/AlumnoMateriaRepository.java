package com.carlospuente.fullstackauth.repository;

import com.carlospuente.fullstackauth.domain.model.AlumnoEntity;
import com.carlospuente.fullstackauth.domain.model.AlumnoMateriaEntity;
import com.carlospuente.fullstackauth.domain.model.MateriaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AlumnoMateriaRepository extends JpaRepository<AlumnoMateriaEntity, UUID> {
    boolean existsByAlumnoAndMateriaAndCiclo(
            AlumnoEntity alumno,
            MateriaEntity materia,
            String ciclo
    );
    List<AlumnoMateriaEntity> findByAlumno_Auth0Id(String auth0Id);

}