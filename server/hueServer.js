
Lights = new Mongo.Collection('lights');

    var bridgeIp = "";
    var bridgeUser = "hueTestUser";


    var appInfo = JSON.stringify({
        devicetype: "meteorApp#Test",
        username: bridgeUser
    });
    var onState = JSON.stringify({on: true});
    var offState = JSON.stringify({on: false});

Meteor.methods({
    upnpBridge: function() {
       return HTTP.get("http://www.meethue.com/api/nupnp");
    },
    getBridge: function() {
        return bridgeIp;
    },
    getLights: function() {
        return HTTP.get("http://" + bridgeIp + "/api/" + bridgeUser + "/lights");
    },
    userSetup: function() {
        return HTTP.post("http://" + bridgeIp + "/api", {content: appInfo});
    },
    setLights: function(data) {
        for(var x in data.data){
            if(data.data.hasOwnProperty(x)) {
                //console.log("{id: " + x + "}, " + data.data[x]);
                data.data[x].id = x;
                Lights.upsert({id: x}, data.data[x]);
            }
        }
    },
    allOn: function() {
        return HTTP.put("http://" + bridgeIp + "/api/" + bridgeUser + "/groups/0/action", {content: onState});
    },
    allOff: function() {
        return HTTP.put("http://" + bridgeIp + "/api/" + bridgeUser + "/groups/0/action", {content: offState});
    },
    thisOn: function(lightId) {
        return HTTP.put("http://" + bridgeIp + "/api/" + bridgeUser + "/lights/" + lightId + "/state", {content: onState});
    },
    thisOff: function(lightId) {
        return HTTP.put("http://" + bridgeIp + "/api/" + bridgeUser + "/lights/" + lightId + "/state", {content: offState});
    },
    setBrightness: function(lightId, brightness) {
        var content = JSON.stringify({bri: parseInt(brightness)});
        return HTTP.put("http://" + bridgeIp + "/api/" + bridgeUser + "/lights/" + lightId + "/state", {content: content});
    }
})

Meteor.startup(function() {
    Meteor.call("upnpBridge", function(err, data){
        if(err)
            console.log(err);
        bridgeIp =  data.data[0].internalipaddress;
        //bridgeUser =  data.data[0].id;
    });

    Meteor.publish("lights", function() {
        return Lights.find({});
    })
})

