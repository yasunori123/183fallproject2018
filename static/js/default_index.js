

// This is the js for the default/index.html view.
var app = function() {

  var self = {};

  Vue.config.silent = false; // show all warnings

  self.go_to_backlog_graph = function() {
      console.log("Go to backlog graph ");
  }
  self.go_to_work_done_graph = function() {
      console.log("Go to work done graph ");
  }

  self.go_to_progress_graph = function() {
      console.log("Go to progress graph ");
  }

  self.go_to_account_settings = function() {
      console.log("Go to account graph ");
  }
  
  self.set_project_details = function() {
    console.log("Entered set project details ");
    if(
        document.getElementById("numberOfUserStories").value == null
        ||
        document.getElementById("numberOfSprints").value == null
        ||
        document.getElementById("lengthOfSprint").value == null
        ||
        document.getElementById("sprintStartDate").value == null
    )
    {}
    else
    {

        self.vue.num_of_user_stories = document.getElementById("numberOfUserStories").value
        self.vue.num_of_sprints = document.getElementById("numberOfSprints").value
        self.vue.length_of_sprint = document.getElementById("lengthOfSprint").value
        self.vue.sprint_start_date = document.getElementById("sprintStartDate").value
    
        $.post(set_project_details,{
            num_of_user_stories : self.vue.num_of_user_stories,
            num_of_sprints : self.vue.num_of_sprints,
            length_of_sprint : self.vue.length_of_sprint,
            sprint_start_date : self.vue.sprint_start_date
        },
          function(data){
  
          })
    }
  }

  self.set_user_story_details = function(){

     // Make a list of all story points  
      var list_story_points = [];
      var num_of_user_stories = document.getElementById("numberOfUserStories").value;
      var i;
      for(i = 1; i <= num_of_user_stories; i++){
          var story_pts = document.getElementById("sp"+i).innerHTML
          list_story_points.push(story_pts)
          $.post(set_user_story_points,{
            story_num : i,
            story_points : list_story_points[i-1]
            },
            function(data){
         
            })
      }
  }

  //Code changed from : https://stackoverflow.com/questions/14643617/create-table-using-javascript  
  self.create_user_story_table = function() {
      var num_of_user_stories = document.getElementById("numberOfUserStories").value

      var myTableDiv = document.getElementById("userStoryTable");
      if(myTableDiv.hasChildNodes()){
        myTableDiv.removeChild(myTableDiv.childNodes[0]);
      }
      var table = document.createElement('TABLE');
      table.border = '1';
      var tableBody = document.createElement('TBODY');
      table.appendChild(tableBody);
      for (var i = 0; i < num_of_user_stories; i++) {
        var tr = document.createElement('TR');
        if(i == 0){
            var thUserStoryNumber = document.createElement('TH');
            var thUserStoryPoints = document.createElement('TH');
            thUserStoryNumber.appendChild(document.createTextNode("User Story"));
            thUserStoryPoints.appendChild(document.createTextNode("Story Points"));
            tableBody.append(thUserStoryNumber);
            tableBody.append(thUserStoryPoints);
        }
        tableBody.appendChild(tr);
        for (var j = 0; j < 2; j++) {
          var td = document.createElement('TD');
          td.contentEditable = "true";
          td.width = '100';
          if(j == 0 ){
            td.appendChild(document.createTextNode(" " + (i+1) +" "));
          }
          else{
            td.setAttribute('id',"sp"+(i+1));
          }
          tr.appendChild(td);
        }
      }
      myTableDiv.appendChild(table);
  }


  self.get_backlog_story_points = function(){
    $.getJSON(get_story_points, 
        { },
        function(data){
            self.vue.story_points = data.answer
            console.log("check this out :", self.vue.story_points)
            self.draw_backlog_chart();
        })
  }

  self.get_work_done_data = function(){
    $.getJSON(get_work_done_data, 
        { },
        function(data){
            self.vue.story_points = data.answer
            self.draw_backlog_chart();
        })
  }

  self.draw_backlog_chart = function(){
    
    // Load google charts
    google.charts.load('current', {'packages':['corechart']});
    
    // Initialize array to store our story points in 
    var array = []
    
    // First index of array must specifiy the data 
    array[0] = ['Sprint', 'Story Point']

    var i;

    var sumOfStoryPoints = 0;

    // Access the stored values in our vue story points array 
    for (i = 1 ; i <= self.vue.story_points.length ; i++){
        var sprintNum = self.vue.story_points[i-1][0];
        // Story point should be an int
        var storyPoint = parseInt(self.vue.story_points[i-1][1]);
        sumOfStoryPoints = sumOfStoryPoints + storyPoint;
        // Update our array to have the right sprint num and story point
        array[i] = [sprintNum, storyPoint]
    }

    document.getElementById('backlogStoryPoints').innerHTML = 
        "Story points to finish for this project: " + sumOfStoryPoints;
    

    // Load google charts
    google.charts.setOnLoadCallback(drawChart);

    // Draw the chart and set the chart values
    function drawChart() {
      var data = google.visualization.arrayToDataTable(array);
    
    //   Optional add a title and set the width and height of the chart
      var options = {
          'title':'Total Work To be Completed', 
          'width':600, 
          'height':600,
           vAxis: {title: "Story Points"},
           hAxis: {title: "User Story Number"},
        };
    
      // Display the chart inside the <div> element with id="columnChart"
      var chart = new google.visualization.ColumnChart(document.getElementById('backlogChart'));
      chart.draw(data, options);
    }
  }


    self.create_table_for_work_done = function() {
        $.post(get_project_details,{
            },
            function(data){
                // Create a chart so use can update their progress
                self.vue.num_of_sprints = data
                var myTableDiv = document.getElementById("work_done_table");
                if(myTableDiv.hasChildNodes()){
                    myTableDiv.removeChild(myTableDiv.childNodes[0]);
                }
                var table = document.createElement('TABLE');
                table.border = '1';
                var tableBody = document.createElement('TBODY');
                table.appendChild(tableBody);
          
                for (var i = 0; i < self.vue.num_of_sprints; i++) {
                    var tr = document.createElement('TR');
                    if(i == 0){
                        var thSprintNumber = document.createElement('TH');
                        var thPointsCompleted = document.createElement('TH');
                        thSprintNumber.appendChild(document.createTextNode("Sprint Number"));
                        thPointsCompleted.appendChild(document.createTextNode("Story Points Completed"));
                        tableBody.append(thSprintNumber);
                        tableBody.append(thPointsCompleted);
                    }
                    tableBody.appendChild(tr);
                    for (var j = 0; j < 2; j++) {
                        var td = document.createElement('TD');
                        td.width = '100';
                        if(j == 0 ){
                            td.appendChild(document.createTextNode(" " + (i+1) +" "));
                        }
                        else{
                            td.contentEditable = "true";
                            td.setAttribute('id',"wd"+(i+1));
                        }
                        tr.appendChild(td);
                    }
                }
                myTableDiv.appendChild(table);
            })
    }

    self.update_wd_table = function() {
       
        var i;
        // Gather data from table and send it to database
        for( i = 1; i <= self.vue.num_of_sprints; i ++){
            $.post(set_work_done_data,{
                sprint_num : i,
                story_points : parseInt(document.getElementById("wd"+i).innerHTML)
                },
                function(data){
                   self.get_work_done_data();
                })
        }
        // Submit update work done table values to database

    }

    self.load_chart_for_work_done = function(work_done_array) {
 
        self.create_table_for_work_done();
        // Load google charts
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
 
        // Draw the chart and set the chart values
        function drawChart() {

        if(typeof work_done_array !== 'undefined' && work_done_array.length > 0) {
            var data = google.visualization.arrayToDataTable(work_done_array);
        }else{
            var data = google.visualization.arrayToDataTable([
                ['Sprint', 'Story Point'],
                ['1', 10],
                ['2', 0],
                ['3', 0],
                ['4', 0],
                ['5', 0]
                ]);
        }
            // Optional; add a title and set the width and height of the chart
            var options = {
                'title':' Amount of Work Currently Completed ', 
                'width':550, 
                'height':400,
                    vAxis: {title: "Story Points"},
                    hAxis: {title: "Sprint Number"},
                };
            
            // Display the chart inside the <div> element with id="columnChart"
            var chart = new google.visualization.LineChart(document.getElementById('work_done_chart'));
            chart.draw(data, options);
        }
    }


    self.get_work_done_data = function(){
        // Get data from database 
        $.post(get_work_done_data,{
            },
            function(data){
                self.vue.work_done_list = data.answer 
                // Create array of the data
                var work_done_list= [];
                work_done_list[0] = ['Sprint', 'Work Completed']
                for(i = 1 ; i <= self.vue.work_done_list.length ; i++){
                    var sprintNum = self.vue.work_done_list[i-1][0];
                    // Story point should be an int
                    var storyPoint_completed = parseInt(self.vue.work_done_list[i-1][1]);
                    // Update our array to have the right sprint num and story point
                    work_done_list[i] = [sprintNum, storyPoint_completed]
                    if(i == self.vue.work_done_list.length){
                        self.load_chart_for_work_done(work_done_list);
                    }
                }
            })
    }

    self.get_progress_data = function() {
        var total_work_list = [];
        var total_completed_list= []; 
        var ideal_list = []; 
        var progress_list = [];

        var loopVar = 0;

        // Calculate amount of work that has been finished so far 
        $.post(get_work_done_data,{},
            function(data){
                var temp_work_done_list = data.answer
                loopVar = temp_work_done_list.length
                for(i = 1 ; i <= loopVar ; i++){
                    var sprintNum = temp_work_done_list[i-1][0];
                    // Story point should be an int
                    var storyPoint_completed = parseInt(temp_work_done_list[i-1][1]);
                    // Update our array to have the right sprint num and story point
                    total_completed_list[i-1] = storyPoint_completed
                }

                console.log("total completed so far: ", total_completed_list)
            
            // Calculate total amount of work that has to be finished 
            $.getJSON(get_story_points, 
                { },
                function(data){
                    self.vue.story_points = data.answer
                    var points_array = self.vue.story_points
                    var total_story_points = 0

                    // Loop through array of points and sum it
                    for(i = 0 ; i < self.vue.story_points.length ; i++){
                        // Update our array to have the right sprint num and story point
                        total_story_points = total_story_points + parseInt(points_array[i][1]);
                    }

                    // Create array for total story points needed.
                    // for(i = 1 ; i <= self.vue.story_points.length ; i++){
                    //     total_work_list[i-1] = total_story_points
                    // }
                    // console.log("total story points array: " , total_story_points)


                    // Calculate total ideal progress 
                    $.getJSON(get_project_details, 
                        { },
                        function(data){
                            // console.log("num of sprints is ", data)
                            // console.log("total_story_points is " , total_story_points);
                            var rate_of_change = total_story_points / data;

                            // Create an array of ideal progress
                            var sum = rate_of_change
                            for(i = 1 ; i <= loopVar ; i++){
                                ideal_list[i-1] =  sum
                                sum += rate_of_change;
                            }
                            // console.log("ideal list is : ", ideal_list)

                            //Combine all data above together and draw a chart with it
                            progress_list[0] = ['Sprint','Total Work', 'Work Completed', 'Ideal Progress']
                            progress_list[1] = ['0', total_story_points, 0, 0]
                            for( i = 2; i <= loopVar+1;i++){
                                progress_list[i] = [""+i-1+"", total_story_points, total_completed_list[i-2], ideal_list[i-2]]
                            }

                            console.log("Progress list is : " , progress_list)
                            self.load_chart_for_progress(progress_list);

                        })

                })
            })
    }

    self.load_chart_for_progress = function(progress_array) {

        // Load google charts
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
 
        // Draw the chart and set the chart values
        function drawChart() {

        if(typeof progress_array !== 'undefined' && progress_array.length > 0) {
            var data = google.visualization.arrayToDataTable(progress_array);
        }else{
            var data = google.visualization.arrayToDataTable([
                ['Sprint', 'Story Point'],
                ['1', 10],
                ['2', 0],
                ['3', 0],
                ['4', 0],
                ['5', 0]
                ]);
        }
            // Optional; add a title and set the width and height of the chart
            var options = {
                'title':' Overall Progress  ', 
                'width':550, 
                'height':400,
                    vAxis: {title: "Story Points"},
                    hAxis: {title: "Sprint Number"},
                };
            
            // Display the chart inside the <div> element with id="columnChart"
            var chart = new google.visualization.LineChart(document.getElementById('progressChart'));
            chart.draw(data, options);
        }
    }




  self.vue = new Vue({
      el: "#vue-div",
      delimiters: ['${', '}'],
      unsafeDelimiters: ['!{', '}'],
      data: {
        num_of_user_stories : '',
        num_of_sprints : '',
        length_of_sprint : '',
        sprint_start_date : '',
        work_done_list : []
      },
      methods: {
          go_to_backlog_graph: self.go_to_backlog_graph,
          go_to_work_done_graph: self.go_to_work_done_graph,
          go_to_progress_graph: self.go_to_progress_graph,
          go_to_account_settings: self.go_to_account_settings,
          set_project_details: self.set_project_details,
          create_user_story_table : self.create_user_story_table,
          set_user_story_details: self.set_user_story_details,
          get_backlog_story_points: self.get_backlog_story_points,
          load_chart_for_work_done: self.load_chart_for_work_done,
          update_wd_table: self.update_wd_table,
          get_work_done_data : self.get_work_done_data,
          get_progress_data: self.get_progress_data
      }

  });

  return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});


// For navigation open and close from https://www.w3schools.com/howto/howto_js_sidenav.asp
/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}
