Lights = new Mongo.Collection("lights");

Template.lightlist.created = function () {
    this.autorun(function () {
        this.subscription = Meteor.subscribe('lights');
    }.bind(this));
};

Template.lightlist.helpers({
    lightlist: function() {
        return Lights.find({}, {sort: {name: 1}});
    },
    debug: function() {
        return Session.get('debug');
    },
    newUser: function() {
        return Session.get('newUser');
    }
})

Template.lightlist.events({
    'click .allon': function(event) {
        event.preventDefault();
        Meteor.call('allOn');
    },
    'click .alloff': function(event) {
        event.preventDefault();
        Meteor.call('allOff');
    },
    'click .thison': function(event) {
        event.preventDefault();
        Meteor.call('thisOn', this.id);
    },
    'click .thisoff': function(event) {
        event.preventDefault();
        Meteor.call('thisOff', this.id);
    },
    'change .brightness-range': function(event) {
        event.preventDefault();
        Meteor.call('setBrightness', this.id, event.target.value);
    },
    'click .newUser': function() {
        Meteor.call('userSetup', function(err, data) {
            if(err) {
                Session.set('lights', "error: " + err);
                return;
            }
            if('error' in data.data[0]) {
                Session.set('lights', "ERROR: " + data.data[0].error.description + "! Oops, looks like an error. Press the bridge button, then click Initial Setup.");
                return;
            }
            if('success' in data.data[0]) {
                Session.set('lights', "Link Successful!");
                return;
            }
            Session.set('lights', "Something went wrong: " + JSON.stringify(data));
        })
    }
});