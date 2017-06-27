/**
 * Created by 나상권 on 2017-05-19.
 */

const SQLite = require('react-native-sqlite-storage');

export default class dbSVC {
    constructor(debug=false) {
        this.db = SQLite.openDatabase({name: 'consultAlbum.db', createFromLocation: 1});
        if (debug) {
            this.db.transaction((tx) => {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", [], (tx, results) => {
                    var len = results.rows.length;
                    var ret = [];
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        if(row.name !== 'sqlite_sequence' && row.name !== 'android_metadata') ret.push(row.name);
                    }
                    console.log('DB Loaded : ' + ret.join(', '));
                });
            });
        }
    }

    test() {
        return this.db;
    }
    setDB(db) {
        this.db = db;
    }
    getDB() {
        return this.db;
    }
    closeDB() {
    	this.db.close();
		console.log('DB Closed');
	}
    getUSER(callback) {
        this.db.transaction((tx) => {
            tx.executeSql("SELECT unique_key, reg_date, user_id, name, email FROM ca_user", [], (tx, results) => {
                var len = results.rows.length;
                var ret = [];
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    ret.push(row);
                }
                callback(ret);
            })
        });
    }
	regUSER(arg_uniquekey, arg_reg_date, arg_user_id, arg_name, arg_email, arg_passphase) {
		this.db.transaction((tx) => {
			tx.executeSql( "INSERT INTO `ca_user`(`unique_key`,`reg_date`,`user_id`,`name`,`email`,`passphase`) " +
				"VALUES ('"+arg_uniquekey+"','"+arg_reg_date+"','"+arg_user_id+"','"+arg_name+"','"+arg_email+"','"+arg_passphase+"');", [], (tx, results) => {});
		});
	}
	editUSER(arg_uniquekey, arg_name, arg_email, arg_passphase) {
		this.db.transaction((tx) => {
			tx.executeSql("UPDATE `ca_user` SET `name`='"+arg_name+"', `email`='"+arg_email+"' WHERE `unique_key`='"+arg_uniquekey+"' AND `passphase`='"+arg_passphase+"';", [], (tx, results) => {});
		});
	}
	getPhoto(callback, user_key, limit) {
		let userFind = user_key ? " WHERE user_key='"+user_key +"'" : "";
		userFind += ' ORDER BY `idx`';
		userFind += limit ? ' LIMIT ' + limit : '';
		userFind += ';';
		this.db.transaction((tx) => {
			tx.executeSql("SELECT * FROM ca_photo" + userFind, [], (tx, results) => {
				var len = results.rows.length;
				var ret = [];
				for (let i = 0; i < len; i++) {
					let row = results.rows.item(i);
					ret.push(row);
				}
				callback(ret);
			});
		});
	}
	getPhotoEachGroup(callback, user_key, limit) {
		let quserkey = user_key ? "s.user_key='"+user_key+"' and " : "";
		let query = "SELECT * FROM ca_photo as s WHERE " + quserkey + "(SELECT COUNT(*) FROM ca_photo as f WHERE f.albumname = s.albumname AND f.idx <= s.idx) <= " + limit + ";";
		this.db.transaction((tx) => {
			tx.executeSql(query, [], (tx, results) => {
				var len = results.rows.length;
				var ret = [];
				for (let i = 0; i < len; i++) {
					let row = results.rows.item(i);
					ret.push(row);
				}
				callback(ret);
			});
		});
	}
	getPhotoByAlbum(callback, user_key, albumname) {
		let userFind = user_key ? " WHERE user_key='"+user_key +"' albumname='"+albumname+"'" : "";
		userFind += ' ORDER BY `idx`;';
		this.db.transaction((tx) => {
			tx.executeSql("SELECT * FROM ca_photo" + userFind, [], (tx, results) => {
				var len = results.rows.length;
				var ret = [];
				for (let i = 0; i < len; i++) {
					let row = results.rows.item(i);
					ret.push(row);
				}
				callback(ret);
			});
		});
	}
	getPhotoSpecific(callback, user_key, unique_key) {
    	let postfix = user_key||unique_key ? ' WHERE' : '';
		postfix += user_key ? " user_key='"+user_key +"'" : "";
		postfix += unique_key ? " `unique_key`='" + unique_key+"'" : "";
		postfix += ' ORDER BY `albumname`;';
		this.db.transaction((tx) => {
			tx.executeSql("SELECT * FROM ca_photo" + postfix, [], (tx, results) => {
				var len = results.rows.length;
				var ret = [];
				for (let i = 0; i < len; i++) {
					let row = results.rows.item(i);
					ret.push(row);
				}
				callback(ret[0]);
			});
		});
	}
	executeQuery(query) {
		this.db.transaction((tx) => {
			tx.executeSql(query, [], (tx, results) => {
			});
		});
	}
	insertPhoto(uniqkey, regdate, title, recipe, album, comment, userkey) {
		let query = "INSERT INTO `ca_photo`(`unique_key`,`reg_date`,`title`,`recipe`,`albumname`,`comment`,`user_key`) " +
			"VALUES ('" + uniqkey + "','" + regdate + "','" + title + "','" + recipe.replace('\n', '\\n') + "','" + album + "','" + comment.replace('\n', '\\n') + "','" + userkey + "');";
		this.executeQuery(query);
	}
	insertAlbum(albumname, userkey) {
		let albumquery = "INSERT INTO `ca_album`(`albumname`, `user_key`) SELECT '"+albumname+"', '"+userkey+"' WHERE NOT EXISTS(SELECT 1 FROM `ca_album` WHERE `albumname` = '"+albumname+"' AND `user_key` = '"+userkey+"');";
		console.log(albumquery);
		this.executeQuery(albumquery);
	}
	insertTag(i_tags, uniqkey, userkey) {
		let tagquery = "DELETE FROM `ca_tag` WHERE `photo_key`='"+uniqkey+"' AND `user_key`='"+userkey+"';";
		let tagreturn = (tag) => "INSERT INTO `ca_tag`(`name`,`photo_key`,`user_key`) VALUES ('"+tag+"','"+uniqkey+"','"+userkey+"');";
		let tagnamereturn = (tag) => "INSERT INTO `ca_tagname`(`tagname`) SELECT '"+tag+"' WHERE NOT EXISTS(SELECT 1 FROM `ca_tagname` WHERE `tagname` = '"+tag+"');";
		i_tags.forEach((tag) => {
			tagquery += tagreturn(tag);
			tagquery += tagnamereturn(tag);
		});
		this.executeQuery(tagquery);
	}
	removeAlbum(albumname, userkey) {
		let albumquery = "DELETE FROM `ca_album` WHERE `albumname` = '"+albumname+"' AND `user_key` = '"+userkey+"';";
		this.executeQuery(albumquery);
	}
	getAlbums(callback) {
		this.db.transaction((tx) => {
			tx.executeSql("SELECT albumname, idx, user_key FROM ca_album", [], (tx, results) => {
				var len = results.rows.length;
				var ret = [];
				for (let i = 0; i < len; i++) {
					let row = results.rows.item(i);
					ret.push(row);
				}
				callback(ret);
			});
		});
	}
	getAlbumsByUser(userkey, callback) {
		this.db.transaction((tx) => {
			tx.executeSql("SELECT albumname, idx, user_key FROM ca_album WHERE user_key='"+userkey+"'", [], (tx, results) => {
				var len = results.rows.length;
				var ret = [];
				for (let i = 0; i < len; i++) {
					let row = results.rows.item(i);
					ret.push(row);
				}
				callback(ret);
			});
		});
	}
	getTagnames(callback) {
		this.db.transaction((tx) => {
			tx.executeSql("SELECT tagname FROM ca_tagname", [], (tx, results) => {
				var len = results.rows.length;
				var ret = [];
				for (let i = 0; i < len; i++) {
					let row = results.rows.item(i);
					ret.push(row);
				}
				callback(ret);
			});
		});
	}
}