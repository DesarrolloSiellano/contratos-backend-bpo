# Arquitectura y Documentación Técnica

Este documento describe la estructura y los flujos del backend.

## 1. Modelo de Datos (ERD)

```mermaid
erDiagram
    CONTRATISTA ||--o{ TAREA : tiene
    CONTRATISTA {
        int id
        string nom
        string ape
        string email
        string numero_doc
        string rol
    }
    TAREA {
        string id
        string numeroContrato
        string tarea
        string estado
        string responsable
    }
```

## 2. Flujo de Validación

```mermaid
graph TD
    Request[Cliente] --> Pipe(ValidationPipe)
    Pipe --> Error[400 Error]
    Pipe --> DTO[DTO Valido]
    DTO --> Controller[Controller]
    Controller --> Service[Service]
    Service --> DB[(Database)]
```

## 3. Autenticación (Microservicio)

```mermaid
sequenceDiagram
    participant C as Cliente
    participant B as Backend
    participant A as AuthMS

    C->>B: Request + JWT
    B->>A: TCP findUserById
    A-->>B: User Data
    B-->>C: Response
```

## 4. Estructura de Módulos

```mermaid
graph LR
    App --> Tasks
    App --> Contractors
    App --> Database
    App --> TcpClient
```

## 5. Tecnologías

- **Framework:** NestJS
- **ORM:** TypeORM
- **Base de Datos:** PostgreSQL
- **Comunicación:** TCP
- **Validación:** Class-Validator
