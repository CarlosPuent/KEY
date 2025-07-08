package com.carlospuente.fullstackauth.domain.mapper;

import com.carlospuente.fullstackauth.domain.model.MateriaEntity;
import com.carlospuente.fullstackauth.domain.dto.MateriaRequest;
import com.carlospuente.fullstackauth.domain.dto.MateriaResponse;
import org.springframework.stereotype.Component;

@Component
public class MateriaMapper {

    public MateriaEntity toEntity(MateriaRequest dto) {
        if (dto == null) return null;
        MateriaEntity e = new MateriaEntity();
        // idMateria lo genera la BD
        e.setNombreMateria(dto.nombreMateria());
        return e;
    }

    public MateriaResponse toResponse(MateriaEntity e) {
        if (e == null) return null;
        return new MateriaResponse(
                e.getIdMateria(),
                e.getNombreMateria()
        );
    }

    public void updateEntityFromDto(MateriaRequest dto, MateriaEntity e) {
        if (dto == null || e == null) return;
        if (dto.nombreMateria() != null) {
            e.setNombreMateria(dto.nombreMateria());
        }
    }
}
