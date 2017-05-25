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
        }
        if (type === 'd')
            return pad(date.getFullYear(),4)+pad(date.getMonth())+pad(date.getDate());
        else if (type === 't')
            return pad(date.getHours())+pad(date.getMinutes())+pad(date.getSeconds());
        else
            return pad(date.getFullYear(),4)+pad(date.getMonth())+pad(date.getDate())+pad(date.getHours())+pad(date.getMinutes())+pad(date.getSeconds());
    }
    getCharCodeSerial(input) {
		let ret = '';
		for(var i=0;i<input.length;i=i+2){
			ret += input.charCodeAt(i);
		}
		return ret;
    }
    getCharCode(pos, pass=this.passphase) {
        let retpos = pos % pass.length;
        return pass.charCodeAt(retpos).toString(16);
    }
    getCryptedCode(input=this.getTime(), pass=this.passphase) {
        let inputtmp = (input.length % 2 === 1)? '0'+ input: input;
        let ret = '';
        for(var i=0;i<inputtmp.length;i=i+2){
            ret += this.getCharCode(parseInt(inputtmp[i] + inputtmp[i+1], 10), pass);
        }
        return ret;
    }
}