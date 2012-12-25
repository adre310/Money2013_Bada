/*
 * Mobile Application AMD Version 
 *
*/

require(['jquery',
         'jquery.mobile',
         'backbone',
         'underscore',
         'model',
         'views',
         'login',
         'my-utils',
         'base_app'], function() {
	MobileApp = BaseMobileApp.extend({
		isLogin : false,
		
		routes: {
			"" : "Login",
			"login" : "Login",
			"register" : "Register",
			"reset" : "Reset",
			
			/* ACCOUNTS */
			"account/list" : "Accounts",
			"account/:id/show" : "AccountView",
			"account/new" : "AccountNew",
			"account/:id/edit" : "AccountEdit",
			"account/:id/delete" : "AccountDelete",
			"account/:id/transfer"  : "AccountTransfer",
			"account/:id/merge"  : "AccountMerge",
			
			/* PAYS */
			"pay/:id": "PayEdit",
			"pay/:id/new": "PayNew",
			"pay/:id/delete": "PayDelete",
			
			/* Categories */
			"category/list": "Categories",
			"category/:id/edit": "CategoryEdit",
			"category/new": "CategoryNew",
			"category/:id/delete": "CategoryDelete",
			
			"charts" : "Charts"
		},

		Login: function() {
			new LoginPageView({model:new LoginModel()});
		},
		Register: function() {
			new RegisterPageView({model:new RegisterModel()});
		},
		Reset: function() {
			new ResetPageView({model:new ResetModel()});
		},
		
		
		Accounts: function() {
			if(this.isLogin) {
				new AccountListPageView({model:this.getAccountList()});
			} else {
				new LoginPageView({model:new LoginModel()});
			}
		}	
		});
	
	
    $(function () {
    	Routing.setBaseUrl(window.WEB_ROOT);
        app=new MobileApp();
        Backbone.history.start({ pushState : false });
    });
	
});