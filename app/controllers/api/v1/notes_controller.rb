class Api::V1::NotesController < ApplicationController
  def index
    @notes = Note.all
    render json: @notes.as_json(include: :tags), status: :ok
  end

  def create
    existing_note = Note.find_by(title: note_params[:title])
    if existing_note
      render json: { message: "Note with the same title already exists", type: "error" }, status:
        :ok
    else
      note = Note.new(note_params)
      tag_names = params[:tag_names] || []
      tags = tag_names.map { |tag_name| Tag.find_or_create_by(name: tag_name) }
      note.tags << tags # appending tags
      if note.save
        render json: note.as_json(include: :tags), status:
          :created
      else
        render json: note.errors
        :unprocessable_entity
      end
    end
  end

  def destroy
    deleted_note = Note.destroy(params[:id])
    render json: { type: 'info', message: 'Note is successfully deleted', note: deleted_note }, status: :ok
  rescue StandardError => standard_error
    render json: {
      type: 'error',
      message: 'Failed to delete the note',
      errors: standard_error.to_s
    }, status: :unprocessable_entity
  end

  def update
    current_note = Note.find_by(id: params[:id])
    if current_note == nil
      raise ActiveRecord::RecordNotFound.new("Note with ID #{params[:id]} not found")
    end
    tag_names = params[:tag_names] || []
    tags = tag_names.map { |tag_name| Tag.find_or_create_by(name: tag_name) }
    current_note.tags = tags
    updated_note = Note.update(note_params.except(:tag_names))
    if updated_note
      render json: {type: 'info', message: 'Note is successfully updated', note: updated_note.as_json(include: :tags)}, status: :ok
    else
      render json: {type: 'error', message: 'Failed to update the note', errors: current_note.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound => record_not_found
    render json: {
      type: 'error',
      message: 'Failed to update the note',
      errors: record_not_found.message
    }, status: :not_found
  rescue StandardError => standard_error
    render json: {
      type: 'error',
      message: 'Failed to update the note',
      errors: standard_error.to_s
    }, status: :unprocessable_entity
  end

  private

  def note_params
    params.require(:note).permit(:title, :content)
  end
end
