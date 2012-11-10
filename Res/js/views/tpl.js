/*
* Template manager
*/

define(['jquery','backbone','underscore'],function() {
	window.JST={};
	
	TemplateManager = {
		get: function(id, callback) {
			console.log('get template: '+id);
			if(window.JST[id]) {
				console.log('template: '+id+' found in JST');
				callback(window.JST[id]);
			} else {
				console.log('loading template: '+id);
				$.ajax({
					url: './templates/'+id+'.html',
					type: 'GET',
					dataType: 'html',
					success: function(data, textStatus, jqXHR) {
						console.log('get template: '+id+' success');
						window.JST[id]=_.template(data);
						callback(window.JST[id]);
					},
					error:  function(jqXHR, textStatus, errorThrown) {
						console.log('get template: '+id+' error');
					}					
				});
			}
		}
	};
});