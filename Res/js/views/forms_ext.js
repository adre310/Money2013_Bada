/*
* Backbone forms extend
*/

define(['jquery',
        'backbone',
        'underscore',
        'jquery.mobile',
        'backbone.forms',
        'mobiscroll',
        /*'mobiscroll-datetime'*/],function() {
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
      tagName: 'input',
      attributes: {
			"type" : "text"
		},
    
    initialize: function(options) {
      
      Base.prototype.initialize.call(this, options);
      
      //Cast to Date
      if (this.value && !_.isDate(this.value)) {
    	  if(typeof this.value == 'string') {
    		  //console.log('convert iso8601 to Date '+this.value);
    		  this.value=Date.iso8601(this.value);
    		  //console.log('after convert to Date '+this.value);
    	  } else { 
    		  //console.log('convert to Date '+this.value);
    		  this.value = new Date(this.value);
    		  //console.log('after convert to Date '+this.value);
    	  }
      }
      
      //Set default date
      if (!this.value) {
        var date = new Date();
        date.setSeconds(0);
        date.setMilliseconds(0);
        
        this.value = date;
      }
    },

    render: function() {
      $(this.$el).scroller({ 
    	  preset: 'date',        
    	  theme: 'jqm',
          display: 'modal',
          mode: 'scroller',
          dateOrder: 'ddMy',
          dateFormat: 'dd MM y'
      });
      
      this.setValue(this.value);

      return this;
    },

    /**
    * @return {Date}   Selected date
    */
    getValue: function() {
      var date = this.$el.scroller('getDate');
      //console.log('getValue '+date);
      return date;
    },
    
    setValue: function(value) {
      $(this.$el).scroller('setDate', value, true);
      //console.log('setValue - '+value);
    }
  });

  /**
   * SELECT
   * 
   * Renders a <select> with given options
   *
   * Requires an 'options' value on the schema.
   *  Can be an array of options, a function that calls back with the array of options, a string of HTML
   *  or a Backbone collection. If a collection, the models must implement a toString() method
   */
  exports['jqm.select'] = Form.editors.Base.extend({

    tagName: 'select',
    
    events: {
      'change': function(event) {
        this.trigger('change', this);
      },
      'focus':  function(event) {
        this.trigger('focus', this);
      },
      'blur':   function(event) {
        this.trigger('blur', this);
      }
    },

    initialize: function(options) {
    	Form.editors.Base.prototype.initialize.call(this, options);

      if (!this.schema || !this.schema.options) throw "Missing required 'schema.options'";
    },

    render: function() {
      this.setOptions(this.schema.options);

      return this;
    },

    /**
     * Sets the options that populate the <select>
     *
     * @param {Mixed} options
     */
    setOptions: function(options) {
      var self = this;

      //If a collection was passed, check if it needs fetching
      if (options instanceof Backbone.Collection) {
        var collection = options;

        //Don't do the fetch if it's already populated
        if (collection.length > 0) {
          this.renderOptions(options);
        } else {
          collection.fetch({
            success: function(collection) {
              self.renderOptions(options);
            }
          });
        }
      }

      //If a function was passed, run it to get the options
      else if (_.isFunction(options)) {
        options(function(result) {
          self.renderOptions(result);
        });
      }

      //Otherwise, ready to go straight to renderOptions
      else {
        this.renderOptions(options);
      }
    },

    /**
     * Adds the <option> html to the DOM
     * @param {Mixed}   Options as a simple array e.g. ['option1', 'option2']
     *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
     *                      or as a string of <option> HTML to insert into the <select>
     */
    renderOptions: function(options) {
      var $select = this.$el,
          html;

      //Accept string of HTML
      if (_.isString(options)) {
        html = options;
      }

      //Or array
      else if (_.isArray(options)) {
        html = this._arrayToHtml(options);
      }

      //Or Backbone collection
      else if (options instanceof Backbone.Collection) {
        html = this._collectionToHtml(options);
      }

      //Insert options
      $select.html(html);

      //Select correct option
      this.setValue(this.value);
    },

    getValue: function() {
      return this.$el.val();
    },
    
    setValue: function(value) {
    	try {
    		this.$el.val(value).selectmenu('refresh');
    	} catch(e) {
    		this.$el.val(value);
    	}
    },
    
    focus: function() {
      if (this.hasFocus) return;

      this.$el.focus();
    },
    
    blur: function() {
      if (!this.hasFocus) return;

      this.$el.blur();
    },

    /**
     * Transforms a collection into HTML ready to use in the renderOptions method
     * @param {Backbone.Collection} 
     * @return {String}
     */
    _collectionToHtml: function(collection) {
      //Convert collection to array first
      var array = [];
      collection.each(function(model) {
        array.push({ val: _.escape(model.id), label: _.escape(model.toString()) });
      });

      //Now convert to HTML
      var html = this._arrayToHtml(array);

      return html;
    },

    /**
     * Create the <option> HTML
     * @param {Array}   Options as a simple array e.g. ['option1', 'option2']
     *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
     * @return {String} HTML
     */
    _arrayToHtml: function(array) {
      var html = [];

      //Generate HTML
      _.each(array, function(option) {
        if (_.isObject(option)) {
          var val = (option.val || option.val === 0) ? option.val : '';
          html.push('<option value="'+val+'">'+option.label+'</option>');
        }
        else {
          html.push('<option>'+option+'</option>');
        }
      });

      return html.join('');
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