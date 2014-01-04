//local variables
// Task {
//  name: String,
//  owner: String (fbid?!)
// }
var Task = function (name, owner){
  this.name = name;
  this.owner = owner;
  return this;
}

//global variables
Tasks = new Meteor.Collection('tasks');

//client side code
if (Meteor.isClient) {
  //setting login dialog text language into Polish
  Template.tasks.rendered = function (){
    $('span.sign-in-text-facebook').html("Zaloguj przez Facebook'a"); //login btn 
    $('div#login-buttons-logout').html("Wyloguj");                    //logout btn
  };

  //templates variables initialization
  Template.tasks.tasks = function (){
    var tasks = Tasks.find({}, {sort: {"name": 1} }).fetch();
    for(var i=0; i < tasks.length; i++){
      tasks[i].owner = Meteor.users.findOne(tasks[i].owner);
    }
    return tasks;
  };

  Template.editTask.selectedTask = function (){
    return Tasks.findOne({"_id": Session.get("selected_task")});
  };

  Template.tasks.selected = function (){
    return Session.get("selected_task");
  }

  Template.task.canEdit = function (){
      console.log(this);
      console.log(Meteor.userId() + ' !== null && ' + Meteor.userId() + ' === ' + this.owner._id);
      console.log(Meteor.userId() !== null && Meteor.userId() === this.owner._id);
    return Meteor.userId() !== null && Meteor.userId() === this.owner._id;
  }
  //---

  //templates events handling
  Template.addTask.events({
    'click button#add-task-btn': function () {
      var name = $('#task-name').val();
      if(name !== null){
        Tasks.insert(new Task(name, Meteor.userId() ));
        $('#task-name').val('');
      }
    },
    'click button#add-task-cancel-btn': function () {
      $('#task-name').val('');
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
    // if(Tasks.find().count() === 0){
    //   var names = [ "lezing", "smazing", "plazing" ];
    //   for(var i=0; i < names.length; i++){
    //     Tasks.insert(new Task(names[i]));
    //   }
    // }
  });
}
