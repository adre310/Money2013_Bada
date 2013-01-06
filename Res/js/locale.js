/*
* Localization module
*/
Translation = {
		setData: function(data) {
			console.log('Translation.setDate');
			this.items=data;
		},
		get: function(id) {
			if(this.items) {
				return this.items[id];
			} else {
				console.log('Translation.get('+id+') ERROR ');
				return id;
			}
		}
	};
