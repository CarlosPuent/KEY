package com.carlospuente.fullstackauth.service;

import com.carlospuente.fullstackauth.domain.dto.*;
import java.util.List;
import java.util.UUID;

public interface MateriaService {
    List<MateriaResponse> listAll();
    MateriaResponse getById(UUID id);
    MateriaResponse create(MateriaRequest request);
    MateriaResponse update(UUID id, MateriaRequest request);
    void delete(UUID id);
}