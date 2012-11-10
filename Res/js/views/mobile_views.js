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
	        
	        $contentEl.append(this.form.el);
	        $contentEl.append('<button type="submit" data-theme="b" class="login">Login</button>');	
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
		template_id: 'account-page',

	    initialize:function () {
			console.log('AccountListPageView init');
	    	this.navlist=new Backbone.Collection;
	    	this.navlist.add([
	    	   {link:'#account/new',text:'New Account'},
	    	   {link:'#category/list',text:'Categories List'}
	    	   ]);
	    	AccountListPageView.__super__.initialize.apply(this);
	    	/*
            _.bindAll();
            this.render();
            */
	    },	
	    
		renderContentView: function() {
			console.log('AccountListPageView renderContentView');
			$contentEl.append(new NavBarView({model:this.navlist}).render().el);
	        $contentEl.append(this.template(this.model.toJSON()));
	        
	        this.model.fetch({
	        	success: function() {
	        		console.log('accounts loaded');
	        	},
	        	error: function() {
	        		console.log('accounts loaded - error');
	        	}
	        });
		} 	    
	});
	
});