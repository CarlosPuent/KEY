package com.carlospuente.fullstackauth.domain.model;

import com.carlospuente.fullstackauth.config.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "docentes")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class DocenteEntity extends BaseEntity implements Serializable {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "id_docente", updatable = false, nullable = false, columnDefinition = "BINARY(16)")
    @EqualsAndHashCode.Include
    private UUID idDocente;

    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;

    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDate fechaIngreso;
}
