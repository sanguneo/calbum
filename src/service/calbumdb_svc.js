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
    regUSER(uniqkey, regdate, userid) {
        this.db.transaction((tx) => {
            tx.executeSql("INSERT INTO ca_user VALUES (null,'${uniqkey}','${regdate}','${userid}');", []);
        });
    }
    getUSER(callback) {
        this.db.transaction((tx) => {
            tx.executeSql("SELECT * FROM ca_user", [], (tx, results) => {
                var len = results.rows.length;
                var ret = [];
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    ret.push(row);
                }
                callback(ret);
                return ret;
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

}