package com.carlospuente.fullstackauth.domain.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record DocenteRequest(
        @NotBlank @Size(max = 100) String nombres,
        @NotBlank @Size(max = 100) String apellidos,
        @NotNull                       LocalDate fechaIngreso
) {}