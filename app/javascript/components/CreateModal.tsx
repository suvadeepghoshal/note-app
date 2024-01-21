import React, { useState } from 'react';
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { NoteRQ } from '../lib/types/NoteRQ';
import axios from 'axios';
import { NoteRS } from '../lib/types/NoteRS';
import { useDispatch } from 'react-redux';
import { fetchNotesService } from '../services/fetchNotesService';
import { AppDispatch } from '../lib/redux/store';

const CreateModal = () => {
  const [modal, setModal] = useState(false);
  const [alertProp, setAlertProp] = useState({
    alertType: '',
    alertMessage: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<NoteRQ>({
    defaultValues: { title: '', content: '', tags: [{ name: 'enter tag' }] },
  });

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

  const dispatch: AppDispatch = useDispatch();

  const onSubmit: SubmitHandler<NoteRQ> = (data) => {
    try {
      const reqObj = {
        note: {
          title: data.title,
          content: data.content,
        },
        tag_names: data.tags.map((tag) => tag.name),
      };
      axios
        .post('api/v1/notes', reqObj, {
          headers: {
            'X-CSRF-Token': document
              .querySelector(`meta[name="csrf-token"]`)
              ?.getAttribute('content'),
          },
        })
        .then((response) => {
          const result: NoteRS = response.data;
          if (result?.type === 'error')
            setAlertProp({
              alertType: 'danger',
              alertMessage: result?.message!,
            });
        })
        .catch((error) => {
          setAlertProp({
            alertType: 'danger',
            alertMessage: error?.message!,
          });
        });
      // TODO: close the modal, show success alert on the modal and when the user close the modal then revalidate the notes page to show the notes that got added
    } catch (error: any) {
      console.error(error);
      setAlertProp({
        alertType: 'danger',
        alertMessage: error,
      });
    }
  };

  const toggle = () => setModal(!modal);

  const closeBtn = (
    <button className="btn-close" onClick={toggle} type="button"></button>
  );

  return (
    <div>
      <Modal isOpen={modal} className="modal-dialog modal-dialog-centered">
        <ModalHeader close={closeBtn}>Note Information</ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
          <ModalBody>
            <div className="mb-3">
              {alertProp.alertType.length > 0 && (
                <Alert color={alertProp.alertType}>
                  {alertProp.alertMessage}
                </Alert>
              )}
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                className="form-control"
                id="title"
                aria-describedby={'titleHelp'}
                {...register('title', {
                  required: { value: true, message: 'Title is required' },
                  maxLength: {
                    value: 20,
                    message: 'Maximum accepted length is 20',
                  },
                })}
              />
              <div id="titleHelp" className="form-text">
                Title has a character limitation of 20
              </div>
              {errors.title && (
                <div className="invalid-feedback" style={{ display: 'block' }}>
                  {errors.title?.message}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">
                Content
              </label>
              <textarea
                className="form-control"
                id="content"
                rows={5}
                {...register('content', {
                  required: { value: true, message: 'Content is required' },
                })}
              />
              {errors.content && (
                <div className="invalid-feedback" style={{ display: 'block' }}>
                  {errors.content?.message}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="tags" className="form-label">
                Tags
              </label>
              {fields.map((field, index) => {
                return (
                  <div key={field.id} className={'row g-3 mb-1'}>
                    <div className={'col-md-6'}>
                      <input
                        className={'form-control'}
                        {...register(`tags.${index}.name`)}
                      />
                    </div>
                    <div className={'col-md-6'}>
                      <div className={'d-grid gap-2 d-md-flex justify-content'}>
                        <button
                          type={'button'}
                          className={'btn btn-primary'}
                          onClick={() =>
                            append([
                              {
                                name: 'enter tag',
                              },
                            ])
                          }
                        >
                          +
                        </button>
                        <button
                          type={'button'}
                          className={'btn btn-danger'}
                          onClick={() => remove(index)}
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
            </div>
          </ModalBody>
          <ModalFooter>
            <button type="submit" className="btn btn-success">
              Create
            </button>{' '}
            <button className="btn btn-danger" onClick={toggle}>
              Cancel
            </button>
          </ModalFooter>
        </form>
      </Modal>
      <Button
        color="primary"
        className="mb-4 float-end"
        onClick={() => {
          dispatch(fetchNotesService());
          toggle();
        }}
      >
        Create Note
      </Button>
    </div>
  );
};
export default CreateModal;
