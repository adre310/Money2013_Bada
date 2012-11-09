/*
 * Mobile Application AMD Version 
 *
*/

require(['jquery', 'backbone','underscore','model','views','jquery.mobile'], function($,Backbone,_) {
	var App = Backbone.Router.extend({
		isLogin : false,
		
		routes: {
			"" : "Accounts",
			
			/* ACCOUNTS */
			"accounts" : "Accounts",
//			"account/:id/show" : "AccountView",
//			"account/new" : "AccountNew",
//			"account/:id/edit" : "AccountEdit",
//			"account/:id/delete" : "AccountDelete",
			
			/* PAYS */
//			"pay/:id": "PayEdit",
//			"pay/:id/new": "PayNew",
//			"pay/:id/delete": "PayDelete",
			
			/* Categories */
//			"categories": "Categories",
//			"category/:id": "CategoryEdit",
//			"category/new": "CategoryNew",
		},

		Accounts: function() {
			console.log('Accounts');
			if(this.isLogin) {
				var accountList=new AccountList();
				new AccountListPageView({model:accountList});
			} else {
				var loginModel=new LoginModel();
				new LoginPageView({model:loginModel});				
			}
		},
	});
	
	
    $(function () {
    	Routing.setBaseUrl('https://172.26.10.23:9443/Money2013/web/app_dev.php');
        app=new App();
        Backbone.history.start({ pushState : false });
    });
	
});