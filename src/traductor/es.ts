export const statusTranslation: { [key: string]: string } = {
    pending: "Pendiente",
    onHold: "En Espera",
    inProgress: "En Progreso",
    underReview: "En Revisión",
    completed: "Completado",
};

export const PRIORITY_VALUES = ['low', 'medium', 'high'] as const;

export const priorityTranslation: Record<string, string> = {
    low: "Baja",
    medium: "Media",
    high: "Alta",
};

export const priorityStyles: Record<string, string> = {
    low: "bg-green-100 text-green-700 border-green-300",
    medium: "bg-amber-100 text-amber-700 border-amber-300",
    high: "bg-red-100 text-red-700 border-red-300",
};

export const taskStatusStyles: Record<string, string> = {
    pending: "bg-slate-100 text-slate-600 border-slate-300",
    onHold: "bg-red-100 text-red-600 border-red-300",
    inProgress: "bg-blue-100 text-blue-600 border-blue-300",
    underReview: "bg-amber-100 text-amber-600 border-amber-300",
    completed: "bg-emerald-100 text-emerald-600 border-emerald-300",
};

export const projectStatusTranslation: Record<string, string> = {
    planning: "Planificación",
    active: "Activo",
    onHold: "En Espera",
    completed: "Completado",
    cancelled: "Cancelado",
};

export const projectStatusStyles: Record<string, string> = {
    planning: "bg-purple-100 text-purple-700 border-purple-300",
    active: "bg-blue-100 text-blue-700 border-blue-300",
    onHold: "bg-red-100 text-red-700 border-red-300",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-300",
    cancelled: "bg-gray-100 text-gray-600 border-gray-300",
};
