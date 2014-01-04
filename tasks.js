//local variables
// Task {
//   name: String
// }
var Task = function (name){
  this.name = name;
  return this;
}

//global variables
Tasks = new Meteor.Collection('tasks');

//client side code
if (Meteor.isClient) {
  Template.tasks.rendered = function (){
    $('span.sign-in-text-facebook').html("Zaloguj przez Facebook'a");
    $('div#login-buttons-logout').html("Wyloguj");
  }


  //templates variables initialization
  Template.tasks.tasks = function (){
    return Tasks.find({}, {sort: {"name": 1} });
  };

  Template.editTask.selectedTask = function (){
    return Tasks.findOne({"_id": Session.get("selected_task")});
  };

  Template.tasks.selected = function (){
    return Session.get("selected_task");
  }
  //---

  //templates events handling
  Template.addTask.events({
    'click button#add-task-btn': function () {
      var name = $('#task-name').val();
      if(name !== null){
        Tasks.insert(new Task(name));
      }
    }
  });

  Template.editTask.events({
    'click button#edit-task-cancel-btn': function () {
      Session.set('selected_task', null);
    },
    'click button#edit-task-btn': function () {
      var tid = Session.get("selected_task");
      var name = $('#edit-task-name').val();

      if(name !== null){
        Tasks.update({"_id": tid}, {$set: {"name": name} });
      }

      Session.set('selected_task', null);
    }
  });

  Template.task.events({
    'click button.rmTask': function (event, template){
      console.log(this._id);
      Session.set('selected_task', null);
      Tasks.remove({_id: this._id});
    },
    'click button.editTask': function (event, template){
      console.log(this._id);
      Session.set("selected_task", this._id);
    }
  });
  //---
}
//server side code
if (Meteor.isServer) {
  Meteor.startup(function () {
    // Tasks.remove({});
    if(Tasks.find().count() === 0){
      var names = [ "lezing", "smazing", "plazing" ];
      for(var i=0; i < names.length; i++){
        Tasks.insert(new Task(names[i]));
      }
    }
  });
}
