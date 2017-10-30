const base64 = function(RNFS, filename, callback) {
	let extname = filename.split('.').pop();
	extname = extname || 'png';
	RNFS.readFile(
		filename.replace('file://', ''),
		'base64'
	).then((data)=>{
		callback('data:image/' + extname + ';base64,' + data.toString('base64'));
	}).catch((e) => {
		callback('');
	});
};

const img = function(data) {
	let reg = /^data:image\/(\w+);base64,([\s\S]+)/;
	let match = data.match(reg);

	if (!match) {
		throw new Error('image base64 data error');
	}

	let extname = match[1];

	return {
		extname: '.' + extname,
		base64: match[2]
	};
};

const base64Img = {};

base64Img.setRNFSModule = function (rnfs) {
	this.RNFS = rnfs
};
base64Img.setFSModule = function (fs) {
	this.fs = fs
};

/**
 * @description
 * Get image file base64 data
 * @example
 * base64Img.base64('path/demo.png', function(err, data) {})
 */
base64Img.base64 = function(filename, callback) {
	if (!callback) callback = ()=>{};
	base64(this.RNFS, filename, callback)
};

/**
 * @description
 * Convert image base64 data to img
 * @example
 * base64Img.img('data:image/png;base64,...', 'dest', '1', function(err, filepath) {});
 */
base64Img.img = function(data, destpath, name, extuse) {
	let result = img(data);
	let filepath = destpath +'/'+ name + (extuse ? result.extname : '');
	this.fs.writeFile(filepath, result.base64, 'base64', (err)=>{
		if(err) console.error(err);
	});

};

module.exports = base64Img;