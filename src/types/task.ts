export type TaskType = "summarize" | "social" | "plan";

export type TaskHistoryItem = {
  id: string;
  taskType: TaskType;
  input: string;
  output: string;
  createdAt: number;
};

