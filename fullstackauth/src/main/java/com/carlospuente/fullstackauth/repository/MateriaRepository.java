package com.carlospuente.fullstackauth.repository;

import com.carlospuente.fullstackauth.domain.model.MateriaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface MateriaRepository extends JpaRepository<MateriaEntity, UUID> {
    boolean existsByNombreMateriaIgnoreCase(String nombreMateria);
}