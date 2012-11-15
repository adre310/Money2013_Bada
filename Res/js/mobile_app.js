/*
 * Mobile Application AMD Version 
 *
*/

require(['jquery',
         'backbone',
         'underscore',
         'model',
         'views',
         'my-utils',
         'jquery.mobile'], function($,Backbone,_) {
	var App = Backbone.Router.extend({
		isLogin : false,
		
		routes: {
			"" : "Accounts",
			
			/* ACCOUNTS */
			"accounts" : "Accounts",
			"account/:id/show" : "AccountView",
//			"account/new" : "AccountNew",
//			"account/:id/edit" : "AccountEdit",
//			"account/:id/delete" : "AccountDelete",
			
			/* PAYS */
			"pay/:id": "PayEdit",
			"pay/:id/new": "PayNew",
//			"pay/:id/delete": "PayDelete",
			
			/* Categories */
//			"categories": "Categories",
//			"category/:id": "CategoryEdit",
//			"category/new": "CategoryNew",
		},

		Accounts: function() {
			if(this.isLogin) {
				var accountList=new AccountList();
				new AccountListPageView({model:accountList});
			} else {
				var loginModel=new LoginModel();
				new LoginPageView({model:loginModel});				
			}
		},
		AccountView: function(id) {
			var account=new Account({id:id});
			account.fetch({
				success: function() {
					console.log('account.fetch('+id+') - success');
					new AccountPageView({model:account});
				},
				error: function() {
					console.log('account.fetch('+id+') - error');
				}
			});
		},
		
		PayEdit: function(id) {
			var pay=new Pay({id:id});
			pay.fetch({
				success: function() {
					console.log('pay.fetch('+id+') - success');
					new PayEditPage({model:pay});
				},
				error: function() {
					console.log('pay.fetch('+id+') - error');
				}
			});
		},
		
		PayNew: function(id) {
			var pay=new Pay({account_id:id});
			new PayEditPage({model:pay});
		},
		
		// Utils
		getCategoriesList: function() {
			var collection=new CategoriesList();
			return collection;
		}
		
	});
	
	
    $(function () {
    	Routing.setBaseUrl('https://172.26.10.23:9443/Money2013/web/app_dev.php');
        app=new App();
        Backbone.history.start({ pushState : false });
    });
	
});