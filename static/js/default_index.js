
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


    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
        },
        methods: {
            go_to_backlog_graph: self.go_to_backlog_graph,
            go_to_work_done_graph: self.go_to_work_done_graph,
            go_to_progress_graph: self.go_to_progress_graph,
            go_to_account_settings: self.go_to_account_settings,
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
