import React, {useEffect, useState} from "react";
import {NoteRS} from "../lib/types/NoteRS";
import axios from "axios";
import {
    Button,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "reactstrap";
import {SubmitHandler, useForm} from "react-hook-form";

export default function Note() {
    const [notes, setNotes] = useState<NoteRS[]>([]);
    const [modal, setModal] = useState(false);
    type Input = { title: string, content: string }
    const {register, handleSubmit, formState: {errors}, watch} = useForm<Input>();

    const onSubmit: SubmitHandler<Input> = data => {
        console.log("coming inside");
        try {
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    const toggle = () => setModal(!modal);
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

    const NoteCard = ({note}: { note: NoteRS }) => (
        <div className="card" style={{width: "18rem"}} key={note.id}>
            <div className="card-body">
                <h5 className="card-title">{note.title}</h5>
                <h6 className="card-subtitle mb-2 text-body-secondary">Tags will be added later</h6>
                <p className="card-text">{note.content}</p>
                <a href="#" className="card-link">Edit</a>
                <a href="#" className="card-link">Delete</a>
            </div>
        </div>
    );

    const closeBtn = (
        <button className="btn-close" onClick={toggle} type="button">
        </button>
    );

    const handleCreateNote = () => {
        console.log("button clicked");
    };

    const CreateNote = () => <Modal isOpen={modal} toggle={toggle} className="modal-dialog modal-dialog-centered">
        <ModalHeader toggle={toggle} close={closeBtn}>
            Note Information
        </ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
                <FormGroup>
                    <Label for="title">Title</Label>
                    <Input id="note_name" {...register("title", {required: "Title is required", maxLength: 20})}/>
                    {errors.title?.type === "required" && <FormFeedback>
                        {errors.title?.message}
                    </FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="content">Content</Label>
                    <Input
                        id="note_content"
                        type="textarea"
                        {...register("content", {required: "Content is required"})}
                    />
                    {errors.content && <FormFeedback>
                        {errors.content.message}
                    </FormFeedback>}
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button color="success" type="submit">
                    Create
                </Button>{' '}
                <Button color="danger" onClick={toggle}>
                    Cancel
                </Button>
            </ModalFooter>
        </form>
    </Modal>

    return (
        <div className="container m-4">
            <CreateNote/>
            <Button color="primary" className="mb-4 float-end" onClick={toggle}>
                Create Note
            </Button>
            {notes.map(note => <NoteCard key={note.id} note={note}/>)}
        </div>

    );
}