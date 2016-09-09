(function($) {
  'use strict';

  var pluginName = "pluginName",
      defaults = {
        el : '',
        query : "screen and (min-width:768px)"
      },
      plugins = [];

  // The plugin constructor
  function Plugin( element, options ) {
    this.options =  $.extend({}, defaults, options); // raw query options
    this.mm = window.matchMedia(this.options.query);
    this.el = this.options.el;
    this.$el = $(this.el);
    this.init();
  }
  Plugin.prototype = {

    // Handle the media query event, add and remove the trigger click listener
    handleQuery : function(mql) {
      if(mql.matches){

      }else{

      }
    },
    addEventListeners : function(){
      this.mm.addListener($.proxy(this.handleQuery, this));
    },
    removeEventListeners : function(){

    },
    init : function() {
      this.addEventListeners();
      this.handleQuery(this.mm);
    }
  };

  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName,
        plugins.push(new Plugin( this, options )));
      }
    });
  };

  $(defaults.el)[pluginName]();

});