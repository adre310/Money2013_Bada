/*
* Backbone forms extend
*/

define(['jquery','backbone','underscore','jquery.mobile','backbone.forms'],function() {

	/**
	 * Include this file _after_ the main backbone-forms file to override the default templates.
	 * You only need to include templates you want to override.
	 * 
	 * Requirements when customising templates:
	 * - Each template must have one 'parent' element tag.
	 * - "data-type" attributes are required.
	 * - The main placeholder tags such as the following are required: fieldsets, fields
	 */
	;(function() {
	  var Form = Backbone.Form,
	      editors = Form.editors;


	  Form.setTemplates({

	    //HTML
	    form: '\
	      <form >{{fieldsets}}</form>\
	    ',

	    fieldset: '\
	      <fieldset>\
	        <legend>{{legend}}</legend>\
	        {{fields}}\
	      </fieldset>\
	    ',

	    field: '\
	    	<div data-role="fieldcontain">\
	        <label class="control-label" for="{{id}}">{{title}}</label>\
	        {{editor}}\
	    	<label class="error"\>{{error}}</label>\
	        </div>\
	    ',

	    nestedField: '\
	      <div class="field-{{key}}">\
	        <div title="{{title}}" class="input-xlarge">{{editor}}</div>\
	        <div class="help-block">{{help}}</div>\
	      </div>\
	    ',

	    list: '\
	      <div class="bbf-list">\
	        <ul class="unstyled clearfix">{{items}}</ul>\
	        <button type="button" class="btn bbf-add" data-action="add">Add</div>\
	      </div>\
	    ',

	    listItem: '\
	      <li class="clearfix">\
	        <div class="pull-left">{{editor}}</div>\
	        <button type="button" class="btn bbf-del" data-action="remove">&times;</button>\
	      </li>\
	    ',

	    'list.Modal': '\
	      <div class="bbf-list-modal">\
	        {{summary}}\
	      </div>\
	    '
	  }, {
	  
	    //CLASSNAMES
	    error: 'error' //Set on the field tag when validation fails
	  });

	  /**
	   * DATE
	   *
	   * Schema options
	   * @param {Number|String} [options.schema.yearStart]  First year in list. Default: 100 years ago
	   * @param {Number|String} [options.schema.yearEnd]    Last year in list. Default: current year
	   *
	   * Config options (if not set, defaults to options stored on the main Date class)
	   * @param {Boolean} [options.showMonthNames]  Use month names instead of numbers. Default: true
	   * @param {String[]} [options.monthNames]     Month names. Default: Full English names
	   */
	  editors.Date = editors.Base.extend({
		  	tagName: 'input',
		  
		    initialize: function(options) {
		    	editors.Base.prototype.initialize.call(this, options);
		        
		        //Cast to Date
		        if (this.value && !_.isDate(this.value)) {
		          this.value = Date.iso8601(this.value);
		        }
		        
		        //Set default date
		        if (!this.value) {
		          var date = new Date();
		          //date.setSeconds(0);
		          //date.setMilliseconds(0);
		          
		          this.value = date;
		        }
		      },
		      
		      render: function() {
		        //var $el = this.$el;

		        //$el.html('<input>');

		        //var input = $('input', $el);

		        this.$el.scroller({
					 dateFormat: 'yy-mm-dd',
					 dateOrder: 'yymmdd'
		        });
		        
		        this.setValue(this.value);
		        
		        return this;
		      },

		      /**
		      * @return {Date}   Selected date
		      */
		      getValue: function() {
		        var date = this.$el.scroller('getDate');

		        return date;
		      },
		      
		      setValue: function(value) {
		    	  this.$el.scroller('setDate', value, true);
		      },
		      
		      focus: function() {
		        if (this.hasFocus) return;
		        
		        this.$el.scroller('show');
		      },
		      
		      blur: function() {
		        if (!this.hasFocus) return;
		        
		        this.$el.scroller('hide');
		      },
		      
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
	  editors.Select = editors.Base.extend({

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
	      editors.Base.prototype.initialize.call(this, options);

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
	        	if(!collection.is_loading) {
	        		collection.is_loading=true;
	        		collection.fetch({
	        			success: function(collection) {
	        				self.renderOptions(options);
	        			}
	        		});
	        	} else {
	                this.renderOptions(options);
	        	}
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
	        html = this._collectionToHtml(options)
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
	        array.push({ val: model.id, label: model.toString() });
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
	          var val = option.val ? option.val : '';
	          html.push('<option value="'+val+'">'+option.label+'</option>');
	        }
	        else {
	          html.push('<option>'+option+'</option>');
	        }
	      });

	      return html.join('');
	    }

	  });
	  
	})();
	
});