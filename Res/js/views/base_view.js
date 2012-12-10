/*
 * Base view for JQM 1.2.0
 */
define(['jquery',
        'backbone',
        'underscore',
        'jquery.mobile',
        'backbone.forms',
        'backbone.validation',
        'base_view',
        'forms_ext',
        'template'], 
  function($,Backbone,_) {
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
        	if(this.template_id) {
        		var self=this;
        		TemplateManager.get(this.template_id,function(template){
        			self.template=template;
        			self._render();
        		});
        	} else {
        		this._render();
        	}
        },
        
        _render: function() {
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
                role : this.role,
                transition: 'none'
            });            
        },
        
        _afterInit: function() {}
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

		events: {
			"click .back": "back"
		},
				
		render: function() {
			if(this.options.backLink)
		        $(this.el).append('<a class="back" data-icon="delete">'+Translation.get('generic.back')+'</a>');
	        $(this.el).append('<h1>'+this.options.headerText+'</h1>');
	        return this;
		},
		
		back: function() {
			app.navigate(this.options.backLink,{replace:true, trigger:true});			
		}
	});
	
	NavBarView=Backbone.View.extend({
		attributes : {
			"data-role" : "navbar"
		},
		render: function() {
	        $(this.el).append(new NavBarListView({model:this.model}).render().el);
	        return this;
		}
	});

	NavBarListView=Backbone.View.extend({
	    tagName: "ul",
		render: function() {
	        var self=this;
            _.each(self.model.models, function (item) {
                $(self.el).append(new NavBarListItemView({
                	model:item
                	}).render().el);
            }, self);
                        
            return this;
		}
	});

	NavBarListItemView=Backbone.View.extend({
	    tagName: "li",
	    initialize:function () {
	        this.template=_.template('<a href="<%= link %>"><%= text %></a>'),
	        this.model.bind("change", this.render, this);
	        this.model.bind("destroy", this.close, this);
	    },
		render: function() {
	        $(this.el).html(this.template(this.model.toJSON()));
	        return this;
		}
	});
	
	DialogHeaderView=Backbone.View.extend({
		attributes : {
			"data-role" : "header",
			"data-theme": "c"
		},
				
		render: function() {
	        $(this.el).append('<h1>'+this.options.headerText+'</h1>');
	        return this;
		}
	});
	
	DialogView=BasicView.extend({
        role: "dialog",
		headerText : 'Dialog Header',
				
        renderBasicView: function() {
        	$(this.el).append(new DialogHeaderView({
        		headerText: this.headerText
        	}).render().el);
        	$(this.el).append('<div data-role="content"/>');
        	this.contentEl=$('div[data-role="content"]',this.el);
        	this.renderContentView();
        },
        
        _render: function() {
            var $previousEl = $("#" + this.id);
            var alreadyInDom = $previousEl.length >= 0;
            if (alreadyInDom) {
                $previousEl.remove();
            };
        
            this.renderBasicView();
            
            $("body").append($(this.el));
            $("#" + this.id).dialog();
            $('[data-icon="delete"]',$(this.el)).hide();

            $.mobile.changePage("#" + this.id, {
                reverse : false,
                changeHash : false,
                role : this.role,
                transition: 'none'
            });
            
        }
        
	});
	
	DeleteDialogView=DialogView.extend({
	    
		initialize:function () {
			this.headerText=this.options.headerText;
			DeleteDialogView.__super__.initialize.apply(this);
	    },

	    events: {
			'click .delete': 'deleteObject',
			'click .back': 'back'
		},
	    
		renderContentView: function() {
			this.contentEl.append('<button type="submit" data-theme="b" class="delete">' + Translation.get('generic.delete')+'</button>');
			this.contentEl.append('<button class="back" data-rel="back" data-role="button">'+Translation.get('generic.cancel')+'</button>');
		},
		
		deleteObject: function() {
			var self=this;
			var loadMsgDelay = setTimeout(function() {
				$.mobile.showPageLoadingMsg();
			}, 1500 ),

			hideMsg = function() {
				clearTimeout( loadMsgDelay );
				$.mobile.hidePageLoadingMsg();
			};
			
			this.model.destroy({
				success:function(){
					console.log('delete success');
					hideMsg();
					app.clearCache();
					app.navigate(self.options.backLink,{replace:true, trigger:true});
				},
				error: function(reason) {
					console.log(reason);
					// Remove loading message.
					hideMsg();
					$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, reason, true );
					setTimeout( $.mobile.hidePageLoadingMsg, 1500 );
				}
			});
		},
		
		back: function() {
			app.navigate(this.options.backLink,{replace:true, trigger:true});			
		}
		
	});
	
	PageBasicView=BasicView.extend({
		headerText : 'Page Header',
				
		renderContentView: function() {
		},
		
        renderBasicView: function() {
        	$(this.el).append(new HeaderView({
        		backLink: this.backLink,
        		backText: this.backText,
        		headerText: this.headerText
        	}).render().el);
        	if(this.navlist) {
        		//console.log('render NavBar')
    			$(this.el).append(new NavBarView({model:this.navlist}).render().el);        		
        	}
        	$(this.el).append('<div data-role="content"/>');
        	this.contentEl=$('div[data-role="content"]',this.el);
        	this.renderContentView();
        	$(this.el).append(new FooterView().render().el);
        }		
	});
	
	
	FormBasicView=PageBasicView.extend({
		events: {
			'click .save': 'save'
		},
		
		createForm: function() {
			
		},
		
		renderContentView: function() {
	    	Backbone.Validation.bind(this);

	    	this.contentEl.append('<label class="error form-error" style="display:none" />');

	    	this.form=this.createForm();

	    	this.contentEl.append(this.form.render().el);
	        this.contentEl.append('<button type="submit" data-theme="b" class="save">'+Translation.get('generic.save')+'</button>');		    	
		},
		
		save: function() {
			if(!this.form.commit()) {
				var self=this;
				// This configurable timeout allows cached pages a brief delay to load without showing a message
				var loadMsgDelay = setTimeout(function() {
						$.mobile.showPageLoadingMsg();
					}, 1500 ),

				// Shared logic for clearing timeout and removing message.
				hideMsg = function() {
						clearTimeout( loadMsgDelay );
						$.mobile.hidePageLoadingMsg();
				};
				
				this.model.save(null, {
					success:function(){
						console.log('save success');
						hideMsg();
						app.clearCache();
						app.navigate(self.backLink,{replace:true, trigger:true});
					},
					error: function(reason) {
						console.log(reason);
						$("label.form-error").html(reason).attr("style","");
						// Remove loading message.
						hideMsg();
						$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, reason, true );
						setTimeout( $.mobile.hidePageLoadingMsg, 1500 );
				}});
			}
		}
		
	});
	
	JQMListView = Backbone.View.extend({
		tagname: 'ul',
		attributes: {
			'data-role': 'listview'
		},
		
		initialize: function () {
	        this.model.bind("reset", this.render, this);
	    },

	    render: function (eventName) {
	    	var self=this;
   			$(self.el).empty();
   			if(self.options.headerText) {
   				$(self.el).append('<li data-role="list-divider">'+self.options.headerText+'</li>');        	
   			};
	        return this;
	    },
	    renderList: function() {
	    	//console.log('renderList');
	    	var self=this;
       		TemplateManager.get(this.options.template,function(template){
       			$(self.el).empty();
       			if(self.options.headerText) {
       				$(self.el).append('<li data-role="list-divider">'+self.options.headerText+'</li>');        	
       			};
       			_.each(self.model.models, function (item) {
       				$(self.el).append(
       					new JQMListItemView({
       						model:item,
       						template:self.options.template,
       						create:self.options.create
       					}).render().el);
       				}, self);
       			self.refresh();
       		});
	    },	    
	    refresh: function() {
	    	try {
	    		//console.log('refresh list');
	    		$(this.el).listview('refresh');
	    	} catch(ex) {
	    		console.log('refresh list - error');
	    	}
	    }
	});

	JQMListItemView = Backbone.View.extend({
	    tagName:"li",
	    
	    initialize:function () {
	        this.model.bind("change", this.render, this);
	        this.model.bind("destroy", this.close, this);
	    },

	    render:function (eventName) {
	    	var self=this;
       		TemplateManager.get(this.options.template,function(template){
    			self.template=template;
    	        $(self.el).html(self.template(self.model.toJSON()));
    	        if(self.options.create) {
    	        	self.options.create($(self.el), self.model);
    	        }
    		});
    	
	        return this;
	    }
		
	});
	
	
});