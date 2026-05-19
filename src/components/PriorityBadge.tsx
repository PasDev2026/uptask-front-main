import { TaskPriority } from "../types";
import { priorityTranslation, priorityStyles } from "../traductor/es";

type PriorityBadgeProps = {
  priority: TaskPriority;
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const styleKey = priority ?? ""
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityStyles[styleKey] || "bg-gray-100 text-gray-600 border-gray-300"}`}
    >
      {priority ? priorityTranslation[priority] : ""}
    </span>
  );
}
