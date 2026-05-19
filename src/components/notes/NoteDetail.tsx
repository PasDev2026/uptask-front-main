import { useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Note } from "../../types";
import Spineer from "../Spineer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../api/note.api";
import Swal from "sweetalert2";
import { useLocation, useParams } from "react-router-dom";

type NoteDetailProps = {
  note: Note;
};

export default function NoteDetail({ note }: NoteDetailProps) {
  const { data, isLoading } = useAuth();
  const canDelete = useMemo(() => data?._id === note.createdBy._id, [data])
  const params = useParams()
  const location = useLocation()
    const queryParams = new URLSearchParams(location.search)

  const projectId = params.projectId!
    const taskId = queryParams.get('viewTask')!

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Ocurrió un error, verifique los datos!",
      });
    },
    onSuccess: (data) => {
      Swal.fire(data, "Nota eliminada exitosamente :)", "success");
      queryClient.invalidateQueries({queryKey: ['task', taskId]})
    },
  });

  if (isLoading) return <Spineer />;

  return (
    <div className="p-3 flex justify-between items-center">
      <div>
        <p>
          {note.content} por :{" "}
          <span className="font-bold">{note.createdBy.name}</span>
        </p>
        <p className="text-sm text-slate-500">
          {new Date(note.createdAt).toLocaleString()}
        </p>
      </div>
      
      {canDelete && (
        <button
        type="button"
        onClick={() => mutate({projectId, taskId, noteId: note._id})}>
            Eliminar
        </button>
      )}

    </div>
  )
}
