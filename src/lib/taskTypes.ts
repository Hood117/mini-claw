import type { TaskType } from "@/types/task";

export const TASK_TYPES: Array<{
  id: TaskType;
  label: string;
  icon: string;
  placeholder: string;
}> = [
  {
    id: "summarize",
    label: "Summarize",
    icon: "📄",
    placeholder:
      "Paste text you want summarized. I’ll return a crisp summary with key points.",
  },
  {
    id: "social",
    label: "Social content",
    icon: "📝",
    placeholder:
      "Describe the topic/product. I’ll generate ready-to-post social captions.",
  },
  {
    id: "plan",
    label: "Plan my day",
    icon: "📅",
    placeholder:
      "Tell me your goals/constraints and I’ll create a daily schedule with time blocks.",
  },
];

export function getTaskTypeMeta(taskType: TaskType) {
  return TASK_TYPES.find((t) => t.id === taskType) ?? TASK_TYPES[0];
}

