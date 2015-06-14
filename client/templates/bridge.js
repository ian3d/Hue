Template.lightlist.created = function () {
    this.autorun(function () {
        this.subscription = Meteor.subscribe('lights');
    }.bind(this));
};

Template.bridge.helpers({
    counter: function () {
        return Session.get('counter');
    },
    bridge: function() {
        return Session.get('bridge');
    },
    lights: function() {
        return Session.get(Lights.find({}, {sort: {name: 1}}));
    },
    lightsCount: function() {
        return Lights.find().count();
    }
});

Template.bridge.events({
    'click .findIP': function () {
        Meteor.call('getBridge', function(err, data){
            if(err) {
                Session.set('bridge', "error: " + err.reason);
                return;
            }
            Session.set('bridge', data);
        });
    },
    'click .getLights': function() {
        Meteor.call('getLights', function(err, data){
            if(err) {
                Session.set('lights', "error: " + err);
                return;
            }
            if('error' in data) {
                Session.set('lights', "ERROR: " + data.data[0].error.description + "! Oops, looks like an error. Press the bridge button, then click Initial Setup.");
                Session.set('newUser', true);
                return;
            }
            Session.set('newUser', false);
            Meteor.call('setLights', data);
            //Session.set('lights', Lights.find({}, {sort: {name: 1}}));
        });
    }
});