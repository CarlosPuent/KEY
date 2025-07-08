package com.carlospuente.fullstackauth.domain.dto;

import jakarta.validation.constraints.*;

public record MateriaRequest(
        @NotBlank @Size(max = 100) String nombreMateria
) {}