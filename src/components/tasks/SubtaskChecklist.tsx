import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubtasks, createTask, updateStatusTask } from "../../api/task.api";
import { TaskStatus } from "../../types";

type SubtaskChecklistProps = {
  projectId: string;
  taskId: string;
};

export default function SubtaskChecklist({ projectId, taskId }: SubtaskChecklistProps) {
  const [newSubtask, setNewSubtask] = useState("");
  const queryClient = useQueryClient();

  const { data: subtasks = [], isLoading } = useQuery({
    queryKey: ["subtasks", projectId, taskId],
    queryFn: () => getSubtasks(projectId, taskId),
    enabled: !!projectId && !!taskId,
  });

  const { mutate: addSubtask } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      setNewSubtask("");
      queryClient.invalidateQueries({ queryKey: ["subtasks", projectId, taskId] });
      queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projectTasks", projectId] });
    },
  });

  const { mutate: toggleStatus } = useMutation({
    mutationFn: updateStatusTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtasks", projectId, taskId] });
      queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projectTasks", projectId] });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    addSubtask({
      formData: { name: newSubtask.trim(), description: newSubtask.trim() },
      projectId,
      parentTask: taskId,
    });
  };

  const handleToggle = (subtaskId: string, currentStatus: TaskStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    toggleStatus({ projectId, taskId: subtaskId, status: newStatus });
  };

  if (isLoading) return null;

  return (
    <div className="space-y-3">
      <h4 className="font-bold text-2xl text-slate-600">Subtareas</h4>

      {subtasks.length > 0 && (
        <ul className="space-y-2">
          {subtasks.map((sub) => (
            <li key={sub._id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={sub.status === "completed"}
                onChange={() => handleToggle(sub._id, sub.status)}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              <span className={sub.status === "completed" ? "line-through text-slate-400" : "text-slate-700"}>
                {sub.name}
              </span>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          placeholder="Añadir elemento"
          className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
        <button
          type="submit"
          disabled={!newSubtask.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Añadir
        </button>
      </form>
    </div>
  );
}
