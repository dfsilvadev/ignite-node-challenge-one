import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import {
  CreateTaskParams,
  Database,
  DatabaseTable,
  Id,
  Task,
  UpdateTaskParams
} from "../models/tasks";

const databasePath = path.resolve("src/database/db.json");
class TaskRepository {
  #database: Database = { tasks: [] };

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => this.#persist());
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  list(table: DatabaseTable) {
    const data = this.#database[table] ?? [];
    return data;
  }

  create(table: DatabaseTable, { title, description }: CreateTaskParams) {
    const newTask: Task = {
      id: randomUUID(),
      title,
      description,
      created_at: new Date(),
      updated_at: new Date(),
      completed_at: null
    };

    if (!Array.isArray(this.#database[table])) {
      return (this.#database[table] = [newTask]);
    }

    this.#database[table].push(newTask);
    this.#persist();

    return newTask;
  }

  update(
    table: DatabaseTable,
    id: string,
    { title, description }: UpdateTaskParams
  ) {
    const currentTask = this.#database[table].find((row) => row.id === id);

    if (!currentTask) return null;

    if (title || description) {
      currentTask.updated_at = new Date();

      if (title) currentTask.title = title;
      if (description) currentTask.description = description;
    }

    this.#persist();
    return currentTask;
  }

  asCompleted(table: DatabaseTable, id: Id) {
    const currentTask = this.#database[table].find((row) => row.id === id);

    if (!currentTask) return null;

    currentTask.completed_at = currentTask.completed_at ? null : new Date();

    return currentTask;
  }

  remove(table: DatabaseTable, id: Id) {
    const currentTaskIndex = this.#database[table].findIndex(
      (row) => row.id === id
    );

    if (currentTaskIndex <= -1) return null;

    const deletedTask = this.#database[table].splice(currentTaskIndex, 1);

    this.#persist();

    return deletedTask;
  }
}

export default new TaskRepository();
