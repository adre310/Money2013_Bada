/*
*  Mobile Views 
*/

define(['jquery',
        'backbone',
        'underscore',
        'jquery.mobile',
        'backbone.forms',
        'backbone.validation',
        'base_view',
        'forms_ext'],function() {

	
	LoginModel=Backbone.Model.extend({
		validation: {
			login: {
				required: true,
				msg: Translation.get('validate.required')				
			}
		},
		defaults: {
			id: null,
			login: 'demo',
			password: 'demo'
		}
		
	});

	LoginPageView=PageBasicView.extend({
		id: 'LoginPageView',
		headerText : Translation.get('layout.login'),

		events: {
			"click .login": "login"
		},

		renderContentView: function() {
	    	Backbone.Validation.bind(this);
	        this.form = new Backbone.Form({
	        	model:this.model,
	        	schema: {
	        		login:    { type: 'Text', title: Translation.get('form.username')},
	        		password: { type: 'Password', title: Translation.get('form.password')}
	        	}
	        }).render();
	        
	    	this.contentEl.append('<label class="error form-error" style="display:none" />');
	        this.contentEl.append(this.form.el);
	        this.contentEl.append('<button type="submit" data-theme="b" class="login">'+Translation.get('security.login.submit')+'</button>');	
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
					url : Routing.generate('user_rest_api_v2_post_login'),
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
							app.navigate('account/list',{replace:true, trigger:true});							
						} else {
							console.log('login saved - error: '+data.error);
							$("label.form-error").html(data.error).attr("style","");
							
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
	
});