# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20111027015216) do

  create_table "article_types", :force => true do |t|
    t.string   "name",       :limit => 100, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "articles", :force => true do |t|
    t.string   "title",                          :null => false
    t.integer  "author_id",                      :null => false
    t.text     "content",                        :null => false
    t.integer  "article_type_id",                :null => false
    t.integer  "status",          :default => 1
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "comments", :force => true do |t|
    t.integer  "article_id",                                     :null => false
    t.integer  "parent_id"
    t.text     "content"
    t.string   "author",     :limit => 50, :default => "游客"
    t.string   "type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "image_types", :force => true do |t|
    t.string   "name",                          :null => false
    t.integer  "permission",     :default => 0
    t.string   "question"
    t.string   "answer"
    t.string   "title_image_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "images", :force => true do |t|
    t.integer  "image_type_id"
    t.string   "filename",                    :default => "", :null => false
    t.string   "disk_filename",               :default => "", :null => false
    t.integer  "filesize",                    :default => 0,  :null => false
    t.string   "content_type",  :limit => 60, :default => ""
    t.string   "description"
    t.integer  "author_id",                   :default => 0,  :null => false
    t.datetime "created_on"
  end

  create_table "messages", :force => true do |t|
    t.integer  "parent_id"
    t.text     "content"
    t.string   "author",     :limit => 50, :default => "游客"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "user_infos", :force => true do |t|
    t.integer  "user_id"
    t.datetime "birthday"
    t.string   "constellation"
    t.string   "profession"
    t.string   "province"
    t.string   "city"
    t.string   "zone_message"
    t.text     "signature"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "login",           :limit => 80,                 :null => false
    t.string   "name",            :limit => 100
    t.string   "password",                                      :null => false
    t.string   "email"
    t.integer  "sex",                            :default => 0
    t.integer  "admin",                          :default => 0
    t.integer  "status"
    t.text     "pwd_question"
    t.text     "pwd_answer"
    t.string   "salt",                                          :null => false
    t.integer  "header_image_id"
    t.datetime "last_login_time"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
