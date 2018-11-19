# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

# logger.info("The user record is: %r" % auth.user)

import datetime

def get_user_email():
    return None if auth.user is None else auth.user.email

def get_current_time():
    return datetime.datetime.utcnow()

db.define_table('project_details',
                Field('num_of_user_stories'),
                Field('num_of_sprints'),
                Field('length_of_sprints'),
                Field('sprint_start_date')
                )

db.define_table('user_stories',
                Field('user_story_num'),
                Field('user_story_points')
                )

db.define_table('work_completed',
                Field('sprint_number'),
                Field('story_points')             
                )

