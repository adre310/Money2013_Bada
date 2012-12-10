/*
*  Mobile Views 
*/

define(['jquery',
        'backbone',
        'underscore',
        'jquery.mobile',
        'backbone.forms',
        'backbone.validation',
        'base_view',
        'forms_ext'],function() {
	
	AccountListPageView=PageBasicView.extend({
		id: 'AccountListPageView',
		headerText : Translation.get('account.list'),

	    initialize:function () {
	    	this.navlist=new Backbone.Collection;
	    	this.navlist.add([
	    	   {link:'#account/new',text:Translation.get('account.create')},
	    	   {link:'#category/list',text:Translation.get('category.list')}
	    	   ]);
	    	AccountListPageView.__super__.initialize.apply(this);
	    },	
	    
		renderContentView: function() {
			console.log('AccountListPageView renderContentView');
	        
    		this.listView=new JQMListView({
    			model:this.model,
    			template:'account-list-item'
    			//headerText: 'Account List'
    		});
    		this.contentEl.append(this.listView.render().el);
	        
	        var self=this;
	       
	        if(this.model.length > 0) {
    			self.listView.renderList();
	        } else {
	        	this.model.fetch({
	        		success: function() {
	        			console.log('accounts loaded');
	        			self.listView.renderList();
	        		},
	        		error:  function() {
	        			console.log('accounts loaded - error');
	        		}
	        	});
	        }
		},
        _afterInit: function() {
    		this.listView.refresh();
        }
	});
	
	AccountPageView=PageBasicView.extend({
		id: 'AccountPageView',
		template_id: 'account-view-page',
		backLink: '#account/list',

		initialize: function () {
			console.log('AccountPageView init');
			
			this.headerText=Translation.get('account.title')+' '+this.model.get('name');

	    	this.navlist=new Backbone.Collection;
	    	this.navlist.add([
	    	   {link:'#pay/'+this.model.get('id')+'/new',text:Translation.get('pay.create')},
	    	   {link:'#account/'+this.model.get('id')+'/edit',text:Translation.get('account.edit')},
	    	   {link:'#account/'+this.model.get('id')+'/delete',text:Translation.get('account.delete')}
	    	   ]);
	    	AccountPageView.__super__.initialize.apply(this);
	    },	
		renderContentView: function() {
			this.contentEl.append(this.template(this.model.toJSON()));
    		
    		var self=this;
    		
    		this.paylist=app.getPayList(this.model.get('id'));

    		this.listView=new JQMListView({
    			model:this.paylist,
    			template:'pay-list-item',
    			headerText: Translation.get('pay.list'),
            	create: function(el,model) {
            		el.attr('data-theme', model.get('style'));        		
            	}    			
    		});    		
    		this.contentEl.append(this.listView.render().el);

    		if(this.paylist.loaded) {
    			this.listView.renderList();
    		} else {
    			this.paylist.fetch({
    				success: function() {
    					console.log('pays loaded');
    					self.listView.renderList();
    					self.paylist.loaded=true;
    				},
    				error:  function() {
    					console.log('pays loaded - error');
    				}
    			});
    		}
		},
        _afterInit: function() {
    		this.listView.refresh();
        }
	});

	AccountEditPage=FormBasicView.extend({
		id: 'AccountEditPage',
		headerText: Translation.get('account.edit'),

		initialize: function () {
			//console.log('PayEditPage init ->');
			
			this.backLink='#account/'+this.model.get('id')+'/show';

	    	this.navlist=new Backbone.Collection;
	    	this.navlist.add([
	    	   {link:'#account/'+this.model.get('id')+'/delete',text:Translation.get('account.delete')}
	    	   ]);
	    	AccountEditPage.__super__.initialize.apply(this);
			//console.log('PayEditPage init <-');
	    },
	    
		createForm: function() {
			return new Backbone.Form({
	        	model:this.model,
	        	schema: {
	        		name:     { type: 'Text',title:Translation.get('account.name')},
	        		currency: { type: 'jqm.select', options: app.getCurrencyCodes(),title:Translation.get('account.currency')},
	        		notes:    { type: 'TextArea',title:Translation.get('generic.notes')}
	        	}
	        });
		}	    
	});
	
	AccountNewPage=FormBasicView.extend({
		id: 'AccountNewPage',
		headerText: Translation.get('account.create'),
		backLink: '#account/list',
	    
		createForm: function() {
			return new Backbone.Form({
	        	model:this.model,
	        	schema: {
	        		name:     { type: 'Text',title:Translation.get('account.name')},
	        		currency: { type: 'jqm.select', options: app.getCurrencyCodes(),title:Translation.get('account.currency')},
	        		notes:    { type: 'TextArea',title:Translation.get('generic.notes')}
	        	}
	        });
		}	    
	});	
	PayEditPage=FormBasicView.extend({
		id: 'PayEditPage',

		initialize: function () {
			//console.log('PayEditPage init ->');
			
			this.headerText=this.model.isNew()?Translation.get('pay.create'):Translation.get('pay.edit');
			this.backLink='#account/'+this.model.get('account_id')+'/show';

			if(!this.model.isNew()) {
				this.navlist=new Backbone.Collection;
				this.navlist.add([
				    {link:'#pay/'+this.model.get('id')+'/delete',text:Translation.get('pay.delete')}
	    	    ]);
			};
	    	PayEditPage.__super__.initialize.apply(this);
			//console.log('PayEditPage init <-');
	    },
	    
		createForm: function() {
			return new Backbone.Form({
	        	model:this.model,
	        	schema: {
	        		pay_value:    { type: 'Text',title:Translation.get('pay.payvalue')},
	        		pay_date:     { type: 'mobiscroll.Date',title:Translation.get('pay.paydate')},
	        		category_id:  { type: 'jqm.select', options: app.getCategoriesList(),title:Translation.get('pay.category')},
	        		notes:        { type: 'TextArea',title:Translation.get('generic.notes')}
	        	}
	        });
		}	    
	});
	
	CategoryListPageView=PageBasicView.extend({
		id: 'CategoryListPageView',
		headerText : Translation.get('category.list'),

	    initialize:function () {
	    	this.navlist=new Backbone.Collection;
	    	this.navlist.add([
	    	   {link:'#category/new',text:Translation.get('category.create')},
	    	   {link:'#account/list',text:Translation.get('account.list')}
	    	   ]);
	    	CategoryListPageView.__super__.initialize.apply(this);
	    },	
	    
		renderContentView: function() {
			console.log('CategoryListPageView renderContentView');
	        
    		this.listView=new JQMListView({
    			model:this.model,
    			template:'category-list-item',
            	create: function(el,model) {
            		el.attr('data-theme', model.get('style'));        		
            	}    			
    		});
    		this.contentEl.append(this.listView.render().el);
	        
	        var self=this;
	       
	        if(this.model.length > 0) {
    			self.listView.renderList();
	        } else {
	        	this.model.fetch({
	        		success: function() {
	        			console.log('category loaded');
	        			self.listView.renderList();
	        		},
	        		error:  function() {
	        			console.log('category loaded - error');
	        		}
	        	});
	        }
		},
        _afterInit: function() {
    		this.listView.refresh();
        }
	});

	CategoryEditPage=FormBasicView.extend({
		id: 'CategoryEditPage',

		initialize: function () {
			//console.log('PayEditPage init ->');
			
			this.headerText=this.model.isNew()?Translation.get('category.create'):(Translation.get('category.edit')+' '+this.model.get('name'));
			this.backLink='#category/list';

			if(!this.model.isNew()) {
	    	this.navlist=new Backbone.Collection;
	    	this.navlist.add([
	    	   {link:'#category/'+this.model.get('id')+'/delete',text:Translation.get('category.delete')}
	    	   ]);
			};
	    	CategoryEditPage.__super__.initialize.apply(this);
			//console.log('PayEditPage init <-');
	    },
	    
		createForm: function() {
			return new Backbone.Form({
	        	model:this.model,
	        	schema: {
	        		name:      { type: 'Text', title:Translation.get('category.name')},
	        		theme_id:  { type: 'jqm.select', options: app.getStyleList(), title:Translation.get('category.style')},
	        		notes:     { type: 'TextArea', title:Translation.get('generic.notes')}
	        	}
	        });
		}	    
	});
	
});