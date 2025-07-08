package com.carlospuente.fullstackauth.domain.dto;

import java.util.UUID;

public record AlumnoMateriaResponse(
        UUID id,
        UUID alumnoId,
        UUID materiaId,
        UUID docenteId,
        String ciclo,
        Double notaFinal
) {}