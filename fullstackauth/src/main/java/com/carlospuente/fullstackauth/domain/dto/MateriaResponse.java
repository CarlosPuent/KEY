package com.carlospuente.fullstackauth.domain.dto;

import java.util.UUID;

public record MateriaResponse(
        UUID idMateria,
        String nombreMateria
) {}