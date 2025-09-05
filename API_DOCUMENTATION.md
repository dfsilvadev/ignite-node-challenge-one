# Task Management API - Documentação da API

## Visão Geral

API REST para gerenciamento de tarefas com operações CRUD completas e importação em lote via CSV.

## Instalação e Execução

### Pré-requisitos

- Node.js 18+
- Yarn ou NPM

### Instalação

```bash
# Instalar dependências
yarn install

# Executar em desenvolvimento
yarn dev

# Build para produção
yarn build
```

### Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
NODE_ENV=development
BASE_URL=
```

## Endpoints da API

### Base URL

```
http://localhost:3000
```

### 1. Listar Tarefas

```http
GET /tasks
```

**Resposta:**

```json
{
  "status": "Ok",
  "details": [
    {
      "id": "uuid",
      "title": "Título da tarefa",
      "description": "Descrição da tarefa",
      "completed_at": null,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Criar Tarefa

```http
POST /tasks
Content-Type: application/json

{
  "title": "Título da tarefa",
  "description": "Descrição da tarefa"
}
```

**Validações:**

- `title`: obrigatório, string, 5-150 caracteres
- `description`: obrigatório, string, máximo 550 caracteres

**Resposta:**

```json
{
  "status": "OK",
  "details": {
    "id": "uuid",
    "title": "Título da tarefa",
    "description": "Descrição da tarefa",
    "completed_at": null,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

### 3. Importar Tarefas (CSV)

```http
POST /tasks/create-many
Content-Type: multipart/form-data

file: arquivo.csv
```

**Formato do CSV:**

```csv
title,description
"Título 1","Descrição 1"
"Título 2","Descrição 2"
```

**Resposta:**

```json
{
  "status": "OK",
  "message": "IMPORTED_SUCCESSFULLY",
  "imported": 2
}
```

### 4. Atualizar Tarefa

```http
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Novo título",
  "description": "Nova descrição"
}
```

**Validações:**

- `id`: UUID válido
- `title`: opcional, string, 5-150 caracteres
- `description`: opcional, string, máximo 550 caracteres

**Resposta:**

```json
{
  "status": "OK",
  "details": {
    "id": "uuid",
    "title": "Novo título",
    "description": "Nova descrição",
    "completed_at": null,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

### 5. Marcar como Concluída

```http
PATCH /tasks/:id/completed
```

**Validações:**

- `id`: UUID válido

**Resposta:**

```json
{
  "status": "OK",
  "details": {
    "id": "uuid",
    "title": "Título da tarefa",
    "description": "Descrição da tarefa",
    "completed_at": "2025-01-01T00:00:00.000Z",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

### 6. Deletar Tarefa

```http
DELETE /tasks/:id
```

**Validações:**

- `id`: UUID válido

**Resposta:**

```json
{
  "status": "OK",
  "details": {
    "id": "uuid",
    "title": "Título da tarefa",
    "description": "Descrição da tarefa",
    "completed_at": null,
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

## Códigos de Status HTTP

- `200` - OK (sucesso)
- `201` - Created (criado com sucesso)
- `400` - Bad Request (dados inválidos)
- `404` - Not Found (recurso não encontrado)
- `422` - Unprocessable Entity (erro de validação)
- `500` - Internal Server Error (erro interno)

## Códigos de Erro

### Validação de Campos

- `TITLE_REQUIRED` - Título é obrigatório
- `TITLE_INVALID` - Título deve ser string
- `TITLE_MIN_LENGTH` - Título deve ter pelo menos 5 caracteres
- `TITLE_MAX_LENGTH` - Título deve ter no máximo 150 caracteres
- `DESCRIPTION_REQUIRED` - Descrição é obrigatória
- `DESCRIPTION_INVALID` - Descrição deve ser string
- `DESCRIPTION_MAX_LENGTH` - Descrição deve ter no máximo 550 caracteres

### Validação de Arquivo

- `CSV_FILE_REQUIRED` - Arquivo CSV é obrigatório
- `CSV_FILE_INVALID_FORMAT` - Formato de arquivo inválido
- `ERROR_PARSING_CSV_FILE` - Erro ao processar arquivo CSV

### Validação de ID

- `INVALID_ID` - ID deve ser um UUID válido

### Negócio

- `TASK_NOT_FOUND` - Tarefa não encontrada
- `UNKNOWN_ERROR` - Erro interno do servidor

## Exemplos de Uso

### cURL

#### Listar tarefas

```bash
curl -X GET http://localhost:3000/tasks
```

#### Criar tarefa

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Estudar Node.js",
    "description": "Praticar conceitos fundamentais"
  }'
```

#### Atualizar tarefa

```bash
curl -X PUT http://localhost:3000/tasks/uuid-aqui \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Estudar Node.js Avançado",
    "description": "Praticar conceitos avançados"
  }'
```

#### Marcar como concluída

```bash
curl -X PATCH http://localhost:3000/tasks/uuid-aqui/completed
```

#### Deletar tarefa

```bash
curl -X DELETE http://localhost:3000/tasks/uuid-aqui
```

#### Importar CSV

```bash
curl -X POST http://localhost:3000/tasks/create-many \
  -F "file=@tarefas.csv"
```

### JavaScript (Fetch)

#### Listar tarefas

```javascript
const response = await fetch("http://localhost:3000/tasks");
const data = await response.json();
console.log(data);
```

#### Criar tarefa

```javascript
const response = await fetch("http://localhost:3000/tasks", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    title: "Estudar Node.js",
    description: "Praticar conceitos fundamentais"
  })
});
const data = await response.json();
console.log(data);
```

## Estrutura de Dados

### Task Object

```typescript
interface Task {
  id: string; // UUID único
  title: string; // Título (5-150 caracteres)
  description: string; // Descrição (máx 550 caracteres)
  completed_at: Date | null; // Data de conclusão
  created_at: Date; // Data de criação
  updated_at: Date; // Data da última atualização
}
```

### Response Format

```typescript
interface ApiResponse<T> {
  status: "Ok" | "Error";
  details?: T;
  message?: string;
  imported?: number;
}
```

## Limitações

- Armazenamento em arquivo JSON (não escalável para produção)
- Sem autenticação/autorização
- Sem paginação nas listagens
- Processamento síncrono de CSV
- Sem cache

## Melhorias Futuras

- [ ] Migração para banco de dados
- [ ] Implementação de autenticação JWT
- [ ] Paginação e filtros
- [ ] Cache com Redis
- [ ] Logs estruturados
- [ ] Testes automatizados
- [ ] Documentação OpenAPI/Swagger
