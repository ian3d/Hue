Template.light.created = function () {
    this.autorun(function () {
        this.subscription = Meteor.subscribe('light', Router.current().params.id);
    }.bind(this));
    console.log("subscribed to lights");
};

Template.light.helpers({
    light: function () {
        return Lights.findOne({id: Router.current().params.id});

    },
    debug: function () {
        return Router.current().params.id;
    }

});

Template.light.events({
    'click .thison': function(event) {
        event.preventDefault();
        Meteor.call('thisOn', Router.current().params.id);
    },
    'click .thisoff': function(event) {
        event.preventDefault();
        Meteor.call('thisOff', Router.current().params.id);
    },
    'change .brightness-range': function(event) {
        event.preventDefault();
        Meteor.call('setBrightness', Router.current().params.id, event.target.value);
    },
    'change .hue-range': function(event) {
        event.preventDefault();
        Meteor.call('setHue', Router.current().params.id, event.target.value);
    },
    'change .sat-range': function(event) {
        event.preventDefault();
        Meteor.call('setSat', Router.current().params.id, event.target.value);
    }
});

