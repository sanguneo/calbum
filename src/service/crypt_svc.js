/**
 * Created by 나상권 on 2017-05-19.
 */

export default class crypt {
    passphase = 'TheLORDismyshepherdIshallnotbeinwant';
    constructor() {
    }
    getTime(type, time) {
        let date = time ? new Date(time) : new Date();
        let pad = (num, size=2) => {
            var s = "0000" + num;
            return s.substr(s.length-size);
        };
        if (type === 'd')
            return pad(date.getFullYear(),4)+pad(date.getMonth())+pad(date.getDate());
        else if (type === 't')
            return pad(date.getHours())+pad(date.getMinutes())+pad(date.getSeconds());
        else
            return pad(date.getFullYear(),4)+pad(date.getMonth())+pad(date.getDate())+pad(date.getHours())+pad(date.getMinutes())+pad(date.getSeconds());
    }
    getCharCodeSerial(input,term=2) {
		input+='';
		let ret = '';
		for(var i=0;i<input.length;i=i+term){
			ret += input.charCodeAt(i);
		}
		return ret;
    }
    getCharCode(pos, pass=this.passphase) {
		pass+='';
        let retpos = pos % pass.length;
        return pass.charCodeAt(retpos).toString(16);
    }
    getCryptedCode(input=this.getTime(), pass=this.passphase) {
        input+='';
		pass+='';
        let inputtmp = (input.length % 2 === 1)? '0'+ input: input;
        let ret = '';
        for(var i=0;i<inputtmp.length;i=i+2){
            ret += this.getCharCode(parseInt(inputtmp[i] + inputtmp[i+1], 10), pass);
        }
        return ret;
    }
    getAntCode(input=new Date().getTime()) {
		return input.toString().replace(/(.)\1*/g, (seq, key) => key + seq.length.toString());
	}
	getDeAntCode(input) {
    	let ret = [];
    	for(let idx=0;idx<=input.length;idx+=2){
    		let cnt=0;
    		while(cnt<input[idx+1]) {
    			ret.push(input[idx]);
    			cnt++;
			}
		}
    	return ret.join('');
	}
}