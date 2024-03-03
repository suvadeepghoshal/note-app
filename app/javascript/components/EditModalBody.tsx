import React, { useContext, useState } from 'react';
import { NoteToBeEditedContext } from '../lib/contexts/noteToBeEditedContext';
import { Button, Form, Modal } from 'react-bootstrap';
import { NoteRQ } from '../lib/types/NoteRQ';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { AppDispatch, RootState } from '../lib/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { toggleModalService } from '../services/toggleModalService';
import { CommonRS } from '../lib/types/CommonRS';
import { editNoteService } from '../services/editNoteService';
import { fetchNotesService } from '../services/fetchNotesService';
import { Alert } from 'reactstrap';

const EditModalBody = () => {
  console.log('EditModalBody component mounted');
  const noteToBeEdited: NoteRQ = useContext(NoteToBeEditedContext);

  const [currNote, setCurrNote]: [
    NoteRQ,
    (value: ((prevState: NoteRQ) => NoteRQ) | NoteRQ) => void,
  ] = useState<NoteRQ>(noteToBeEdited);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<NoteRQ>({
    defaultValues: {
      title: currNote.title,
      content: currNote.content,
      tags: currNote.tags,
    },
  });

  const [alertProp, setAlertProp] = useState({
    alertType: '',
    alertMessage: '',
  });

  const dispatch: AppDispatch = useDispatch();

  const modalConfig = useSelector((state: RootState) => state.modal);

  const onSubmit: SubmitHandler<NoteRQ> = async (note: NoteRQ) => {
    try {
      note.id = currNote.id;
      const result: CommonRS = await dispatch(editNoteService(note));
      if (result.type === undefined && result.message) {
        setAlertProp({
          alertType: 'danger',
          alertMessage: result?.message,
        });
      } else if (result.message) {
        setAlertProp({
          alertType: 'success',
          alertMessage: result?.message,
        });
        // auto close after success
        setTimeout(() => {
          reset();
          dispatch(
            toggleModalService({ name: 'edit-note-modal', visible: false })
          );
          dispatch(fetchNotesService());
        }, 2000);
      }
    } catch (error: any) {
      if (error.message.length) {
        setAlertProp({
          alertType: 'danger',
          alertMessage:
            typeof error == 'string'
              ? error
              : 'Unable to edit the current note.',
        });
      }
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
    rules: {
      required: {
        value: true,
        message: 'At least a tag is required',
      },
    },
  });

  const handleClose = () => {
    reset();

    dispatch(toggleModalService({ name: 'edit-note-modal', visible: false }));
    dispatch(fetchNotesService());
  };

  return (
    <div>
      <Modal show={modalConfig?.visible} onHide={handleClose}>
        <Form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
          <Modal.Header closeButton>
            <Modal.Title>Editing note {currNote.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {alertProp.alertType.length > 0 && (
              <Alert color={alertProp.alertType}>
                {alertProp.alertMessage}
              </Alert>
            )}
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                {...register('title', {
                  required: { value: true, message: 'Title is required' },
                  maxLength: {
                    value: 20,
                    message: 'Maximum accepted length is 20',
                  },
                  onChange: (e) =>
                    setCurrNote((prevNote: NoteRQ) => ({
                      ...prevNote,
                      title: e.target.value,
                    })),
                  value: currNote?.title,
                })}
              />
            </Form.Group>
            {errors.title && (
              <div className="invalid-feedback" style={{ display: 'block' }}>
                {errors.title?.message}
              </div>
            )}
            <Form.Group className="mb-3" controlId="content">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register('content', {
                  required: { value: true, message: 'Content is required' },
                  onChange: (e) =>
                    setCurrNote((prevNote: NoteRQ) => ({
                      ...prevNote,
                      content: e.target.value,
                    })),
                  value: currNote?.content,
                })}
              />
            </Form.Group>
            {errors.content && (
              <div className="invalid-feedback" style={{ display: 'block' }}>
                {errors.content?.message}
              </div>
            )}
            {fields.map((field, index) => {
              return (
                <div key={field.id} className={'row g-3 mb-1'}>
                  <div className={'col-md-6'}>
                    <input
                      className={'form-control'}
                      {...register(`tags.${index}.name`, {
                        value: currNote?.tags[index]?.name || 'enter tag',
                      })}
                    />
                  </div>
                  <div className={'col-md-6'}>
                    <div className={'d-grid gap-2 d-md-flex justify-content'}>
                      <button
                        type={'button'}
                        className={'btn btn-primary'}
                        onClick={() => {
                          append([
                            {
                              name: 'enter tag',
                            },
                          ]);
                        }}
                      >
                        +
                      </button>
                      <button
                        type={'button'}
                        className={'btn btn-danger'}
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        -
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            <div id="tagsHelp" className="form-text">
              Click +/- to add/remove more relevant tags
            </div>
            <div className="invalid-feedback" style={{ display: 'block' }}>
              {errors?.tags?.message}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" type={'submit'}>
              Edit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default EditModalBody;
