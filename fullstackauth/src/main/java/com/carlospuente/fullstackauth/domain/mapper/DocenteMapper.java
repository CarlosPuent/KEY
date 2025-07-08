package com.carlospuente.fullstackauth.domain.mapper;

import com.carlospuente.fullstackauth.domain.model.DocenteEntity;
import com.carlospuente.fullstackauth.domain.dto.DocenteRequest;
import com.carlospuente.fullstackauth.domain.dto.DocenteResponse;
import org.springframework.stereotype.Component;

@Component
public class DocenteMapper {

    public DocenteEntity toEntity(DocenteRequest dto) {
        if (dto == null) return null;
        DocenteEntity e = new DocenteEntity();
        e.setNombres(dto.nombres());
        e.setApellidos(dto.apellidos());
        e.setFechaIngreso(dto.fechaIngreso());
        return e;
    }

    public DocenteResponse toResponse(DocenteEntity e) {
        if (e == null) return null;
        return new DocenteResponse(
                e.getIdDocente(),
                e.getNombres(),
                e.getApellidos(),
                e.getFechaIngreso()
        );
    }

    public void updateEntityFromDto(DocenteRequest dto, DocenteEntity e) {
        if (dto == null || e == null) return;
        if (dto.nombres() != null)      e.setNombres(dto.nombres());
        if (dto.apellidos() != null)    e.setApellidos(dto.apellidos());
        if (dto.fechaIngreso() != null) e.setFechaIngreso(dto.fechaIngreso());
    }
}
