/*
* Chart view via jqPlot
*/

define(['jquery',
        'backbone',
        'underscore',
        'jquery.mobile',
        'base_view',
        'forms_ext'],function() {
	
	GraphOptionsView=PageBasicView.extend({
		id: 'GraphOptionsView',
		headerText: Translation.get('chart.kind.category'),
		backLink: '#account/list',
		
		events: {
			'click .save': 'save'
		},
		
		renderContentView: function() {
			Backbone.Validation.bind(this);
			this.contentEl.append('<label class="error form-error" style="display:none" />');

			if(!this.model.get('currency')) {
				this.model.set('currency',this.options.currencies.at(0).get('id'));
			}
				
			this.form=new Backbone.Form({
	        	model:this.model,
	        	schema: {
	        		currency:      { type: 'jqm.select', options:this.options.currencies, title:Translation.get('account.currency')},
	        		account_id:    { type: 'jqm.select', options:this.options.currencies.get(this.model.get('currency')).get('accounts'), title:Translation.get('account.name')},
	        		after:         { type: 'mobiscroll.Date',title:Translation.get('chart.after')},
	        		before:        { type: 'mobiscroll.Date',title:Translation.get('chart.before')},

	        	}
	        });

			var self=this;
			
			this.form.on('currency:change',function(form,currencySelect) {
				var currency=currencySelect.getValue();
				form.fields.account_id.editor.setOptions(self.options.currencies.get(currency).get('accounts'));
			});
			
			this.contentEl.append(this.form.render().el);
			this.contentEl.append('<button type="submit" data-theme="b" class="save">'+Translation.get('chart.draw')+'</button>');		    	
		},
		
		save: function() {
			if(!this.form.commit()) {
				var self=this;
			
				$.ajax({
					url : Routing.generate('rest_api_v2_post_charts'),
					type: 'POST',
					dataType: 'json',
					data: JSON.stringify(this.model.toJSON()),
					success: function(data, textStatus, jqXHR) {
						new GraphView({data:data});
					}, 
					error:  function(jqXHR, textStatus, errorThrown) {
					}
				});
				
			}
		}		
	});	
	
	GraphView=PageBasicView.extend({
		id: 'GraphView',
		headerText: Translation.get('chart.kind.category'),
		backLink: '#account/list',
		rightLink: Translation.get('chart.settings'),
		events: {
			'click .right': 'gotoOptions'
		},

		renderContentView: function() {
			this.contentEl.append("<div id='chart_div'/>");
			var h=$(window).height()-100;
			if(h<0)
				h=300;
			
			$('#chart_div',this.contentEl).css('height',h);
			
			var self=this;
			require(['jqPlot','jqPlot.pie'],function() {
				var series=[[]];
				
				for ( var it in self.options.data) {
					series[0].push([
					       self.options.data[it].category,
					       Number(self.options.data[it].balance)]);
				}
				
				var plot1 = $.jqplot ('chart_div', series, { 
					title: Translation.get('chart.kind.category'),
					seriesDefaults: {
						// Make this a pie chart.
						renderer: $.jqplot.PieRenderer, 
							rendererOptions: {
				                    // Put data labels on the pie slices.
				                    // By default, labels show the percentage of the slice.
				                    showDataLabels: true
				                  }
				                }, 
				                legend: { show:true, location: 's' }
				              }
				            );			
			});
		},
				
		gotoOptions: function() {
			app.Charts();
		}

	});
	
	
});