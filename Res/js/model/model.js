/*
 * Models
 */

define(['jquery', 'backbone', 'backbone_ext'],function($, Backbone) {
	window.LoginModel=Backbone.Model.extend({
		url: function() {
			return Routing.generate('user_rest_api_v1_post_login');
		},
		validation: {
			login: {
				required: true
			}
		}
		
	});
	
	window.Pay=Backbone.Model.extend({
			
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
	
});