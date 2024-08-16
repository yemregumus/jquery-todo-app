$(document).ready(function () {
  // Load tasks from local storage
  function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(function (task) {
      addTaskToDOM(task.text, task.completed);
    });
  }

  // Save tasks to local storage
  function saveTasks() {
    var tasks = [];
    $("#task-list li").each(function () {
      var taskText = $(this).text().replace("X", "").trim();
      var completed = $(this).hasClass("completed");
      tasks.push({ text: taskText, completed: completed });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Add a task to the DOM
  function addTaskToDOM(taskText, completed) {
    var newTask = $("<li></li>").text(taskText).addClass("editable");
    if (completed) {
      newTask.addClass("completed");
    }
    newTask.append('<button class="delete-task">X</button>');
    $("#task-list").append(newTask);
    saveTasks();
  }

  // Add a new task
  $("#add-task").on("click", function () {
    var taskText = $("#new-task").val();
    if (taskText !== "") {
      addTaskToDOM(taskText, false);
      $("#new-task").val("");
    }
  });

  // Delete a task
  $("#task-list").on("click", ".delete-task", function () {
    $(this).parent().remove();
    saveTasks();
  });

  // Mark task as completed
  $("#task-list").on("click", "li", function () {
    $(this).toggleClass("completed");
    saveTasks();
  });

  // Edit a task
  $("#task-list").on("dblclick", "li.editable", function () {
    var currentText = $(this).text().replace("X", "").trim();
    var input = $('<input type="text">').val(currentText);
    $(this).html(input);
    input.focus();

    input.on("blur keydown", function (e) {
      if (e.type === "blur" || e.keyCode === 13) {
        var newText = $(this).val();
        $(this).parent().text(newText).append('<button class="delete-task">X</button>');
        saveTasks();
      }
    });
  });

  // Clear completed tasks
  $("#clear-completed").on("click", function () {
    $("#task-list .completed").remove();
    saveTasks();
  });

  // Filter tasks
  $(".filters button").on("click", function () {
    var filter = $(this).attr("id");
    $("#task-list li").show();
    if (filter === "active-tasks") {
      $("#task-list li.completed").hide();
    } else if (filter === "completed-tasks") {
      $("#task-list li:not(.completed)").hide();
    }
  });

  // Make tasks sortable
  $("#task-list").sortable({
    stop: function () {
      saveTasks();
    },
  });

  // Initial load of tasks
  loadTasks();
});
