package com.carlospuente.fullstackauth.domain.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record AlumnoRequest(
        @NotBlank @Size(max = 100) String nombres,
        @NotBlank @Size(max = 100) String apellidos,
        @NotNull                       LocalDate fechaIngreso,
        @NotBlank @Size(max = 255)     String direccion,
        @NotBlank @Size(max = 20)      String telefono
) {}