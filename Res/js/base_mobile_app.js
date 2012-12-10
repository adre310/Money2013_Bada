/*
 * Base Mobile Application AMD Version 
 *
*/

define(['jquery',
         'backbone',
         'underscore',
         'model',
         'views',
         'my-utils',
         'jquery.mobile'], function() {
	BaseMobileApp=Backbone.Router.extend({

		Accounts: function() {
			new AccountListPageView({model:this.getAccountList()});
		},
		AccountView: function(id) {
			var account=this.getAccountList().get(id);
			if(account) {
				new AccountPageView({model:account});
			} else {
				account=new Account({id:id});
				account.fetch({
					success: function() {
						console.log('account.fetch('+id+') - success');
						new AccountPageView({model:account});
					},
					error: function() {
						console.log('account.fetch('+id+') - error');
					}
				});
			}
		},
		AccountEdit: function(id) {
			var account=this.getAccountList().get(id);
			if(account) {
				new AccountEditPage({model:account});
			} else {
				account=new Account({id:id});
				account.fetch({
					success: function() {
						console.log('account.fetch('+id+') - success');
						new AccountEditPage({model:account});
					},
					error: function() {
						console.log('account.fetch('+id+') - error');
					}
				});
			}
		},
		AccountNew: function() {
			var account=new Account();
			new AccountNewPage({model:account});
		},
		AccountDelete: function(id) {
			var account=this.getAccountList().get(id);
			if(account) {
				new DeleteDialogView({
					model:account,
					headerText:Translation.get('account.delete')+' '+account.get('name'),
					backLink: '#account/list'});
			} else {
				account=new Account({id:id});
				account.fetch({
					success: function() {
						console.log('account.fetch('+id+') - success');
						new DeleteDialogView({
							model:account,
							headerText:Translation.get('account.delete')+' '+account.get('name'),
							backLink: '#account/list'});
					},
					error: function() {
						console.log('account.fetch('+id+') - error');
					}
				});
			}
		},
		
		PayEdit: function(id) {
			var pay=this.pay_list.get(id);
			if(pay) {
				new PayEditPage({model:pay});
			} else {
				pay=new Pay({id:id});
				pay.fetch({
					success: function() {
						console.log('pay.fetch('+id+') - success');
						new PayEditPage({model:pay});
					},
					error: function() {
						console.log('pay.fetch('+id+') - error');
					}
				});
			}
		},
		PayDelete: function(id) {
			var pay=this.pay_list.get(id);
			if(pay) {
				new DeleteDialogView({
					model:pay,
					headerText:Translation.get('pay.delete'),
					backLink: '#account/'+pay.get('account_id')+'/show'});
			} else {
				pay=new Pay({id:id});
				pay.fetch({
					success: function() {
						console.log('pay.fetch('+id+') - success');
						new DeleteDialogView({
							model:pay,
							headerText:Translation.get('pay.delete'),
							backLink: '#account/'+pay.get('account_id')+'/show'});
					},
					error: function() {
						console.log('pay.fetch('+id+') - error');
					}
				});
			}
		},
		
		PayNew: function(id) {
			var pay=new Pay({account_id:id});
			new PayEditPage({model:pay});
		},
		
		Categories: function() {
			new CategoryListPageView({model:this.getCategoriesList()});
		},
		CategoryEdit: function(id) {
			var category=this.getCategoriesList().get(id);
			if(category) {
				new CategoryEditPage({model:category});
			} else {
				category=new Category({id:id});
				category.fetch({
					success: function() {
						console.log('category.fetch('+id+') - success');
						new CategoryEditPage({model:category});
					},
					error: function() {
						console.log('category.fetch('+id+') - error');
					}
				});
			}
		},
		CategoryNew: function() {
			var category=new Category();
			new CategoryEditPage({model:category});
		},
		CategoryDelete: function(id) {
			var category=this.getCategoriesList().get(id);
			if(category) {
				new DeleteDialogView({
					model:category,
					headerText:Translation.get('category.delete')+' '+category.get('name'),
					backLink: '#category/list'});
			} else {
				var category=new Category({id:id});
				category.fetch({
					success: function() {
						console.log('category.fetch('+id+') - success');
						new DeleteDialogView({
							model:category,
							headerText:Translation.get('category.delete')+' '+category.get('name'),
							backLink: '#category/list'});
					},
					error: function() {
						console.log('category.fetch('+id+') - error');
					}
				});
			}
		},
		
		// Utils
		clearCache: function() {
			this.account_list=null;
			this.category_list=null;
			this.pay_list=null;
		},

		
		getAccountList: function() {
			if(this.account_list) {
				return this.account_list;
			} else {
				this.account_list=new AccountList();
				return this.account_list;
			}
		},
		
		getPayList: function(id) {
			console.log('get pay list '+id);
			if(this.pay_list && (this.pay_list.account_id == id)) {
				console.log('get pay list '+id+'(old)');
				return this.pay_list; 
			} else {
				console.log('get pay list '+id+'(new)');
	    		this.pay_list=new PayList();
	    		this.pay_list.account_id=id;
	    		this.pay_list.loaded=false;
				return this.pay_list; 
			}
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
	
	console.log(BaseMobileApp);
	return BaseMobileApp;
});