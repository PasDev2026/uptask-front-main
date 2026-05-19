import { Task } from "../../types";
import AddNotesForm from "./AddNotesForm";
import NoteDetail from "./NoteDetail";

type NotesPanelProps = {
    notes: Task['notes']
}

export default function NotesPanel( {notes} : NotesPanelProps ) {
    console.log(notes);
    
  return (
    <div>
      <AddNotesForm />

      <div className="divide-y divide-gray-100 mt-6">
            {notes.length ? (
                <>
                    <h4 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">Notas</h4>
                        {notes.map(note => <NoteDetail key={note._id} note={note} />)
                            
                        }
                </> 
            ) : <p className="text-gray-500 text-sm pt-3"> No hay notas</p>}
      </div>


    </div>
  )
}
