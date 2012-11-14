/*
*  Mobile Views 
*/

define(['jquery','backbone','underscore','jquery.mobile','backbone.forms','backbone.validation','base_view','forms_ext'],function() {

	LoginPageView=PageBasicView.extend({
		id: 'LoginPageView',
		headerText : 'Login',

		events: {
			"click .login": "login"
		},

		renderContentView: function() {
	    	Backbone.Validation.bind(this);
	        this.form = new Backbone.Form({
	        	model:this.model,
	        	schema: {
	        		login:    { type: 'Text'},
	        		password: { type: 'Password'}
	        	}
	        }).render();
	        
	        this.contentEl.append(this.form.el);
	        this.contentEl.append('<button type="submit" data-theme="b" class="login">Login</button>');	
		},
		
		login: function() {
			console.log('login click');
			if(!this.form.commit()) {
							
				// This configurable timeout allows cached pages a brief delay to load without showing a message
				var loadMsgDelay = setTimeout(function() {
						$.mobile.showPageLoadingMsg();
					}, 1500 ),

				// Shared logic for clearing timeout and removing message.
				hideMsg = function() {

						// Stop message show timer
						clearTimeout( loadMsgDelay );

						// Hide loading message
						$.mobile.hidePageLoadingMsg();
				};
					
				$.ajax({
					url : Routing.generate('user_rest_api_v1_post_login'),
					type: 'POST',
					dataType: 'json',
					data: { 
						login: this.model.get('login'), 
						password: this.model.get('password') 
					},
					success: function(data, textStatus, jqXHR) {
						console.log('login saved');
						if(data.success) {
							console.log('login saved - successfull');
							hideMsg();
							app.isLogin=true;
							app.navigate('accounts',{replace:true, trigger:true});							
						} else {
							console.log('login saved - error: '+data.error);
							
							// Remove loading message.
							hideMsg();

							// show error message
							$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, data.error, true );

							// hide after delay
							setTimeout( $.mobile.hidePageLoadingMsg, 3000 );
						}
					},
					error:  function(jqXHR, textStatus, errorThrown) {
						console.log('error login saved');
						// Remove loading message.
						hideMsg();

						// show error message
						$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, $.mobile.pageLoadErrorMessage, true );

						// hide after delay
						setTimeout( $.mobile.hidePageLoadingMsg, 3000 );
					} 
				});
			}			
		}
	});
	
	AccountListPageView=PageBasicView.extend({
		id: 'AccountListPageView',
		headerText : 'Account List',

	    initialize:function () {
			console.log('AccountListPageView init');
	    	this.navlist=new Backbone.Collection;
	    	this.navlist.add([
	    	   {link:'#account/new',text:'New Account'},
	    	   {link:'#category/list',text:'Categories List'}
	    	   ]);
	    	AccountListPageView.__super__.initialize.apply(this);
	    },	
	    
		renderContentView: function() {
			console.log('AccountListPageView renderContentView');
	        
    		this.listView=new JQMListView({
    			model:this.model,
    			template:'account-list-item'
    			//headerText: 'Account List'
    		});
    		this.contentEl.append(this.listView.render().el);
	        
	        var self=this;
	        	        
	        this.model.fetch({
	        	success: function() {
	        		console.log('accounts loaded');
	        		self.listView.renderList();
	        	},
				error:  function() {
	        		console.log('accounts loaded - error');
	        	}
	        });
		},
        _afterInit: function() {
    		this.listView.refresh();
        }
	});
	
	AccountPageView=PageBasicView.extend({
		id: 'AccountPageView',
		template_id: 'account-view-page',
		backLink: '#accounts',

		initialize: function () {
			console.log('AccountPageView init');
			
			this.headerText='Account '+this.model.get('name');

	    	this.navlist=new Backbone.Collection;
	    	this.navlist.add([
	    	   {link:'#pay/'+this.model.get('id')+'/new',text:'New Payment'},
	    	   {link:'#account/'+this.model.get('id')+'/edit',text:'Edit Account'},
	    	   {link:'#account/'+this.model.get('id')+'/delete',text:'Delete Account'}
	    	   ]);
	    	AccountPageView.__super__.initialize.apply(this);
	    },	
		renderContentView: function() {
			this.contentEl.append(this.template(this.model.toJSON()));
    		
    		var self=this;
    		this.paylist=new PayList();
    		this.paylist.account_id=this.model.get('id');

    		this.listView=new JQMListView({
    			model:this.paylist,
    			template:'pay-list-item',
    			headerText: 'Payments List',
            	create: function(el,model) {
            		el.attr('data-theme', model.get('style'));        		
            	}    			
    		});    		
    		this.contentEl.append(this.listView.render().el);
    		
    		this.paylist.fetch({
	        	success: function() {
	        		console.log('pays loaded');
	        		self.listView.renderList();
	        	},
				error:  function() {
	        		console.log('pays loaded - error');
	        	}
	        });
		},
        _afterInit: function() {
    		this.listView.refresh();
        }
	});
	
	PayEditPage=PageBasicView.extend({
		id: 'PayEditPage',
		headerText: 'Edit Payment',

		events: {
			'click .save': 'save'
		},

		initialize: function () {
			//console.log('PayEditPage init ->');
			
			this.backLink='#account/'+this.model.get('account_id')+'/show';

	    	this.navlist=new Backbone.Collection;
	    	this.navlist.add([
	    	   {link:'#pay/'+this.model.get('id')+'/delete',text:'Delete payment'}
	    	   ]);
	    	PayEditPage.__super__.initialize.apply(this);
			//console.log('PayEditPage init <-');
	    },	
		renderContentView: function() {
			//console.log('PayEditPage renderContentView ->');
	    	Backbone.Validation.bind(this);
	        this.form = new Backbone.Form({
	        	model:this.model,
	        	schema: {
	        		pay_value:    { type: 'Text'},
	        		pay_date:     { type: 'mobiscroll.Date'},
	        		category_id:  { type: 'jqm.select', options: app.getCategoriesList()},
	        		notes:        { type: 'TextArea'}
	        	}
	        }).render();
	        
	        this.contentEl.append(this.form.el);
	        this.contentEl.append('<button type="submit" data-theme="b" class="save">Save</button>');	
			//console.log('PayEditPage renderContentView <-');
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
						
						app.navigate(self.backLink,{replace:true, trigger:true});
					},
					error: function(reason) {
						console.log(reason);
						// Remove loading message.
						hideMsg();
						$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, reason, true );
						setTimeout( $.mobile.hidePageLoadingMsg, 3000 );
				}});
			}
		}
	});
});