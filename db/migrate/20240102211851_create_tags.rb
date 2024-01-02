class CreateTags < ActiveRecord::Migration[7.1]
  def change
    create_table :tags do |t|
      t.string :name

      t.timestamps
    end
    add_index :tags, :id, unique: true, name: 'tag_id'
  end
end
