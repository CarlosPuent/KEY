package com.carlospuente.fullstackauth.domain.model;

import com.carlospuente.fullstackauth.config.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "alumnos")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class AlumnoEntity extends BaseEntity implements Serializable {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "id_alumno", updatable = false, nullable = false, columnDefinition = "BINARY(16)")
    @EqualsAndHashCode.Include
    private UUID idAlumno;

    @Column(nullable = false, unique = true)
    private String auth0Id;

    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;

    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDate fechaIngreso;

    @Column(name = "direccion", nullable = false, length = 255)
    private String direccion;

    @Column(name = "telefono", nullable = false, length = 20)
    private String telefono;

    @JsonIgnore
    @OneToMany(mappedBy = "alumno", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<AlumnoMateriaEntity> materiasCursadas = new ArrayList<>();
}