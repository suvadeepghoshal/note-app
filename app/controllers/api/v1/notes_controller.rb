class Api::V1::NotesController < ApplicationController
  def index
    @notes = Note.all
    render json: @notes, status: :ok
  end

  def create
    existing_note = Note.find_by(title: note_params[:title])
    if existing_note
      render json: { message: "Note with the same title already exists", type: "error" }, status:
        :ok
    else
      note = Note.new(note_params)
      if note.save
        render json: note, status:
          :created
      else
        render json: note.errors
        :unprocessable_entity
      end
    end
  end

  private

  def note_params
    params.require(:note).permit(:title, :content)
  end
end
