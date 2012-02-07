class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users, :force => true do |t|
      t.string :login, :limit => 80, :null => false
      t.string :name, :limit=>100
      t.string :password, :null=>false
      t.string :email
      t.integer :sex, :default=> 0
      t.integer :admin, :default=> 0
      t.integer :status, :defualt=> 0
      t.text :pwd_question
      t.text :pwd_answer
      t.string :salt, :null=>false
      t.integer :header_image_id
      t.timestamp :last_login_time
      t.timestamps
    end

    User.create({:login=>"websoft", :name=>"一迹飘痕", :password=>"932ab9658ccd1dd9d0ea0ee7872892a245c3d0f3",
     :email=>"example@email.com", :sex=>1, :admin=>1, :status=>1, :pwd_question=>"", :salt=>"4b5ceadc5d44eb06cf971a03d87e8c48"})
  end

  def self.down
    drop_table :users
  end
end
