/*
* Localization module
*/
Translation = {
		setData: function(data) {
			console.log('Translation.setDate');
			this.items=data;
		},
		get: function(id) {
			//console.log('Translation.get('+id+') = '+this.items[id]);
			return this.items[id];
		}
	};
