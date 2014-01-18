//Data models
//-----
// Task {
//  name: String,
//  owner: String (MongoDB._id)
//  listid: String (MongoDB._id)
// }
//-----
// List {
//   name: String,
//   owner: (MongoDB._id)
// }
//-----
//local variables
var Task = function (name, owner, listid){
  this.name = name;
  this.owner = owner;
  this.listid = listid;
  return this;
};

var List = function (name, owner){
  this.name = name;
  this.owner = owner;
  return this;
};

//global variables
Tasks = new Meteor.Collection('tasks');
Lists = new Meteor.Collection('lists');

Tasks.allow({
  'insert': function (userId, task){
    return false; //use Meteor.methods
  },
  'update': function (userId, task, fields, modifier){
    var allowed = [ "name" ];
    return (task.owner === userId) && (_.difference(fields, allowed).length === 0);
  },
  'remove': function (userId, task){
    return task.owner === userId;
  },
});

Lists.allow({
  'insert': function (userId, list){
    return false; //use Meteor.methods 
  },
  'update': function (userId, list, fields, modifier){
    var allowed = [ "name" ];
    return (list.owner === userId) && (_.difference(fields, allowed).length === 0);
  },
  'remove': function (userId, list){
    return false; //use Meteor.methods
  },
});

Meteor.methods({
  addList: function (name, owner){
    Lists.insert(new List(name, owner));
  },
  rmList: function (listid){
    Lists.remove({_id: listid});
    Tasks.remove({"listid": listid});
  },
  addTask: function (name, owner, listid){
    Tasks.insert(new Task(name, owner, listid));
  }
});