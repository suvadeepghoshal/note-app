class CreateNotes < ActiveRecord::Migration[7.1]
  def change
    create_table :notes do |t|
      t.string :title
      t.text :content

      t.timestamps
    end
    add_index :notes, :id, unique: true, name: 'id'
  end
end
