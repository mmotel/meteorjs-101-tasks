//publish data sources

Meteor.publish("users", function (){ //publish only users' ids & profiles
	return Meteor.users.find({}, { fields: {_id: 1, profile: 1} });
});

Meteor.publish("lists", function (){ //publish only user's lists
	return Lists.find({"owner": this.userId});
})

Meteor.publish("tasks", function (listid){ //publish only tasks from selected list 
	return Tasks.find({"listid": listid});
})