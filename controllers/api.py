def set_project_details():
    num_user_stories = int(request.vars.num_of_user_stories)
    num_sprints = int(request.vars.num_of_sprints)
    length_of_sprint = int(request.vars.length_of_sprint)
    sprint_start_date= (request.vars.sprint_start_date)


    db.project_details.update_or_insert(
        num_of_user_stories = num_user_stories,
        num_of_sprints = num_sprints,
        length_of_sprints = length_of_sprint,
        sprint_start_date = sprint_start_date
        # sprints_start_date = sprint_start_date
    )

    # We return the id of the new post, so we can insert it along all the others.
    return sprint_start_date


def get_story_points():
    rows = db(db.user_stories).select(orderby=db.user_stories.user_story_num)
    size = len(rows)
    story_points_list = [None] * size

    for x in range (1, size+1):
        story_points_list[x-1] = [int(rows[x-1].user_story_num), rows[x-1].user_story_points]
    return response.json(dict(answer = story_points_list))

def get_project_details():
    rows = db(db.project_details).select()
    num_of_sprints = rows[0].num_of_sprints
    # num_of_sprints = rows.project_details.num_of_sprints
    return num_of_sprints

def set_work_done_data():
    sprint_num = int(request.vars.sprint_num)
    story_points = int(request.vars.story_points)
    user_email = request.vars.email

    # Check to see if we're updating new or old values
    rows = db((db.work_completed.email == user_email) & (db.work_completed.sprint_number == sprint_num)).select()

    if (len(rows) == 0):
        db.work_completed.update_or_insert(
            sprint_number = sprint_num,
            story_points = story_points,
            email = user_email
        )
    else:    
    # If user story email and number are a match, update the new story points
        db.work_completed.update_or_insert(
            (db.work_completed.email == user_email) & (db.work_completed.sprint_number == sprint_num),
            story_points = story_points,
        )


def set_user_story_points():
    story_num = int(request.vars.story_num)
    sprint_num = int(request.vars.sprint_num)
    story_points = int(request.vars.story_points)
    story_email = request.vars.story_email

    # Check to see if we're updating new or old values
    rows = db((db.user_stories.user_story_email == story_email) 
    & (db.user_stories.user_story_num == story_num)
    & (db.user_stories.user_sprint_num == sprint_num)
    ).select()

    if (len(rows) == 0):
        db.user_stories.update_or_insert(
            user_story_num = story_num,
            user_story_points = story_points,
            user_story_email = story_email,
            user_sprint_num = sprint_num
        )
    else:    
    # If user story email and number are a match, update the new story points
        db.user_stories.update_or_insert(
            (db.user_stories.user_story_email == story_email) & (db.user_stories.user_story_num == story_num) & (db.user_stories.user_sprint_num == sprint_num),
            user_story_points = story_points
        )

    return story_email


def get_work_done_data():
    rows = db(db.work_completed).select(orderby=db.work_completed.sprint_number)
    size = len(rows)
    work_done_list = [None] * size

    for x in range (1, size+1):
        work_done_list[x-1] = [rows[x-1].sprint_number, rows[x-1].story_points]
    return response.json(dict(answer = work_done_list))

def set_user_info():
    first_name = request.vars.first_name
    last_name = request.vars.last_name
    email = request.vars.email
    password = request.vars.password
    team_name = request.vars.team_name
    class_name = request.vars.class_name

    db.user_info.update_or_insert(
        first_name = first_name,
        last_name = last_name,
        email = email,
        class_name = class_name,
        password = password,
        team_name = team_name
    )
    return "Data stored"

def check_log_in():
    username = request.vars.login_email
    password = request.vars.login_password

    rows = db((db.user_info.email == username) & (db.user_info.password == password)).select()

    # Only have 5 fields for user information 
    user_info_list = [None] * 5

    if(len(rows) != 0):
        # Store fire name
        user_info_list[0] = rows[0].first_name
        # Store last name
        user_info_list[1] = rows[0].last_name
        # Store email
        user_info_list[2] = rows[0].email
        # Store class name
        user_info_list[3] =  rows[0].class_name
        # Store team name
        user_info_list[4] = rows[0].team_name


    return response.json(dict(user_info_list = user_info_list))


def get_user_info():
    username = request.vars.login_email


    rows = db(db.user_info.email == username).select()

    # Only have 5 fields for user information 
    user_info_list = [None] * 5

    if(len(rows) != 0):
        # Store fire name
        user_info_list[0] = rows[0].first_name
        # Store last name
        user_info_list[1] = rows[0].last_name
        # Store email
        user_info_list[2] = rows[0].email
        # Store class name
        user_info_list[3] =  rows[0].class_name
        # Store team name
        user_info_list[4] = rows[0].team_name


    return response.json(dict(user_info_list = user_info_list))


