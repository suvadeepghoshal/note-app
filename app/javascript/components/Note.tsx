import React, { useEffect, useState } from 'react';
import { NoteRQ } from '../lib/types/NoteRQ';
import { AppDispatch, RootState } from '../lib/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotesService } from '../services/fetchNotesService';
import { NoteRS } from '../lib/types/NoteRS';
import { CommonRS } from '../lib/types/CommonRS';
import { deleteNoteService } from '../services/deleteNoteService';
import { editNoteService } from '../services/editNoteService';
import { Tag } from '../lib/types/Tag';
import { ToastContainer } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import CreateModal from './CreateModal';
import { NoteToBeEditedContext } from '../lib/contexts/noteToBeEditedContext';
import { Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import EditModalBody from './EditModalBody';
import { toggleModalService } from '../services/toggleModalService';

export default function Note() {
  const [hover, setHover] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [currNote, setCurrNote] = useState<NoteRQ>({
    id: 0,
    title: '',
    content: '',
    tags: [],
  });

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    console.log('Note component mounted');
    dispatch(fetchNotesService());
    return () => {
      console.log('Note component unmounted');
    };
  }, []);

  const toggleHover = () => setHover(!hover); // TODO: the tags hover is still not working.

  const notes: NoteRS[] = useSelector((state: RootState) => state.notes)!;

  const modalConfig = useSelector((state: RootState) => state.modal);

  const style:
    | { backgroundColor: string }
    | {
        color: string;
      } = hover
    ? { backgroundColor: 'rgb(25, 135, 84) !important' }
    : { color: 'initial' };

  const handleDeleteClick = async (id: number) => {
    const result: CommonRS = await dispatch(deleteNoteService(id));
    if (result.type === 'info') dispatch(fetchNotesService());
    else {
      if (result?.message?.length) {
        setMessage(result.message);
        setShowToast(true);
      }
      setTimeout(() => {
        setShowToast((prevState) => !prevState);
      }, 2000);
    }
  };

  const handleEditClick = async (note: NoteRQ) => {
    try {
      const result: CommonRS = await dispatch(editNoteService(note));
      console.log(result);
      if (result.type === undefined && result.message) {
        setMessage(result.message);
        setShowToast(true);
        setTimeout(() => {
          setShowToast((prevState) => !prevState);
        }, 2000);
      }
    } catch (error: any) {
      if (error.message.length) {
        setMessage(error.message);
        setShowToast(true);
      }
      setTimeout(() => {
        setShowToast((prevState) => !prevState);
      }, 2000);
    }
  };

  const showEditModal = (note: NoteRQ) => {
    setCurrNote(note);
    dispatch(toggleModalService({ name: 'edit-note-modal', visible: true }));
  };

  const NoteCard = ({ note }: { note: NoteRS }) => (
    <div className="col">
      <div
        className="card "
        style={{ width: '18rem', height: '15rem' }}
        key={note.id}
      >
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <div className={'row'}>
            {note.tags &&
              note.tags.map((tag: Tag) => (
                <h6
                  className="card-subtitle mb-2 text-body-secondary col-2"
                  key={tag.id}
                  onMouseEnter={toggleHover}
                  onMouseLeave={toggleHover}
                >
                  <Link
                    className="badge rounded-pill text-bg-secondary text-decoration-none"
                    style={style}
                    to={`/tag/${tag.id}`}
                  >
                    {tag.name}
                  </Link>
                </h6>
              ))}
          </div>
          <p className="card-text">{note.content}</p>
          <button
            type={'button'}
            className="btn btn-dark m-1"
            onClick={() => showEditModal(note)}
          >
            Edit
          </button>
          <button
            type={'button'}
            className="btn btn-danger m-1"
            onClick={() => handleDeleteClick(note.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container overflow-hidden m-4">
      <ToastContainer
        position={'top-center'}
        className="p-3"
        style={{ zIndex: 1 }}
      >
        <Toast show={showToast} onClose={() => setShowToast(false)}>
          <Toast.Header>
            <strong className="me-auto">Information!</strong>
          </Toast.Header>
          <Toast.Body>{message}</Toast.Body>
        </Toast>
      </ToastContainer>
      <CreateModal />
      {modalConfig?.visible && (
        <NoteToBeEditedContext.Provider value={currNote}>
          <EditModalBody />
        </NoteToBeEditedContext.Provider>
      )}
      <Row className={'g-3'}>
        {notes.map(
          (note: NoteRS) =>
            note.id && (
              <NoteCard note={note} key={note.id ? note.id : 'default-key'} />
            )
        )}
      </Row>
    </div>
  );
}
