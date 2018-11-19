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



def set_user_story_points():
    story_num = int(request.vars.story_num)
    story_points = int(request.vars.story_points)
    db.user_stories.update_or_insert(
        user_story_num = story_num,
        user_story_points = story_points
    )

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
    db.work_completed.update_or_insert(
        sprint_number = sprint_num,
        story_points = story_points
    )

def get_work_done_data():
    rows = db(db.work_completed).select(orderby=db.work_completed.sprint_number)
    size = len(rows)
    work_done_list = [None] * size

    for x in range (1, size+1):
        work_done_list[x-1] = [rows[x-1].sprint_number, rows[x-1].story_points]
    return response.json(dict(answer = work_done_list))

