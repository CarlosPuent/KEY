package com.carlospuente.fullstackauth.domain.mapper;

import com.carlospuente.fullstackauth.domain.model.AlumnoEntity;
import com.carlospuente.fullstackauth.domain.dto.AlumnoRequest;
import com.carlospuente.fullstackauth.domain.dto.AlumnoResponse;
import org.springframework.stereotype.Component;

@Component
public class AlumnoMapper {

    public AlumnoEntity toEntity(AlumnoRequest dto) {
        if (dto == null) return null;
        AlumnoEntity e = new AlumnoEntity();
        e.setNombres(dto.nombres());
        e.setApellidos(dto.apellidos());
        e.setFechaIngreso(dto.fechaIngreso());
        e.setDireccion(dto.direccion());
        e.setTelefono(dto.telefono());
        return e;
    }

    public AlumnoResponse toResponse(AlumnoEntity e) {
        if (e == null) return null;
        return new AlumnoResponse(
                e.getIdAlumno(),
                e.getNombres(),
                e.getApellidos(),
                e.getFechaIngreso(),
                e.getDireccion(),
                e.getTelefono()
        );
    }

    public void updateEntityFromDto(AlumnoRequest dto, AlumnoEntity e) {
        if (dto == null || e == null) return;
        if (dto.nombres() != null)       e.setNombres(dto.nombres());
        if (dto.apellidos() != null)     e.setApellidos(dto.apellidos());
        if (dto.fechaIngreso() != null)  e.setFechaIngreso(dto.fechaIngreso());
        if (dto.direccion() != null)     e.setDireccion(dto.direccion());
        if (dto.telefono() != null)      e.setTelefono(dto.telefono());
    }
}
