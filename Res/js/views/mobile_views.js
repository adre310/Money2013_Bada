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
				var self_model=this.model;
				this.model.save(null, {
					success:function(){
						app.navigate('accounts',{replace:true, trigger:true});
					}});
			}			
		}
	});
});