package com.carlospuente.fullstackauth.domain.dto;

import java.util.UUID;

public record AlumnoMateriaBoletaResponse(
        UUID id,
        String materiaNombre,
        Double notaFinal
) {}