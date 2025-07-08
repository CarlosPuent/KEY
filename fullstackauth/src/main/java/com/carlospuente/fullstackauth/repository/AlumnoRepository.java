package com.carlospuente.fullstackauth.repository;

import com.carlospuente.fullstackauth.domain.model.AlumnoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

public interface AlumnoRepository extends JpaRepository<AlumnoEntity, UUID> {
    boolean existsByNombresAndApellidosAndFechaIngreso(
            String nombres,
            String apellidos,
            LocalDate fechaIngreso
    );
    Optional<AlumnoEntity> findByAuth0Id(String auth0Id);
    boolean existsByAuth0Id(String auth0Id);

}