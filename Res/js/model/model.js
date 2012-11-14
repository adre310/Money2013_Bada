/*
 * Models
 */

define(['jquery', 'backbone', /*'backbone_ext'*/],function() {
	window.LoginModel=Backbone.Model.extend({
		url: function() {
			return Routing.generate('user_rest_api_v1_post_login');
		},
		validation: {
			login: {
				required: true
			}
		},
		defaults: {
			id: null,
			login: 'demo',
			password: 'demo'
		}
		
	});
	window.API={};
	
	window.API.BaseModel=Backbone.Model.extend({
		sync: function(method, model, options) {
			console.log('BaseModel.sync('+method+')');
			if(method=='read') {
				options.url=Routing.generate(this.readUrl,{id:this.id});
				return Backbone.sync('read',model,options);
			} else if(method == 'create' || method == 'update') {
				options.url=Routing.generate(this.updateUrl);
				return Backbone.sync('create',model,options);
			} else if(method=='delete') {
				options.url=Routing.generate(this.deleteUrl);
				return Backbone.sync('create',model,options);
			}
		}
	});
	
	/*
	 * PAYS
	 */
	window.Pay=API.BaseModel.extend({
		readUrl: 'rest_api_v1_get_pay',
		updateUrl: 'rest_api_v1_post_pay_update',
		deleteUrl: 'rest_api_v1_post_delete',
		defaults: {
			id: null,
			notes: '',
			style: 'c',
			account_id: 0
		},
		validation: {
			pay_value: {
				required: true,
				pattern: 'number'
			}
		}
	});

	window.PayList=Backbone.Collection.extend({
		url: function() {
			return Routing.generate('rest_api_v1_get_accounts_pays',{id:this.account_id});
		},
		model: Pay
	});
	
	/**
	 * ACCOUNTS
	 */
	window.Account=Backbone.Model.extend({
		url: function() {
			return this.isNew()?Routing.generate('rest_api_v1_post_account'):Routing.generate('rest_api_v1_get_account',{id:this.id});
		},
		
		validation: {
			name: {
				required: true
			}
		},
		
		defaults: {
			id: null,
			name: '',
			notes: '',
			balance: '123'
		},
		
		getPayList: function() {
			if(this.pay_list && this.pay_list.length>0) {
				return this.pay_list; 
			} else {
	            this.pay_list = new PayList();
	            this.pay_list.account_id=this.id;
				return this.pay_list;			
			}			
		},
		
		loadPays: function(callback) {
	        if (this.pay_list) {
	            if (callback) callback();
	        } else {
	            this.pay_list = new PayList();
	            this.pay_list.account_id=this.id;
	            this.pay_list.fetch({success:function () {
	                if (callback) callback();
	            }});
	        }		
			
		},
		
		toString: function() {
			return this.attributes.name;
		}
	});

	window.AccountList=Backbone.Collection.extend({
		url: function() {
			return Routing.generate('rest_api_v1_get_accounts');
		},
		model: Account
	});

	/**
	 * CATEGORY
	 */
	window.Category=Backbone.Model.extend({
		url: function() {
			return this.isNew()?Routing.generate('rest_api_v1_post_category'):Routing.generate('rest_api_v1_get_category',{id:this.id});
		},	
		validation: {
			name: {
				required: true
			}
		},		
		defaults: {
			id: null,
			name: ''
		},
		toString: function() {
			return this.attributes.name;
		}
	});

	window.CategoriesList=Backbone.Collection.extend({
		url: function() {
			return Routing.generate('rest_api_v1_get_categories');
		},
		model: Category
	});
	
});