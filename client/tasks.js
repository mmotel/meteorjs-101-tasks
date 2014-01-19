//client side code
Meteor.startup(function () {
  Deps.autorun(function () {
    if(Meteor.user()){
      if(Session.get("selected_list") === undefined || Session.get("selected_list") === null){
        var list = Lists.findOne({"owner": Meteor.userId() });
        if(list){
          Session.set("selected_list", list._id);
        }
      }
    }
  });
});


  //setting login dialog text language into Polish
  Template.tasks.rendered = function (){
    $('span.sign-in-text-facebook').html("Zaloguj przez Facebook'a"); //login btn 
    $('div#login-buttons-logout').html("Wyloguj");                    //logout btn
  };

  //templates variables initialization
  //Lists & list's tasks
  Template.tasks.tasks = function (){
    if(Meteor.user() && Session.get("selected_list") && Session.get("selected_list") !== null){
      var tasks = Tasks.find({"listid": Session.get("selected_list")}, {sort: {"name": 1} }).fetch();
      for(var i=0; i < tasks.length; i++){
        tasks[i].owner = Meteor.users.findOne(tasks[i].owner);
      }
      return tasks;
    }
    else{
      return [];
    }
  };

  Template.lists.lists = function (){
    if(Meteor.user()){
      var lists = Lists.find({"owner": Meteor.userId()}, {sort: {"name": 1} }).fetch();
      for(var i=0; i < lists.length; i++){
        lists[i].owner = Meteor.users.findOne(lists[i].owner);
      }
      return lists;
    }
    else{
      return [];
    }
  };
  //Selected List & Task
  Template.editTaskModal.selectedTask = function (){
    return Tasks.findOne({"_id": Session.get("selected_task")});
  };

  Template.rmTaskModal.selectedTask = function (){
    return Tasks.findOne({"_id": Session.get("selected_task")});
  };

  Template.editListModal.selectedList = function (){
    return Lists.findOne({"_id": Session.get("selected_list")});
  };

  Template.rmListModal.selectedList = function (){
    return Lists.findOne({"_id": Session.get("selected_list")});
  };
  //Can edit/rm Task & List
  Template.task.canEdit = function (){
    return Meteor.userId() !== null && Meteor.userId() === this.owner._id;
  };

  Template.list.canEdit = function (){
    return Meteor.userId() !== null && Meteor.userId() === this.owner._id;
  };
  //Show modals
  Template.addListModal.show = function (){
    return Session.get("show_add_list_modal");
  };

  Template.editListModal.show = function (){
    return Session.get("show_edit_list_modal");
  };

  Template.rmListModal.show = function (){
    return Session.get("show_rm_list_modal");
  };

  Template.addTaskModal.show = function (){
    return Session.get("show_add_task_modal");
  };

  Template.editTaskModal.show = function (){
    return Session.get("show_edit_task_modal");
  };

  Template.rmTaskModal.show = function (){
    return Session.get("show_rm_task_modal");
  };
  //---

  Template.task.events({
    'click button.rmTask': function (event, template){
      console.log(this._id);
      Session.set('selected_task', this._id);
      Session.set("show_rm_task_modal", true);
    },
    'click button.editTask': function (event, template){
      console.log(this._id);
      Session.set("selected_task", this._id);
      Session.set("show_edit_task_modal", true);
    }
  });

  Template.list.events({
    'click button.rmList': function (event, template){
      console.log(this._id);
      Session.set("selected_list", this._id);
      Session.set("show_rm_list_modal", true);
    },
    'click button.editList': function (event, template){
      // console.log(this._id);
      Session.set("selected_list", this._id);
      Session.set("show_edit_list_modal", true);
    },
    'click button.addTask': function (event, template){
      Session.set("selected_list", this._id);
      Session.set("show_add_task_modal", true);
    },
    'click td.name': function (event, template){
      Session.set("selected_list", this._id);
    }
  });  

  Template.addListModal.events({
    'click .done': function (){
      Session.set("show_add_list_modal", false);
    },
    'click .save': function (event, template){
      var listName = $('#list-name').val();
      if(listName !== ""){
        // Lists.insert(new List(listName, Meteor.userId() ));
        Meteor.call('addList', listName, Meteor.userId());
      }
    }
  });

  Template.editListModal.events({
    'click .done': function (){
      Session.set("show_edit_list_modal", false);
    },
    'click .save': function (event, template){
      var listName = $('#edit-list-name').val();
      if(listName !== ""){
        Lists.update({_id: Session.get("selected_list")}, {$set: { name: listName } });
        Session.set("selected_list", null);
      }
    }
  });

  Template.rmListModal.events({
    'click .done': function (){
      Session.set("show_rm_list_modal", false);
    },
    'click .save': function (event, template){
      Meteor.call("rmList", Session.get("selected_list"));
      Session.set("selected_list", null);
    }
  });

  Template.addTaskModal.events({
    'click .done': function (){
      Session.set("show_add_task_modal", false);
    },
    'click .save': function (event, template){
      var taskName = $('#task-name').val();
      if(taskName !== ""){
        // Tasks.insert(new Task(taskName, Meteor.userId() , Session.get("selected_list") ));
        Meteor.call('addTask', taskName, Meteor.userId(), Session.get("selected_list"));
      }
    }
  });

  Template.editTaskModal.events({
    'click .done': function (){
      Session.set("show_edit_task_modal", false);
    },
    'click .save': function (event, template){
      var taskName = $('#edit-task-name').val();
      if(taskName !== ""){
        Tasks.update({_id: Session.get("selected_task")}, {$set: { name: taskName } });
        Session.set("selected_task", null);
      }
    }
  });

  Template.rmTaskModal.events({
    'click .done': function (){
      Session.set("show_rm_task_modal", false);
    },
    'click .save': function (event, template){
      Tasks.remove({_id: Session.get("selected_task")});
      Session.set("selected_task", null);
    }
  });

  Template.menu.events({
    'click #addList': function (event, template){
      Session.set("show_add_list_modal", true);
    }
  });
  //---
