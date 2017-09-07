/**
 * Created by 나상권 on 2017-05-19.
 */

const SQLite = require('react-native-sqlite-storage');

export default class dbSVC {
	isDebug = false;
    constructor(debug=false) {
        this.db = SQLite.openDatabase({name: 'consultAlbum.db', createFromLocation: 1});
        this.isDebug = debug;
        if (debug) {
            this.db.transaction((tx) => {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", [], (tx, results) => {
                    var len = results.rows.length;
                    var ret = [];
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        if(row.name !== 'sqlite_sequence' && row.name !== 'android_metadata') ret.push(row.name);
                    }
                    console.log('DB Loaded Success!! : ' + ret.join(', '));
                });
            });
        }
    }
    setDB(db) {
        this.db = db;
    }
    getDB() {
        return this.db;
    }
    closeDB() {
    	this.db.close();
    	if (this.isDebug)
			console.log('DB Closed Success!!');
	}
	executeQuery(query, callback) {
		this.db.transaction((tx) => {
			tx.executeSql(query, [], (tx, results) => {
				if(typeof callback == 'function') callback(results);
			});
		});
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
	regUSER(arg_uniqkey, arg_reg_date, arg_user_id, arg_name, arg_email, arg_passphase) {
		this.executeQuery( "INSERT INTO `ca_user`(`unique_key`,`reg_date`,`user_id`,`name`,`email`,`passphase`) " +
			"VALUES ('"+arg_uniqkey+"','"+arg_reg_date+"','"+arg_user_id+"','"+arg_name+"','"+arg_email+"','"+arg_passphase+"');", [], (tx, results) => {});
	}
	editUSER(arg_uniqkey, arg_name, arg_email, arg_passphase) {
		this.executeQuery("UPDATE `ca_user` SET `name`='"+arg_name+"', `email`='"+arg_email+"' WHERE `unique_key`='"+arg_uniqkey+"' AND `passphase`='"+arg_passphase+"';");
	}

	insertPhoto(uniqkey, regdate, title, recipe, comment, userkey) {
		let query = "INSERT INTO `ca_photo`(`unique_key`,`reg_date`,`title`,`recipe`,`comment`,`user_key`) " +
			"VALUES ('" + uniqkey + "','" + regdate + "','" + title + "','" + recipe.replace('\n', '\\n') + "','" + comment.replace('\n', '\\n') + "','" + userkey + "');";
		this.executeQuery(query,console.log);
	}
	insertTag(i_tags, uniqkey, userkey) {
		let tagquery = "DELETE FROM `ca_tag` WHERE `photo_key`='"+uniqkey+"' AND `user_key`='"+userkey+"';";
		let tagreturn = (tag) => "INSERT INTO `ca_tag`(`name`,`photo_key`,`user_key`) VALUES ('"+tag+"','"+uniqkey+"','"+userkey+"');";
		let tagnamereturn = (tag) => "INSERT INTO `ca_tagname`(`tagname`) SELECT '"+tag+"' WHERE NOT EXISTS(SELECT 1 FROM `ca_tagname` WHERE `tagname` = '"+tag+"');";

		this.executeQuery(tagquery);

		i_tags.forEach((tag) => {
			this.executeQuery(tagreturn(tag));
			this.executeQuery(tagnamereturn(tag));
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
	getTagGroups(user_key, callback) {
		let postfix = user_key ? ' WHERE' : '';
		postfix += user_key ? " `user_key`='"+user_key +"'" : "";
		postfix += ' GROUP BY `name`;';
		this.db.transaction((tx) => {
			tx.executeSql("SELECT * FROM `ca_tag`" + postfix, [], (tx, results) => {
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
	getPhotoByTag(callback, user_key, tagname) {
		let query = "SELECT p.idx, p.unique_key, p.reg_date, p.title, p.recipe, p.comment, p.user_key FROM ca_photo as p LEFT JOIN ca_tag as t ON p.unique_key = t.photo_key WHERE";
		query += user_key ? " t.user_key='"+user_key+"'" : "";
		query += user_key && tagname ? " AND" : "";
		query += tagname ? " t.name='"+tagname+"'" : "";
		query += ' ORDER BY p.idx;';
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
	getPhotoSpecific(callback, user_key, uniqkey) {
		let postfix = user_key||uniqkey ? ' WHERE' : '';
		postfix += user_key ? " user_key='"+user_key +"'" : "";
		postfix += user_key&&uniqkey ? " AND" : "";
		postfix += uniqkey ? " `unique_key`='" + uniqkey+"'" : "";
		postfix += ' ORDER BY `idx`;';
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
	getTagSpecific(callback, user_key, uniqkey) {
		let postfix = user_key||uniqkey ? ' WHERE' : '';
		postfix += user_key ? " user_key='"+user_key +"'" : "";
		postfix += uniqkey ? "AND `photo_key`='" + uniqkey+"'" : "";
		postfix += ' ORDER BY `idx`;';
		this.db.transaction((tx) => {
			tx.executeSql("SELECT * FROM ca_tag" + postfix, [], (tx, results) => {
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
	updatePhoto(uniqkey, title, recipe, comment, userkey) {
		let query = "UPDATE `ca_photo` SET `title` = '" + title + "',`recipe` = '" + recipe.replace('\n', '\\n') + "',`comment` = '" + comment.replace('\n', '\\n') + "'" +
			"  WHERE `unique_key` = '"+uniqkey+"' AND `user_key` = '"+userkey+"'";
		this.executeQuery(query);
	}
}