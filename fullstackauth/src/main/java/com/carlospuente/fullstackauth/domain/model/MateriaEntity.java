package com.carlospuente.fullstackauth.domain.model;

import com.carlospuente.fullstackauth.config.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "materias")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class MateriaEntity extends BaseEntity implements Serializable {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "id_materia", updatable = false, nullable = false, columnDefinition = "BINARY(16)")
    @EqualsAndHashCode.Include
    private UUID idMateria;

    @Column(name = "nombre_materia", nullable = false, length = 100)
    private String nombreMateria;

    @JsonIgnore
    @OneToMany(mappedBy = "materia", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<AlumnoMateriaEntity> alumnosInscritos = new ArrayList<>();
}
