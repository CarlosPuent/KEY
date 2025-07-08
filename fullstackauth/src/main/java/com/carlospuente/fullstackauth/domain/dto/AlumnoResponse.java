package com.carlospuente.fullstackauth.domain.dto;

import java.time.LocalDate;
import java.util.UUID;

public record AlumnoResponse(
        UUID idAlumno,
        String nombres,
        String apellidos,
        LocalDate fechaIngreso,
        String direccion,
        String telefono
) {}