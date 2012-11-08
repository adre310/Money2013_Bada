/**
 * Convert ISO8601 String to Date
 *  YYYY-MM-DDTHH:MM:SS+0000 
 */
(function (Date, undefined) {
	Date.iso8601=function(date) {
		var d;
		if((d=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|(([+-])((\d{2}):?(\d{2}))))$/.exec(date))) {
			var offset=0;
			d[1]=+d[1];	d[2]=+d[2];	d[3]=+d[3];	d[4]=+d[4];	d[5]=+d[5];	d[6]=+d[6];	d[11]=+d[11]; d[12]=+d[12];				
			
			if(d[7] !== 'Z') {
				offset=d[11]*60+d[12];
				if(d[9] === '+') {
					offset=0-offset;
				}
			}

			var ret=new Date(Date.UTC(d[1],d[2]-1,d[3],d[4],d[5]+offset,d[6],0));

			return ret; 	
		} 
		else
			return new Date();
	}
}(Date));

//Added to make dates format to ISO8601
Date.prototype.toJSON = function (key) {
    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    return this.getUTCFullYear()   + '-' +
         f(this.getUTCMonth() + 1) + '-' +
         f(this.getUTCDate())      + 'T' +
         f(this.getUTCHours())     + ':' +
         f(this.getUTCMinutes())   + ':' +
         f(this.getUTCSeconds())   + '+0000';
};
