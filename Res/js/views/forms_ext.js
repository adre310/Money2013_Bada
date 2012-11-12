/*
* Backbone forms extend
*/

define(['jquery',
        'backbone',
        'underscore',
        'jquery.mobile',
        'backbone.forms',
        'mobiscroll',
        'mobiscroll-datetime'],function() {
	  var Form = Backbone.Form,
      Base = Form.editors.Base,
      createTemplate = Form.helpers.createTemplate,
      triggerCancellableEvent = Form.helpers.triggerCancellableEvent,
      exports = {};
  
  /**
   * Additional editors that depend on jQuery UI
   */
  
  //DATE
  exports['mobiscroll.Date'] = Base.extend({

    className: 'bbf-jui-date',
    
    initialize: function(options) {
      console.log('editor 1');
      Base.prototype.initialize.call(this, options);
      
      //Cast to Date
      if (this.value && !_.isDate(this.value)) {
    	  if(typeof this.value == 'string') {
    		  console.log('convert iso8601 to Date '+this.value);
    		  this.value=Date.iso8601(this.value);
    		  console.log('after convert to Date '+this.value);
    	  } else { 
    		  console.log('convert to Date '+this.value);
    		  this.value = new Date(this.value);
    		  console.log('after convert to Date '+this.value);
    	  }
      }
      console.log('editor 2');
      
      //Set default date
      if (!this.value) {
        var date = new Date();
        date.setSeconds(0);
        date.setMilliseconds(0);
        
        this.value = date;
      }
      console.log('editor 3');
    },

    render: function() {
        console.log('editor 4');
      var $el = this.$el;

      $el.html('<input>');

      var input = $('input', $el);
      console.log('editor 5');

      input.scroller({ preset: 'date' });
      
      console.log('editor 6');
      this._observeDatepickerEvents();

      //Make sure setValue of this object is called, not of any objects extending it (e.g. DateTime)
      exports['mobiscroll.Date'].prototype.setValue.call(this, this.value);

      console.log('editor 7');

      return this;
    },

    /**
    * @return {Date}   Selected date
    */
    getValue: function() {
        console.log('editor 8');
      var input = $('input', this.el),
          date = input.scroller('getDate');

      console.log('editor 9');
      return date;
    },
    
    setValue: function(value) {
        console.log('editor 10 - '+value);
      $('input', this.el).scroller('setDate', value);
      console.log('editor 11');
    },
    
    focus: function() {
        console.log('editor 12');
      if (this.hasFocus) return;
      
      this.$('input').scroller('show');
      console.log('editor 13');
    },
    
    blur: function() {
        console.log('editor 14');
      if (!this.hasFocus) return;
      
      this.$('input').scroller('hide');
      console.log('editor 15');
    },
    
    _observeDatepickerEvents: function() {
        console.log('editor 16');
      var self = this;
      this.$('input').scroller('option', 'onSelect', function() {
          console.log('editor 16-1');
        self.trigger('change', self);
      });
      console.log('editor 17');
      this.$('input').scroller('option', 'onClose', function() {
          console.log('editor 17-1');
        if (!self.hasFocus) return;
        self.trigger('blur', self);
      });
      console.log('editor 18');
      this.$('input').scroller('option', 'beforeShow', function() {
          console.log('editor 18-1');
        if (self.hasFocus) return {};
        self.trigger('focus', self);
        
        return {};
      });
      console.log('editor 19');
    }

  });

  //Exports
  _.extend(Form.editors, exports);

	  //DEFAULT TEMPLATES
	  Form.setTemplates({
	    
	    //HTML
	    form: '\
	      <form class="bbf-form">{{fieldsets}}</form>\
	    ',
	    
	    fieldset: '\
	      <fieldset>\
	        <legend>{{legend}}</legend>\
	        {{fields}}\
	      </fieldset>\
	    ',
	    
	    field: '\
	    	<div data-role="fieldcontain">\
	        <label for="{{id}}">{{title}}</label>\
	        {{editor}}\
	        <label class="error">{{error}}</label>\
	        </div>\
	    ',

	    nestedField: '\
	      <li class="bbf-field bbf-nested-field field-{{key}}" title="{{title}}">\
	        <label for="{{id}}">{{title}}</label>\
	        <div class="bbf-editor">{{editor}}</div>\
	        <div class="bbf-help">{{help}}</div>\
	        <div class="bbf-error">{{error}}</div>\
	      </li>\
	    ',

	    list: '\
	      <div class="bbf-list">\
	        <ul>{{items}}</ul>\
	        <div class="bbf-actions"><button type="button" data-action="add">Add</div>\
	      </div>\
	    ',

	    listItem: '\
	      <li>\
	        <button type="button" data-action="remove" class="bbf-remove">&times;</button>\
	        <div class="bbf-editor-container">{{editor}}</div>\
	      </li>\
	    ',

	    date: '\
	      <div class="bbf-date">\
	        <select data-type="date" class="bbf-date">{{dates}}</select>\
	        <select data-type="month" class="bbf-month">{{months}}</select>\
	        <select data-type="year" class="bbf-year">{{years}}</select>\
	      </div>\
	    ',

	    dateTime: '\
	      <div class="bbf-datetime">\
	        <div class="bbf-date-container">{{date}}</div>\
	        <select data-type="hour">{{hours}}</select>\
	        :\
	        <select data-type="min">{{mins}}</select>\
	      </div>\
	    ',

	    'list.Modal': '\
	      <div class="bbf-list-modal">\
	        {{summary}}\
	      </div>\
	    '
	  }, {

	    //CLASSNAMES
	    error: 'error'

	  });
});