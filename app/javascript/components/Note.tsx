import React, { useEffect, useState } from 'react';
import { NoteRS } from '../lib/types/NoteRS';
import axios from 'axios';
import { CardColumns, Row } from 'reactstrap';
import { Tag } from '../lib/types/Tag';
import { Link } from 'react-router-dom';
import CreateModal from './CreateModal';

export default function Note() {
  const [notes, setNotes] = useState<NoteRS[]>([]);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    console.log('Note component mounted');
    const fetchNotes = async () => {
      try {
        const response = await axios.get('/api/v1/notes');
        return response.status === 200 ? response.data : [];
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotes()
      .then((data) => setNotes(data))
      .catch((error) => console.log(error));
    return () => {
      console.log('Note component unmounted');
    };
  }, []);

  const toggleHover = () => setHover(!hover);

  const style:
    | { backgroundColor: string }
    | {
        color: string;
      } = hover
    ? { backgroundColor: 'rgb(25, 135, 84) !important' }
    : { color: 'initial' };

  const NoteCard = ({ note }: { note: NoteRS }) => (
    <div className="card" style={{ width: '18rem' }} key={note.id}>
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
        <a href="#" className="card-link">
          Edit
        </a>
        <a href="#" className="card-link">
          Delete
        </a>
      </div>
    </div>
  );

  return (
    <div className="container m-4">
      <CreateModal />
      <Row>
        {notes.map((note) => (
          <CardColumns className={'m-2'} key={note.id}>
            <NoteCard note={note} />
          </CardColumns>
        ))}
      </Row>
    </div>
  );
}
