/*
 * Base view for JQM 1.2.0
 */
define(['jquery','backbone','underscore','jquery.mobile','backbone.forms','backbone.validation','base_view'],function($,Backbone,_) {
	BasicView=Backbone.View.extend({
		id: "BasicView",
        role: "page",
        attributes : function () {
            return {
                "data-role" : this.role,
                "id" : this.id
            };
        },
        
        initialize : function () {
            _.bindAll();
            this.render();
        },

        renderBasicView: function() {
        	
        },
        
        render: function() {
            var $previousEl = $("#" + this.id);
            var alreadyInDom = $previousEl.length >= 0;
            if (alreadyInDom) {
                $previousEl.remove();
            };
        
            this.renderBasicView();
            
            $("body").append($(this.el));
            $("#" + this.id).page();

            $.mobile.changePage("#" + this.id, {
                reverse : false,
                changeHash : false,
                role : this.role
            });            
        }		
	});

	FooterView=Backbone.View.extend({
		attributes : {
			"data-role" : "footer"
		},
		
		render: function() {
	        $(this.el).html("<h4>&copy; IAE Inc. 2011-2012</h4>");
	        return this;
		}
	}); 
	
	HeaderView=Backbone.View.extend({
		attributes : {
			"data-role" : "header"
		},
		
		render: function() {
			if(this.options.backLink)
		        $(this.el).append('<a href="'+this.options.backLink+' data-icon="delete">'+this.options.backText+'</a>');
	        $(this.el).append('<h1>'+this.options.headerText+'</h1>');
	        return this;
		}
	});
	
	PageBasicView=BasicView.extend({
		backLink: null,
		headerText : 'Page Header',
				
		renderContentView: function() {
			$contentEl.append('<h1>Content</h1>');
		},
		
        renderBasicView: function() {
        	$(this.el).append(new HeaderView({
        		backLink: this.backLink,
        		backText: this.backText,
        		headerText: this.headerText
        	}).render().el);
        	$(this.el).append('<div data-role="content"/>');
        	$contentEl=$('div[data-role="content"]',this.el);
        	this.renderContentView();
        	$(this.el).append(new FooterView().render().el);
        }		
	});
	
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