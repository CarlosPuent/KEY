package com.carlospuente.fullstackauth.domain.dto;

import jakarta.validation.constraints.*;
import java.util.UUID;

public record AlumnoMateriaRequest(
        @NotNull UUID alumnoId,
        @NotNull UUID materiaId,
        @NotNull UUID docenteId,
        @NotBlank @Size(max = 20) String ciclo,
        @DecimalMin("0.0") @DecimalMax("100.0") Double notaFinal
) {}