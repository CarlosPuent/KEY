package com.carlospuente.fullstackauth.domain.model;

import java.io.Serializable;
import java.util.UUID;

import com.carlospuente.fullstackauth.config.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "alumno_materias")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class AlumnoMateriaEntity extends BaseEntity implements Serializable {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "BINARY(16)")
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_alumno", nullable = false)
    private AlumnoEntity alumno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_materia", nullable = false)
    private MateriaEntity materia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_docente", nullable = false)
    private DocenteEntity docente;

    @Column(name = "ciclo", nullable = false, length = 20)
    private String ciclo;

    @Column(name = "nota_final")
    private Double notaFinal;
}