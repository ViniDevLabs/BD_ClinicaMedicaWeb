# Aplicação Web - Clínica Médica

Projeto acadêmico da disciplina DIM0125 - Banco de Dados (90h)

Aplicação web para gestão de clínica médica.  
O backend foi desenvolvido em Spring Boot utilizando Spring JDBC para controle direto sobre o banco de dados relacional MySQL.

## Integrantes

- Iury Fredson Germano Miranda
- Matheus Henrique Ferreira da Silva
- Vinícius César Neves de Brito

## Estrutura do Projeto

Abaixo está a organização principal dos diretórios e arquivos do projeto:

```text
.
├── backend/
│   ├── bruno-api-collection/  # Coleção de requisições configuradas para o cliente HTTP Bruno
│   ├── src/
│   │   └── main/
│   │       ├── java/com/clinicamedica/
│   │       │   ├── config/
│   │       │   ├── controller/
│   │       │   ├── dto/
│   │       │   ├── exception/
│   │       │   ├── mapper/
│   │       │   ├── model/
│   │       │   ├── repository/
│   │       │   └── service/
│   │       │   └── ClinicaMedicaApplication.java
│   │       └── resources/
│   │           ├── application.properties
│   │           ├── data.sql               # Script de seed (popula o banco na inicialização)
│   │           └── schema.sql             # Script DDL de criação das tabelas
│   ├── docker-compose.yml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── pom.xml
└── frontend/
```

## Como Rodar

### Backend

1. Abra o terminal e acesse a pasta do backend:

```bash
cd backend
```

2. Inicialize o banco de dados MySQL via Docker:

```bash
docker compose up -d
```

Obs.: O Spring Boot está configurado para ler automaticamente os arquivos `schema.sql` e `data.sql` e montar o banco de dados quando a aplicação iniciar.

3. Rode a aplicação Spring Boot utilizando o Maven:

```bash
mvn spring-boot:run
```
