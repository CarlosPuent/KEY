package com.carlospuente.fullstackauth.domain.mapper;

import com.carlospuente.fullstackauth.domain.model.*;
import com.carlospuente.fullstackauth.domain.dto.*;
import org.springframework.stereotype.Component;

@Component
public class AlumnoMateriaMapper {

    public AlumnoMateriaEntity toEntity(AlumnoMateriaRequest dto) {
        if (dto == null) return null;
        AlumnoMateriaEntity e = new AlumnoMateriaEntity();
        e.setCiclo(dto.ciclo());
        e.setNotaFinal(dto.notaFinal());
        return e;
    }

    public AlumnoMateriaResponse toResponse(AlumnoMateriaEntity e) {
        if (e == null) return null;
        return new AlumnoMateriaResponse(
                e.getId(),
                e.getAlumno().getIdAlumno(),
                e.getMateria().getIdMateria(),
                e.getDocente().getIdDocente(),
                e.getCiclo(),
                e.getNotaFinal()
        );
    }

    public void updateEntityFromDto(AlumnoMateriaRequest dto, AlumnoMateriaEntity e) {
        if (dto == null || e == null) return;
        if (dto.ciclo() != null)     e.setCiclo(dto.ciclo());
        if (dto.notaFinal() != null) e.setNotaFinal(dto.notaFinal());
    }
}
