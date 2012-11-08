/*
*  Mobile Views 
*/

define(['jquery','backbone','underscore','jquery.mobile','backbone.forms','backbone.validation','base_view'],function($,Backbone,_) {

	LoginPageView=PageBasicView.extend({
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
			console.log('login click')
			if(!this.form.commit()) {
				$.mobile.showPageLoadingMsg();
				$.ajax({
					url: Routing.generate('user_rest_api_v1_post_login'),
					type: 'POST',
					data: {
						_login: this.model.get('login'),
						_password: this.model.get('password')
					},
					success: function(data, textStatus, jqXHR) {
						console.log(data);
						$.mobile.hidePageLoadingMsg();						
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log('login error: '+textStatus);
						
						$.mobile.hidePageLoadingMsg();
						
						// show error message
						$.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, $.mobile.pageLoadErrorMessage, true );

						// hide after delay
						setTimeout( $.mobile.hidePageLoadingMsg, 1500 );						
					}
				});

				console.log('end');
				/*
				var self_model=this.model;
				this.model.save(null, {
					success:function(){
						app.navigate('accounts',{replace:true, trigger:true});
					}});
				*/
			}			
		}
	});
});