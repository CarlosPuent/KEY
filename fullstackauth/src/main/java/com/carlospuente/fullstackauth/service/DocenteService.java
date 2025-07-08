package com.carlospuente.fullstackauth.service;

import com.carlospuente.fullstackauth.domain.dto.*;
import java.util.List;
import java.util.UUID;

public interface DocenteService {
    List<DocenteResponse> listAll();
    DocenteResponse getById(UUID id);
    DocenteResponse create(DocenteRequest request);
    DocenteResponse update(UUID id, DocenteRequest request);
    void delete(UUID id);
}