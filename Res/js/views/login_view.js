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
			login: '',
			password: ''
		}		
	});
	
	RegisterModel=Backbone.Model.extend({
		defaults: {
			id: null,
			username: '',
			email: '',
			password: '',
			password_2: ''
		},		
		validation: {
			username: [{
				required: true,
				msg: Translation.get('fos_user.username.blank')				
			}, {
				minLength: 4,
				msg: Translation.get('fos_user.username.short')				
			}],
			email: [{
					required: true,
					msg: Translation.get('fos_user.email.blank')				
				},{
					pattern: 'email',
					msg: Translation.get('fos_user.email.invalid')
			    }],
			password: [{
					required: true,
					msg: Translation.get('fos_user.password.blank')				
				}, {
					minLength: 8,
					msg: Translation.get('fos_user.password.short')				
				}],
			password_2: [{
				required: true,
				msg: Translation.get('fos_user.password.blank')				
			}, {
				equalTo: 'password',
				msg: Translation.get('validate.equalTo')				
			}]
		}		
	});

	ResetModel=Backbone.Model.extend({
		defaults: {
			id: null,
			username: 'q12348'
		},		
		validation: {
			username: {
				required: true,
				msg: Translation.get('validate.required')				
			}
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
	        this.contentEl.append('<a href="#register" data-role="button">'+ Translation.get('registration.submit')+'</a>');
	        this.contentEl.append('<a href="#reset" data-role="button">'+ Translation.get('resetting.request.submit')+'</a>');
		},
		
		login: function() {
			console.log('login click');
			if(!this.form.commit()) {
							
				//$.mobile.loading( 'show' );
				//console.log("$.mobile.loading( 'show' )");
				
				$.ajax({
					url : Routing.generate('user_rest_api_v2_post_login'),
					type: 'POST',
					dataType: 'json',
					data: { 
						login: this.model.get('login'), 
						password: this.model.get('password') 
					},
					success: function(data, textStatus, jqXHR) {
						//$.mobile.loading( 'hide' );
						//console.log("$.mobile.loading( 'hide' )");
						console.log('login saved');
						if(data.success) {
							console.log('login saved - successfull');
							app.isLogin=true;
							app.navigate('account/list',{replace:true, trigger:true});							
						} else {
							_gaq.push(['_trackEvent','login', data.error]);
							console.log('login saved - error: '+data.error);
							$("label.form-error").html(data.error).attr("style","");							
						}
					},
					error:  function(jqXHR, textStatus, errorThrown) {
						_gaq.push(['_trackEvent','login', errorThrown]);
						console.log('error login saved');
						// Remove loading message.
						//$.mobile.loading( 'hide' );
						//console.log("$.mobile.loading( 'hide' )");
					} 
				});
			}			
		}
	});
	
	RegisterPageView=PageBasicView.extend({
		id: 'RegisterPageView',
		headerText : Translation.get('layout.register'),
		backLink: '#login',

		events: {
			"click .register": "register"
		},

		renderContentView: function() {
	    	Backbone.Validation.bind(this);
	        this.form = new Backbone.Form({
	        	model:this.model,
	        	schema: {
	        		username: { type: 'Text', title: Translation.get('form.username')},
	        		email: 	  { type: 'Text', title: Translation.get('form.email')},
	        		password: { type: 'Password', title: Translation.get('form.password')},
	        		password_2: { type: 'Password', title: Translation.get('form.password_confirmation')}
	        	}
	        }).render();
	        
	    	this.contentEl.append('<label class="error form-error" style="display:none"/>');
	        this.contentEl.append(this.form.el);
	        this.contentEl.append('<button type="submit" data-theme="b" class="register">'+Translation.get('registration.submit')+'</button>');	
		},
		
		register: function() {
			if(!this.form.commit()) {
				console.log('register valid');
				
				var self=this;
				
				$.ajax({
					url : Routing.generate('user_rest_api_v2_post_register'),
					type: 'POST',
					dataType: 'json',
					data: {
						username: this.model.get('username'),
						email: this.model.get('email'),
						password: this.model.get('password')
					},
					success: function(data, textStatus, jqXHR) {
						console.log('Register success');
						if(data.success) {
							console.log('Register success - successfull: '+data.error);
							self.contentEl.html(data.error);
							
						} else {
							_gaq.push(['_trackEvent','register', data.error]);
							console.log('Register success - error: '+data.error);
							$("label.form-error").html(data.error).show();
						}
					},
					error:  function(jqXHR, textStatus, errorThrown) {
						_gaq.push(['_trackEvent','register', errorThrown]);
						console.log('error register');
					} 
				});
				
			}
		}
	});
	
	ResetPageView=PageBasicView.extend({
		id: 'ResetPageView',
		headerText : Translation.get('resetting.request.submit'),
		backLink: '#login',

		events: {
			"click .reset": "reset"
		},

		renderContentView: function() {
	    	Backbone.Validation.bind(this);
	        this.form = new Backbone.Form({
	        	model:this.model,
	        	schema: {
	        		username:    { type: 'Text', title: Translation.get('form.username')},
	        	}
	        }).render();
	        
	    	this.contentEl.append('<label class="error form-error" style="display:none" />');
	        this.contentEl.append(this.form.el);
	        this.contentEl.append('<button type="submit" data-theme="b" class="reset">'+Translation.get('resetting.request.submit')+'</button>');	
		},
		
		reset: function() {
			console.log('reset click');
			if(!this.form.commit()) {
				var self=this;
							
				//$.mobile.loading( 'show' );
				//console.log("$.mobile.loading( 'show' )");
				
				$.ajax({
					url : Routing.generate('user_rest_api_v2_post_reset'),
					type: 'POST',
					dataType: 'json',
					data: { 
						username: this.model.get('username') 
					},
					success: function(data, textStatus, jqXHR) {
						//$.mobile.loading( 'hide' );
						//console.log("$.mobile.loading( 'hide' )");
						console.log('login saved');
						if(data.success) {
							console.log('login saved - successfull');
							self.contentEl.html(data.error);
						} else {
							_gaq.push(['_trackEvent','reset', data.error]);
							console.log('login saved - error: '+data.error);
							$("label.form-error").html(data.error).attr("style","");							
						}
					},
					error:  function(jqXHR, textStatus, errorThrown) {
						_gaq.push(['_trackEvent','reset', errorThrown]);
						console.log('error login saved');
						// Remove loading message.
						//$.mobile.loading( 'hide' );
						//console.log("$.mobile.loading( 'hide' )");
					} 
				});
			}			
		}
	});

});