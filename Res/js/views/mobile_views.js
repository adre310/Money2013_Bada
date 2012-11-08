/*
*  Mobile Views 
*/

define([],function() {
	window.JQMListView = Backbone.View.extend({

		initialize: function () {
	        this.model.bind("reset", this.render, this);
	    },

	    render: function (eventName) {
	        $(this.el).empty();
	        if(this.options.headerText) {
	            $(this.el).append('<li data-role="list-divider">'+this.options.header+'</li>');        	
	        };

	        var self=this;
	        
	        this.loadCollection(function() {
	            _.each(self.model.models, function (item) {
	                $(self.el).append(new JQMListItemView({
	                	model:item,
	                	template:self.options.template,
	                	create:self.options.create,
	                	}).render().el);
	            }, self);
	            try {
	                $(self.el).listview('refresh');            	
	            } catch(excp) {
	            	
	            }
	        });
	        
	        return this;
	    },
	    
	    loadCollection: function(callback) {
	    	if(this.model.length>0) {
	    		console.log('JQMListView.loadCollection collection is not empty');
	    		callback();
	    	} else {
	    		console.log('JQMListView.loadCollection collection is empty.');
	    		if(!this.model.is_loading) {
	    			this.model.is_loading=true;
	    			this.model.fetch({
	    				success: function() {
	    		    		console.log('JQMListView.loadCollection fetch collection');
	    					callback();
	    				}
	    			});
	    		} else {
	        		console.log('JQMListView.loadCollection collection is empty and fetching.');
	    			callback();
	    		}
	    	}
	    }
		
	});

	window.JQMListItemView = Backbone.View.extend({
	    tagName:"li",
	    
	    initialize:function () {
	        this.template=_.template($('#'+this.options.template).html()),
	        this.model.bind("change", this.render, this);
	        this.model.bind("destroy", this.close, this);
	    },

	    render:function (eventName) {
	        $(this.el).html(this.template(this.model.toJSON()));
	        if(this.options.create) {
	        	this.options.create($(this.el), this.model);
	        }
	        return this;
	    }
		
	});
	
});