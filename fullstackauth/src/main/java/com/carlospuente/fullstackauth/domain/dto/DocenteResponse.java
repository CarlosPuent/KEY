package com.carlospuente.fullstackauth.domain.dto;

import java.time.LocalDate;
import java.util.UUID;

public record DocenteResponse(
        UUID idDocente,
        String nombres,
        String apellidos,
        LocalDate fechaIngreso
) {}