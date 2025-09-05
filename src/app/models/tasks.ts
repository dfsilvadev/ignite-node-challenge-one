type Id = string;

interface Task {
  id: Id;
  title: string;
  description: string;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

interface Database {
  tasks: Task[];
}

const DATABASE_TABLE = "tasks" as const;
type DatabaseTable = typeof DATABASE_TABLE;

interface CreateTaskParams {
  title: string;
  description: string;
}

interface UpdateTaskParams {
  title?: string;
  description?: string;
}

interface ApiResponse<T = any> {
  status: "Ok" | "Error";
  details?: T;
  message?: string;
  imported?: number;
}

export {
  ApiResponse,
  CreateTaskParams,
  Database,
  DATABASE_TABLE,
  DatabaseTable,
  Id,
  Task,
  UpdateTaskParams
};
