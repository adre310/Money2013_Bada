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
         'my-utils'], function() {
	var App = Backbone.Router.extend({
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
			
			/* PAYS */
			"pay/:id": "PayEdit",
			"pay/:id/new": "PayNew",
			"pay/:id/delete": "PayDelete",
			
			/* Categories */
			"category/list": "Categories",
			"category/:id/edit": "CategoryEdit",
			"category/new": "CategoryNew",
			"category/:id/delete": "CategoryDelete"
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
		},
		AccountView: function(id) {
			var account=new Account({id:id});
			//$.mobile.loading( 'show' );
			account.fetch({
				success: function() {
					console.log('account.fetch('+id+') - success');
					//$.mobile.loading( 'hide' );
					new AccountPageView({model:account});
				},
				error: function() {
					//$.mobile.loading( 'hide' );
					console.log('account.fetch('+id+') - error');
				}
			});
		},
		AccountEdit: function(id) {
			var account=new Account({id:id});
			//$.mobile.loading( 'show' );
			account.fetch({
				success: function() {
					console.log('account.fetch('+id+') - success');
					//$.mobile.loading( 'hide' );
					new AccountEditPage({model:account});
				},
				error: function() {
					console.log('account.fetch('+id+') - error');
					//$.mobile.loading( 'hide' );
				}
			});			
		},
		AccountNew: function() {
			var account=new Account();
			new AccountNewPage({model:account});
		},
		AccountDelete: function(id) {
			var account=new Account({id:id});
			//$.mobile.loading( 'show' );
			account.fetch({
				success: function() {
					console.log('account.fetch('+id+') - success');
					//$.mobile.loading( 'hide' );
					new DeleteDialogView({
						model:account,
						headerText:Translation.get('account.delete')+' '+account.get('name'),
						backLink: '#accounts'});
				},
				error: function() {
					//$.mobile.loading( 'hide' );
					console.log('account.fetch('+id+') - error');
				}
			});			
		},
		
		PayEdit: function(id) {
			var pay=new Pay({id:id});
			//$.mobile.loading( 'show' );
			pay.fetch({
				success: function() {
					console.log('pay.fetch('+id+') - success');
					//$.mobile.loading( 'hide' );
					new PayEditPage({model:pay});
				},
				error: function() {
					//$.mobile.loading( 'hide' );
					console.log('pay.fetch('+id+') - error');
				}
			});
		},
		PayDelete: function(id) {
			var pay=new Pay({id:id});
			//$.mobile.loading( 'show' );
			pay.fetch({
				success: function() {
					console.log('pay.fetch('+id+') - success');
					//$.mobile.loading( 'hide' );
					new DeleteDialogView({
						model:pay,
						headerText:Translation.get('pay.delete'),
						backLink: '#account/'+pay.get('account_id')+'/show'});
				},
				error: function() {
					//$.mobile.loading( 'hide' );
					console.log('pay.fetch('+id+') - error');
				}
			});
		},
		
		PayNew: function(id) {
			var pay=new Pay({account_id:id});
			new PayEditPage({model:pay});
		},
		
		Categories: function() {
			new CategoryListPageView({model:this.getCategoriesList()});
		},
		CategoryEdit: function(id) {
			var category=new Category({id:id});
			//$.mobile.loading( 'show' );
			category.fetch({
				success: function() {
					console.log('category.fetch('+id+') - success');
					//$.mobile.loading( 'hide' );
					new CategoryEditPage({model:category});
				},
				error: function() {
					console.log('category.fetch('+id+') - error');
					//$.mobile.loading( 'hide' );
				}
			});
		},
		CategoryNew: function() {
			var category=new Category();
			new CategoryEditPage({model:category});
		},
		CategoryDelete: function(id) {
			var category=new Category({id:id});
			//$.mobile.loading( 'show' );
			category.fetch({
				success: function() {
					console.log('category.fetch('+id+') - success');
					//$.mobile.loading( 'hide' );
					new DeleteDialogView({
						model:category,
						headerText:Translation.get('category.delete')+' '+category.get('name'),
						backLink: '#category/list'});
				},
				error: function() {
					//$.mobile.loading( 'hide' );
					console.log('category.fetch('+id+') - error');
				}
			});
		},
		
		// Utils
		getAccountList: function() {
			if(this.account_list) {
				return this.account_list;
			} else {
				this.account_list=new AccountList();
				return this.account_list;
			}
		},
		
		clearCache: function() {
			this.account_list=null;
			this.category_list=null;
		},
		
		getCategoriesList: function() {
			if(this.category_list) {
				return this.category_list;
			} else {
				this.category_list=new CategoriesList();
				return this.category_list;
			}
		},
		
		getCurrencyCodes: function() {
			if(this.currency_codes) {
				return this.currency_codes;
			} else {
				this.currency_codes=new CurrencyCodesList();
				return this.currency_codes;
			}
		},
		
		getStyleList: function() {
			if(this.style_list) {
				return this.style_list;
			} else {
				this.style_list=new CategoryStyleList();

				var i=0;
				while(i<6) {
					this.style_list.add(new CategoryStyleItem({id: i,text: Translation.get('style.'+i)}));
					i++;
				}
				
				return this.style_list;
			}
		}
		
	});
	
	
    $(function () {
    	Routing.setBaseUrl(window.WEB_ROOT);
        app=new App();
        Backbone.history.start({ pushState : false });
    });
	
});