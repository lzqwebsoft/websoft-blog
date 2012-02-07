class CreateMessages < ActiveRecord::Migration
  def self.up
    create_table :messages do |t|
      t.integer :parent_id
      t.text :content
      t.string :author, :limit=>50, :default=>'游客'
      t.timestamps
    end
  end

  def self.down
    drop_table :messages
  end
end
