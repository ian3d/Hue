
Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function() {
    this.route('lightlist', {
        path: '/'
    });
    this.route('bridge');
    this.route('light', {
        path: '/light/:id'
    });

});