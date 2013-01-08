/*
 * Models
 */

define(['jquery', 
        'backbone'],function() {
		
	window.API={};	
	window.API.BaseModel=Backbone.Model.extend({
		toSendData: function() {
			return {};
		},
	    save: function(key, value, options) {
	        //console.log('save');
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
			//console.log('BaseModel.sync('+method+')');
			if(method=='read') {
				options.url=Routing.generate(this.readUrl,{id:this.id});
				return Backbone.sync('read',model,options);
			} else {
				var url=null;
				if(method == 'create' || method == 'update') {
					url=Routing.generate(this.updateUrl);
				} else if(method=='delete') {
					url=Routing.generate(this.deleteUrl,{id:this.id});
				}
				
			    var fn_success = options.success;
			    var fn_error = options.error;
				
				//console.log('API.BaseModel url: '+url);
				return $.ajax({
					url : url,
					type: 'POST',
					dataType: 'json',
					data: this.toSendData(),
					success: function(data, textStatus, jqXHR) {
						//console.log('API.BaseModel sync success');
						if(data.success) {
							//console.log('return - success');
							if(fn_success)
								fn_success();
						} else {
							_gaq.push(['_trackEvent','sync-'+method, data.error]);
							//console.log('return - error: '+data.error);
							if(fn_error)
								fn_error(data.error);
						}
					}, 
					error:  function(jqXHR, textStatus, errorThrown) {
						_gaq.push(['_trackEvent','sync-'+method, errorThrown]);
						//console.log('API.BaseModel sync error - '+textStatus);
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
		readUrl: 'rest_api_v3_get_pay',
		updateUrl: 'rest_api_v3_post_pay_update',
		deleteUrl: 'rest_api_v3_post_pay_delete',
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
		},
		toSendData: function() {
			if(typeof this.attributes.pay_date == 'string') {
				this.attributes.pay_date=Date.iso8601(this.attributes.pay_date);
	    	 };
	    	 
			return {
				id: this.attributes.id,
				notes: this.attributes.notes,
				pay_value: this.attributes.pay_value,
				pay_date: this.attributes.pay_date.toJSON(),
				category_id: this.attributes.category_id,
				account_id: this.attributes.account_id
			};
		},

	});

	window.PayList=Backbone.Collection.extend({
		url: function() {
			return Routing.generate('rest_api_v3_get_accounts_pays',{id:this.account_id});
		},
		model: Pay
	});
	
	/**
	 * ACCOUNTS
	 */
	window.Account=API.BaseModel.extend({
		readUrl: 'rest_api_v3_get_account',
		updateUrl: 'rest_api_v3_post_account_update',
		deleteUrl: 'rest_api_v3_post_account_delete',
		
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
		toSendData: function() {
	    	 return {
				id: this.attributes.id,
				notes: this.attributes.notes,
				name: this.attributes.name,
				currency: this.attributes.currency,
			};
		},
				
		toString: function() {
			return this.attributes.name;
		}
	});

	window.AccountList=Backbone.Collection.extend({
		url: function() {
			return Routing.generate('rest_api_v3_get_accounts');
		},
		model: Account
	});

	/**
	 * CATEGORY
	 */
	window.Category=API.BaseModel.extend({
		readUrl: 'rest_api_v3_get_category',
		updateUrl: 'rest_api_v3_post_category_update',
		deleteUrl: 'rest_api_v3_post_category_delete',	
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
		toSendData: function() {	    	 
			return {
				id: this.attributes.id,
				notes: this.attributes.notes,
				name: this.attributes.name,
				theme_id: this.attributes.theme_id,
			};
		},
		toString: function() {
			return this.attributes.name;
		}
	});

	window.CategoriesList=Backbone.Collection.extend({
		url: function() {
			return Routing.generate('rest_api_v3_get_categories');
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
			return Routing.generate('rest_api_v3_get_currency_codes');
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
	
	
	window.Transfer=API.BaseModel.extend({
		readUrl:   'rest_api_v3_post_transfer',
		updateUrl: 'rest_api_v3_post_transfer',
		deleteUrl: 'rest_api_v3_post_transfer',	

		validation: {
			value: [{
				required: true,
				msg: Translation.get('validate.required')				
			}, 
			{
				pattern: /^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,
				msg: Translation.get('validate.number')				
			}]
		},		
		defaults: {
			id: null,
			value: '',
			account_from_id: '',
			account_to_id: ''
		},
		toSendData: function() {	    	 
			return {
				value: this.attributes.value,
				account_from_id: this.attributes.account_from_id,
				account_to_id: this.attributes.account_to_id,
			};
		},

	});
	
	window.Merge=API.BaseModel.extend({
		readUrl:   'rest_api_v3_post_merge',
		updateUrl: 'rest_api_v3_post_merge',
		deleteUrl: 'rest_api_v3_post_merge',	

		defaults: {
			id: null,
			account_from_id: '',
			account_to_id: ''
		},
		toSendData: function() {	    	 
			return {
				account_from_id: this.attributes.account_from_id,
				account_to_id: this.attributes.account_to_id,
			};
		},
	});
	
	window.ChartCollection=Backbone.Collection.extend({
		url: function() {
			return Routing.generate('rest_api_v3_get_charts');
		},
		model: CurrencyCode
	});
	
	window.ChartModel=API.BaseModel.extend({
		readUrl:   'rest_api_v3_get_charts',
		updateUrl: 'rest_api_v3_post_charts',
		deleteUrl: 'rest_api_v3_post_charts',	
		toSendData: function() {	    	 
			return {
        		currency:      this.attributes.currency,
        		account_id:    this.attributes.account_id,
        		after:         this.attributes.after.toJSON(),
        		before:        this.attributes.before.toJSON(),
			};
		},
	});
});