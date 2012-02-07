class CreateUserInfos < ActiveRecord::Migration
  def self.up
    create_table :user_infos do |t|
      t.integer :user_id
      t.timestamp :birthday
      t.string :constellation
      t.string :profession
      t.string :province
      t.string :city
      t.string :zone_message
      t.text :signature
      t.timestamps
    end

    UserInfo.create(:user_id=>1, :birthday=>"1990-10-18", :constellation=>"射手座", :profession=>"程序员",
                    :province=>"湖北", :city=>"荆州", :zone_message=>"生前何必久睡，死后自会长眠！",
                    :signature=>"我是一个刚入职的菜鸟,正在学习ruby on rails.");
  end

  def self.down
    drop_table :user_infos
  end
end
