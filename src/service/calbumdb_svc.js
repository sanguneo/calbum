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
    getUSER(callback) {
        this.db.transaction((tx) => {
            tx.executeSql("SELECT unique_key, reg_date, user_id, name FROM ca_user", [], (tx, results) => {
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
	regUSER(arg_uniquekey, arg_reg_date, arg_user_id, arg_name, arg_passphase, callback) {
		this.db.transaction((tx) => {
			tx.executeSql( "INSERT INTO `ca_user`(`unique_key`,`reg_date`,`user_id`,`name`,`passphase`) " +
				"VALUES ('"+arg_uniquekey+"','"+arg_reg_date+"','"+arg_user_id+"','"+arg_name+"','"+arg_passphase+"');", [], (tx, results) => {
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
	_getAlbum(callback, user_key) {
		let userFind = user_key ? " WHERE user_key='"+user_key +"';" : "";
		this.db.transaction((tx) => {
			tx.executeSql("SELECT * FROM ca_album" + userFind, [], (tx, results) => {
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
	_executeQuery(query) {
		this.db.transaction((tx) => {
			tx.executeSql(query, [], (tx, results) => {
			});
		});
	}
	_getTags(callback) {
		this.db.transaction((tx) => {
			tx.executeSql("SELECT * FROM ca_tag", [], (tx, results) => {
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
	_getTagsByUser(userkey, callback) {
		this.db.transaction((tx) => {
			tx.executeSql("SELECT * FROM ca_tag WHERE user_key='"+userkey+"'", [], (tx, results) => {
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
	_getTagsByPhoto(photokey, callback) {
		this.db.transaction((tx) => {
			tx.executeSql("SELECT * FROM ca_tag WHERE photo_key='"+photokey+"'", [], (tx, results) => {
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
	_getTagsByName(name, callback) {
		this.db.transaction((tx) => {
			tx.executeSql("SELECT * FROM ca_tag WHERE name='"+name+"'", [], (tx, results) => {
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