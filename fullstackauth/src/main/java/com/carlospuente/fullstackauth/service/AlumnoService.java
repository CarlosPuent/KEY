package com.carlospuente.fullstackauth.service;

import com.carlospuente.fullstackauth.domain.dto.AlumnoRequest;
import com.carlospuente.fullstackauth.domain.dto.AlumnoResponse;
import java.util.List;
import java.util.UUID;

public interface AlumnoService {
    List<AlumnoResponse> listAll();
    AlumnoResponse getById(UUID id);
    AlumnoResponse create(AlumnoRequest request, String auth0Id);
    AlumnoResponse update(UUID id, AlumnoRequest request);
    void delete(UUID id);
    AlumnoResponse getMe(String auth0Id);
}
