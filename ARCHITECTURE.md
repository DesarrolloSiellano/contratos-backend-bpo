# Arquitectura y Documentación Técnica - Sistema BPO Backend

Este documento describe la estructura, flujos y el modelo de datos del backend para la gestión de contratistas y contratos.

## 1. Modelo de Datos Relacional (ERD)

El sistema utiliza PostgreSQL como base de datos relacional para garantizar la integridad y trazabilidad de la información contractual.

```mermaid
erDiagram
    CONTRATISTA ||--o{ CONTRATO : "firma"
    CONTRATISTA ||--o{ LISTA_CHEQUEO : "gestiona"
    CONTRATISTA ||--o{ SOPORTE : "sube"
    
    CONTRATO ||--o{ TAREA : "contiene"
    CONTRATO ||--o{ PERIODO : "se divide en"
    CONTRATO ||--o{ OBJETIVO : "define"
    CONTRATO ||--o{ SOPORTE : "asocia"
    
    PERIODO ||--o| EVALUACION : "se califica en"
    PERIODO ||--o{ SOPORTE : "justifica"
    
    TAREA ||--o{ SOPORTE : "evidencia"
    OBJETIVO ||--o{ SOPORTE : "cumple"

    CONTRATISTA {
        int id
        string numero_doc
        string nom
        string email
    }
    CONTRATO {
        uuid id
        string numero_contrato
        date fecha_inicio
        date fecha_fin
    }
    PERIODO {
        uuid id
        string numero_periodo
        date fecha_inicial
        date fecha_final
    }
    EVALUACION {
        uuid id
        string responsable
        string porcentaje_evaluado
    }
    SOPORTE {
        uuid id
        string filename
        string mimetype
        string url
        boolean revisado
    }
```

## 2. Estructura de Módulos

La aplicación sigue una arquitectura modular en NestJS, donde cada recurso es independiente pero está interconectado mediante relaciones de TypeORM.

```mermaid
graph TD
    App[AppModule] --> Core[Core: Database, Auth]
    App --> Contractor[ContractorModule]
    App --> Checklist[ContractorChecklistModule]
    App --> Contract[ContractModule]
    App --> Task[TaskModule]
    App --> Evaluation[EvaluationModule]
    App --> Period[PeriodModule]
    App --> Objective[ObjectiveModule]
    App --> Support[SupportModule]
    
    Contract --> Task
    Contract --> Period
    Contract --> Objective
    Period --> Evaluation
    Support -.-> AllEntities[Todas las Entidades]
```

## 3. Flujo de Gestión Documental (Soportes)

1.  **Carga:** Los archivos se suben vía `POST /support/upload` asociándolos a un `contratistaId` y opcionalmente a otras entidades (`contratoId`, `tareaId`, etc.).
2.  **Almacenamiento:** El archivo físico se guarda en `./uploads/supports/` con un nombre único (UUID).
3.  **Trazabilidad:** La base de datos guarda la metadata y la URL de acceso.
4.  **Aprobación:** Los supervisores pueden marcar los soportes como `revisado` o `rechazado`.

## 4. Observabilidad y Logs

El sistema utiliza `nestjs-pino` para el registro de eventos:
- **Consola:** Formato amigable mediante `pino-pretty`.
- **Archivos:** Rotación diaria en la carpeta `/logs` mediante `pino-roll`.
- **Nivel:** Configurado globalmente para capturar errores, advertencias e información relevante de las peticiones.

## 5. Documentación de API (Swagger)

La documentación interactiva está disponible en:
- `http://localhost:3000/docs` (o el puerto configurado).
- Incluye esquemas de validación (DTOs) y ejemplos de respuestas.
