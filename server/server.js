//publish data sources

Meteor.publish("users", function (){ //publish only users' ids & profiles
	return Meteor.users.find({}, { fields: {_id: 1, profile: 1} });
});

Meteor.publish("lists", function (){ //publish only current user's lists
	return Lists.find({"owner": this.userId});
})

Meteor.publish("tasks", function (){ //publish only current user's tasks 
	return Tasks.find({"owner": this.userId});
})