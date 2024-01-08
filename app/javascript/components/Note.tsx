import React, {useEffect, useState} from "react";
import {NoteRS} from "../lib/types/NoteRS";
import axios from "axios";
import {
    Button, CardColumns,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader, Row
} from "reactstrap";
import {SubmitHandler, useForm} from "react-hook-form";
import {NoteRQ} from "../lib/types/NoteRQ";
import {Tag} from "../lib/types/Tag";
import {Link} from "react-router-dom";

export default function Note() {
    const [notes, setNotes] = useState<NoteRS[]>([]);
    const [modal, setModal] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm<NoteRQ>({
        defaultValues: {title: "", content: ""}
    });
    const [hover, setHover] = useState(false);

    const onSubmit: SubmitHandler<NoteRQ> = data => {
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

    const toggleHover = () => setHover(!hover);

    const style: { backgroundColor: string } | {
        color: string
    } = hover ? {backgroundColor: "rgb(25, 135, 84) !important"} : {color: "initial"};

    const NoteCard = ({note}: { note: NoteRS }) => (
        <div className="card" style={{width: "18rem"}} key={note.id}>
            <div className="card-body">
                <h5 className="card-title">{note.title}</h5>
                <div className={"row"}>
                    {note.tags && note.tags.map((tag: Tag) =>
                        <h6 className="card-subtitle mb-2 text-body-secondary col-2" key={tag.id}
                            onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
                            <Link
                                className="badge rounded-pill text-bg-secondary text-decoration-none"
                                style={style}
                                to={`/tag/${tag.id}`}>{tag.name}</Link>
                        </h6>
                    )}
                </div>
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

    const CreateNote = () => <Modal isOpen={modal} className="modal-dialog modal-dialog-centered">
        <ModalHeader close={closeBtn}>
            Note Information
        </ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
            <ModalBody>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input className="form-control" id="title" aria-describedby={"titleHelp"}
                           {...register("title", {
                               required: {value: true, message: "Title is required"},
                               maxLength: {value: 20, message: "Maximum accepted length is 20"}
                           })}/>
                    <div id="titleHelp" className="form-text">Title has a character limitation of 20</div>
                    {errors.title &&
                        <div className="invalid-feedback" style={{display: "block"}}>{errors.title?.message}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <textarea className="form-control" id="content" rows={5} {...register("content", {
                        required: {value: true, message: "Content is required"},
                    })}/>
                    {errors.content &&
                        <div className="invalid-feedback"
                             style={{display: "block"}}>{errors.content?.message}</div>}
                </div>

            </ModalBody>
            <ModalFooter>
                <button type="submit" className="btn btn-success">Create</button>
                {' '}
                <button className="btn btn-danger" onClick={toggle}>Cancel</button>
            </ModalFooter>
        </form>
    </Modal>

    return (
        <div className="container m-4">
            <CreateNote/>
            <Button color="primary" className="mb-4 float-end" onClick={toggle}>
                Create Note
            </Button>
            <Row>
                {notes.map(note =>
                    <CardColumns className={"m-2"} key={note.id}>
                        <NoteCard note={note}/>
                    </CardColumns>
                )}
            </Row>
        </div>

    );
}