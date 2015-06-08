
Lights = new Mongo.Collection("lights");
Meteor.subscribe("lights");

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

  Template.lights.helpers({
    newUser: function() {
      return Session.get('newUser');
    }
  });

  Template.lights.events({
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

Template.lightList.helpers({
  lightList: function() {
    return Lights.find({}, {sort: {name: 1}});
  },
  debug: function() {
    return Session.get('debug');
  }
})

Template.lightList.events({
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
  }
})



