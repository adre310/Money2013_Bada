/*
 * Models
 */

define(['jquery', 
        'backbone'],function() {
		
	window.API={};	
	window.API.BaseModel=Backbone.Model.extend({
	    save: function(key, value, options) {
	        console.log('save');
	        var attrs, current;

	        // Handle both `("key", value)` and `({key: value})` -style calls.
	        if (_.isObject(key) || key == null) {
	          attrs = key;
	          options = value;
	        } else {
	          attrs = {};
	          attrs[key] = value;
	        }
	        options = options ? _.clone(options) : {};
	        var method = this.isNew() ? 'create' : 'update';

	        return this.sync(method, this, options);
	    },
	    destroy: function(options) {
	        options = options ? _.clone(options) : {};

	        return this.sync('delete', this, options);
	    },
		sync: function(method, model, options) {
			console.log('BaseModel.sync('+method+')');
			if(method=='read') {
				options.url=Routing.generate(this.readUrl,{id:this.id});
				return Backbone.sync('read',model,options);
			} else {
				var url=null;
				if(method == 'create' || method == 'update') {
					url=Routing.generate(this.updateUrl);
				} else if(method=='delete') {
					url=Routing.generate(this.deleteUrl);
				}
				
			    var fn_success = options.success;
			    var fn_error = options.error;
				
				console.log('API.BaseModel url: '+url);
				return $.ajax({
					url : url,
					type: 'POST',
					dataType: 'json',
					data: JSON.stringify(this.toJSON()),
					success: function(data, textStatus, jqXHR) {
						console.log('API.BaseModel sync success');
						if(data.success) {
							console.log('return - success');
							if(fn_success)
								fn_success();
						} else {
							console.log('return - error: '+data.error);
							if(fn_error)
								fn_error(data.error);
						}
					}, 
					error:  function(jqXHR, textStatus, errorThrown) {
						console.log('API.BaseModel sync error - '+textStatus);
						if(fn_error)
							fn_error('error');
					}
				});
			}
		}
	});
	
	/*
	 * PAYS
	 */
	window.Pay=API.BaseModel.extend({
		readUrl: 'rest_api_v2_get_pay',
		updateUrl: 'rest_api_v2_post_pay_update',
		deleteUrl: 'rest_api_v2_post_pay_delete',
		defaults: {
			id: null,
			notes: '',
			style: 'c',
			account_id: 0
		},
		validation: {
			pay_value: [{
				required: true,
				msg: Translation.get('validate.required')				
			}, 
			{
				pattern: 'number',
				msg: Translation.get('validate.number')				
			}]
		}
	});

	window.PayList=Backbone.Collection.extend({
		url: function() {
			return Routing.generate('rest_api_v2_get_accounts_pays',{id:this.account_id});
		},
		model: Pay
	});
	
	/**
	 * ACCOUNTS
	 */
	window.Account=API.BaseModel.extend({
		readUrl: 'rest_api_v2_get_account',
		updateUrl: 'rest_api_v2_post_account_update',
		deleteUrl: 'rest_api_v2_post_account_delete',
		
		validation: {
			name: {
				required: true,
				msg: Translation.get('validate.required')				
			}
		},
		
		defaults: {
			id: null,
			name: '',
			notes: ''
		},
				
		toString: function() {
			return this.attributes.name;
		}
	});

	window.AccountList=Backbone.Collection.extend({
		url: function() {
			return Routing.generate('rest_api_v2_get_accounts');
		},
		model: Account
	});

	/**
	 * CATEGORY
	 */
	window.Category=API.BaseModel.extend({
		readUrl: 'rest_api_v2_get_category',
		updateUrl: 'rest_api_v2_post_category_update',
		deleteUrl: 'rest_api_v2_post_category_delete',	
		validation: {
			name: {
				required: true
			}
		},		
		defaults: {
			id: null,
			name: '',
			notes: ''
		},
		toString: function() {
			return this.attributes.name;
		}
	});

	window.CategoriesList=Backbone.Collection.extend({
		url: function() {
			return Routing.generate('rest_api_v2_get_categories');
		},
		model: Category
	});
	
	/*
	 * Currency Code
	 */
	window.CurrencyCode=Backbone.Model.extend({
		toString: function() {
			return this.attributes.name;
		}
	});
	
	window.CurrencyCodesList=Backbone.Collection.extend({
		url: function() {
			return Routing.generate('rest_api_v2_get_currency_codes');
		},
		model: CurrencyCode
	});
	
	window.CategoryStyleItem=Backbone.Model.extend({
		toString: function() {
			return this.attributes.text;
		}
	});
	
	window.CategoryStyleList=Backbone.Collection.extend({
		model: CategoryStyleItem
	});
	
});