/**
 * Created by 나상권 on 2017-05-19.
 */

export default {
	dateFormatter : function(timestamp, format='Y-M-D h:i') {
		let date = new Date(parseInt(timestamp));
		return format
			.replace('Y',this.pad(date.getFullYear(),4))
			.replace('M',this.pad(date.getMonth()+1))
			.replace('D',this.pad(date.getDate()))
			.replace('h',this.pad(date.getHours()))
			.replace('i',this.pad(date.getMinutes()))
			.replace('s',this.pad(date.getSeconds()));
	},
	pad: function(num, size=2){
		var s = "0000" + num;
		return s.substr(s.length-size);
	}
}