/*
* Template manager
*/

define(['jquery','backbone','underscore','text'],function() {
	window.JST={};
	
	TemplateManager = {
		get: function(id, callback) {
			//console.log('get template: '+id);
			if(window.JST[id]) {
				//console.log('template: '+id+' found in JST');
				callback(window.JST[id]);
			} else {
				//console.log('loading template: '+id);
				require(['text!'+window.TMPL_ROOT+'/'+id+'.html'],function(template){
					//console.log('get template: '+id);
					window.JST[id]=_.template(template);
					callback(window.JST[id]);
				});
			}
		}
		
	};
});