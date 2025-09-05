# Guia de Uso do Tipo ApiResponse<T>

## O que é ApiResponse<T>?

`ApiResponse<T>` é um tipo genérico TypeScript que padroniza todas as respostas da sua API. Ele garante consistência e type safety em todas as comunicações entre cliente e servidor.

## Definição do Tipo

```typescript
interface ApiResponse<T = any> {
  status: "Ok" | "Error";
  details?: T; // Dados da resposta (opcional)
  message?: string; // Mensagem de erro ou sucesso (opcional)
  imported?: number; // Número de itens importados (opcional)
}
```

## Como Usar na Prática

### 1. **Respostas de Sucesso com Dados**

```typescript
// Para uma única tarefa
const taskResponse: ApiResponse<Task> = {
  status: "Ok",
  details: {
    id: "123",
    title: "Minha tarefa",
    description: "Descrição da tarefa",
    completed_at: null,
    created_at: new Date(),
    updated_at: new Date()
  }
};

// Para múltiplas tarefas
const tasksResponse: ApiResponse<Task[]> = {
  status: "Ok",
  details: [
    {
      /* tarefa 1 */
    },
    {
      /* tarefa 2 */
    }
  ]
};
```

### 2. **Respostas de Erro**

```typescript
const errorResponse: ApiResponse = {
  status: "Error",
  message: "TASK_NOT_FOUND"
};
```

### 3. **Respostas de Sucesso com Mensagem**

```typescript
const successWithMessage: ApiResponse<Task> = {
  status: "OK",
  message: "TASK_CREATED_SUCCESSFULLY",
  details: {
    /* tarefa criada */
  }
};
```

### 4. **Respostas de Importação**

```typescript
const importResponse: ApiResponse = {
  status: "OK",
  message: "IMPORTED_SUCCESSFULLY",
  imported: 5
};
```

## Implementação no Controller

### Funções Auxiliares Criadas

```typescript
class TaskController {
  // Para respostas de sucesso com dados
  private sendSuccess<T>(res: Response, statusCode: number, data: T): void {
    const response: ApiResponse<T> = {
      status: "Ok",
      details: data
    };
    res.status(statusCode).json(response);
  }

  // Para respostas de erro
  private sendError(res: Response, statusCode: number, message: string): void {
    const response: ApiResponse = {
      status: "Error",
      message
    };
    res.status(statusCode).json(response);
  }

  // Para respostas de sucesso com mensagem
  private sendSuccessWithMessage<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T
  ): void {
    const response: ApiResponse<T> = {
      status: "OK",
      message,
      ...(data && { details: data })
    };
    res.status(statusCode).json(response);
  }

  // Para respostas de importação
  private sendImportSuccess(
    res: Response,
    statusCode: number,
    message: string,
    imported: number
  ): void {
    const response: ApiResponse = {
      status: "OK",
      message,
      imported
    };
    res.status(statusCode).json(response);
  }
}
```

### Uso nos Métodos

```typescript
// Listar tarefas
listTasks(_req: Request, res: Response) {
  try {
    const tasks = taskRepository.list(DATABASE_TABLE);
    this.sendSuccess<Task[]>(res, 200, tasks);
  } catch (err) {
    this.sendError(res, 500, err instanceof Error ? err.message : "UNKNOWN_ERROR");
  }
}

// Criar tarefa
createTask(req: Request, res: Response) {
  try {
    const createdTask = taskRepository.create(DATABASE_TABLE, req.body);
    this.sendSuccess<Task>(res, 201, createdTask as Task);
  } catch (err) {
    this.sendError(res, 500, err instanceof Error ? err.message : "UNKNOWN_ERROR");
  }
}

// Atualizar tarefa
updateTask(req: Request, res: Response) {
  try {
    const updatedTask = taskRepository.update(DATABASE_TABLE, req.params.id, req.body);

    if (!updatedTask) {
      return this.sendError(res, 404, "TASK_NOT_FOUND");
    }

    this.sendSuccess<Task>(res, 200, updatedTask);
  } catch (err) {
    this.sendError(res, 500, err instanceof Error ? err.message : "UNKNOWN_ERROR");
  }
}
```

## Vantagens do ApiResponse<T>

### 1. **Type Safety**

```typescript
// TypeScript sabe que details é do tipo Task[]
const response: ApiResponse<Task[]> = await fetch("/tasks").then((r) =>
  r.json()
);

if (response.status === "Ok" && response.details) {
  // response.details é tipado como Task[]
  response.details.forEach((task) => {
    console.log(task.title); // ✅ TypeScript sabe que task tem title
  });
}
```

### 2. **Consistência**

Todas as respostas seguem o mesmo padrão, facilitando o desenvolvimento do frontend.

### 3. **IntelliSense**

O editor oferece autocomplete completo para as propriedades da resposta.

### 4. **Validação em Tempo de Compilação**

```typescript
// ❌ Erro: 'status' deve ser "Ok", "OK" ou "Error"
const invalidResponse: ApiResponse = {
  status: "Success", // Erro!
  details: []
};
```

## Exemplos de Uso no Frontend

### JavaScript/TypeScript

```typescript
async function fetchTasks(): Promise<Task[]> {
  const response = await fetch("/tasks");
  const data: ApiResponse<Task[]> = await response.json();

  if (data.status === "Ok" && data.details) {
    return data.details;
  } else {
    throw new Error(data.message || "Erro desconhecido");
  }
}

async function createTask(taskData: {
  title: string;
  description: string;
}): Promise<Task> {
  const response = await fetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData)
  });

  const data: ApiResponse<Task> = await response.json();

  if (data.status === "Ok" && data.details) {
    return data.details;
  } else {
    throw new Error(data.message || "Erro ao criar tarefa");
  }
}
```

### React Hook Example

```typescript
function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/tasks");
      const data: ApiResponse<Task[]> = await response.json();

      if (data.status === "Ok" && data.details) {
        setTasks(data.details);
      } else {
        setError(data.message || "Erro ao carregar tarefas");
      }
    } catch (err) {
      setError("Erro de rede");
    } finally {
      setLoading(false);
    }
  };

  return { tasks, loading, error, fetchTasks };
}
```

## Padrões de Uso Recomendados

### 1. **Sempre use o tipo genérico quando possível**

```typescript
// ✅ Bom
const response: ApiResponse<Task[]> = await api.getTasks();

// ❌ Evite
const response: ApiResponse = await api.getTasks();
```

### 2. **Verifique o status antes de acessar details**

```typescript
// ✅ Bom
if (response.status === "Ok" && response.details) {
  // Usar response.details
}

// ❌ Evite
const tasks = response.details; // Pode ser undefined
```

### 3. **Use as funções auxiliares no controller**

```typescript
// ✅ Bom
this.sendSuccess<Task[]>(res, 200, tasks);

// ❌ Evite
res.status(200).json({ status: "Ok", details: tasks });
```

## Migração de Código Existente

Se você tem código que não usa `ApiResponse<T>`, pode migrar gradualmente:

1. **Adicione o tipo às interfaces existentes**
2. **Use as funções auxiliares nos novos métodos**
3. **Migre os métodos antigos um por vez**
4. **Atualize o frontend para usar o novo formato**

## Conclusão

O tipo `ApiResponse<T>` torna sua API mais robusta, consistente e fácil de usar. Ele garante que todas as respostas sigam o mesmo padrão e oferece type safety completo em TypeScript.
