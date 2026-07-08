# Aplicação Web - Clínica Médica

Projeto acadêmico da disciplina DIM0125 - Banco de Dados (90h)

Aplicação web para gestão de clínica médica.  
O backend foi desenvolvido em Spring Boot utilizando Spring JDBC para controle direto sobre o banco de dados relacional MySQL.  
O frontend foi desenvolvido em React com TypeScript, utilizando Vite como bundler e Tailwind CSS + shadcn/ui para a interface.

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
    ├── src/
    │   ├── api/                  # Configuração do cliente HTTP (axios)
    │   ├── components/           # Componentes reutilizáveis
    │   ├── hooks/                # Hooks customizados (useAuth, etc.)
    │   ├── lib/                  # Utilitários, formatadores e validações
    │   ├── pages/                # Páginas da aplicação organizadas por módulo
    │   │   ├── admin/
    │   │   ├── atendente/
    │   │   ├── auth/
    │   │   ├── errors/
    │   │   ├── medico/
    │   │   └── paciente/
    │   ├── routes/               # Configuração das rotas e guards de acesso
    │   ├── services/             # Serviços de integração com a API
    │   ├── types/                # Definições de tipos TypeScript (DTOs)
    │   ├── App.tsx
    │   └── main.tsx
    ├── .gitignore
    ├── components.json           # Configuração do shadcn/ui
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── pnpm-lock.yaml
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

## Tecnologias

### Backend

- Java 21
- Spring Boot 3
- Spring Security (JWT)
- Spring JDBC
- MySQL
- Docker
- Maven

### Frontend

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- shadcn/ui (baseado em Radix UI)
- React Router DOM 7
- Axios
- React Hook Form + Zod (validação de formulários)
- Lucide React (ícones)
- date-fns (manipulação de datas)
- Sonner (notificações toast)

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- JDK 21+
- Maven 3.8+
- Docker e Docker Compose
- Node.js 20+
- pnpm (recomendado) ou npm

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

O backend estará disponível em `http://localhost:8080`.

### Frontend

1. Em um novo terminal, acesse a pasta do frontend:

```bash
cd frontend
```

2. Instale as dependências do projeto:

```bash
pnpm install
```

> Caso não tenha o `pnpm` instalado, você pode usar o `npm install` como alternativa. O projeto também possui um `package-lock.json` para compatibilidade.

3. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

4. Acesse a aplicação no navegador:

```
http://localhost:5173
```

> Certifique-se de que o backend está rodando antes de iniciar o frontend, pois a interface consome a API REST em `http://localhost:8080/api`.

## Perfis de Acesso

A aplicação possui quatro perfis de usuário com permissões distintas:

- **Administrador**: Gestão de médicos, atendentes e pacientes.
- **Atendente**: Controle de agendamentos, check-in e cadastro de pacientes.
- **Médico**: Gestão de disponibilidade, fila de atendimento e prontuários.
- **Paciente**: Autoatendimento, agendamento de consultas e acompanhamento de exames.

Credenciais de teste estão disponíveis no script `backend/src/main/resources/data.sql`.
