package com.carlospuente.fullstackauth.service;

import com.carlospuente.fullstackauth.domain.dto.*;
import java.util.List;
import java.util.UUID;

public interface AlumnoMateriaService {
    List<AlumnoMateriaResponse> listAll();
    AlumnoMateriaResponse getById(UUID id);
    AlumnoMateriaResponse create(AlumnoMateriaRequest request);
    AlumnoMateriaResponse update(UUID id, AlumnoMateriaRequest request);
    void delete(UUID id);
    List<AlumnoMateriaBoletaResponse> listByAlumnoAuth0Id(String auth0Id);
}