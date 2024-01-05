import React, {useEffect} from "react";
import {NoteRS} from "../lib/types/NoteRS";
import axios from "axios";

export default function Note() {
    const [notes, setNotes] = React.useState<NoteRS[]>([]);
    useEffect(() => {
        console.log("Note component mounted");
        const fetchNotes = async () => {
            try {
                const response = await axios.get("/api/v1/notes");
                return response.status === 200 ? response.data : [];
            } catch (error) {
                console.log(error);
            }
        };
        fetchNotes().then((data) => setNotes(data)).catch((error) => console.log(error));
        return () => {
            console.log("Note component unmounted");
        }
    }, []);
    return (
        <div className="container m-4">
            {notes.map(note => (
                <div className="card" style={{width: "18rem"}} key={note.id}>
                    <div className="card-body">
                        <h5 className="card-title">{note.title}</h5>
                        <h6 className="card-subtitle mb-2 text-body-secondary">Tags will be added later</h6>
                        <p className="card-text">{note.content}</p>
                        <a href="#" className="card-link">Edit</a>
                        <a href="#" className="card-link">Delete</a>
                    </div>
                </div>
            ))}
        </div>

    );
}