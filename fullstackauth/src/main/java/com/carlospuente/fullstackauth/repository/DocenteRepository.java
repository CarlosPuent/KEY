package com.carlospuente.fullstackauth.repository;

import com.carlospuente.fullstackauth.domain.model.DocenteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.UUID;

public interface DocenteRepository extends JpaRepository<DocenteEntity, UUID> {
    boolean existsByNombresAndApellidosAndFechaIngreso(
            String nombres,
            String apellidos,
            LocalDate fechaIngreso
    );
}