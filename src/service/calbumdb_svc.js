/**
 * Created by 나상권 on 2017-05-19.
 */

const SQLite = require('react-native-sqlite-storage');

export default class dbSVC {
    constructor() {
        this.db = SQLite.openDatabase({name: 'consultAlbum.db', createFromLocation: 1});
    }
    setDB(db) {
        this.db = db;
    }
    getDB() {
        return this.db;
    }
    closeDB() {
    	this.db.close();
	}
	executeQuery(query, callback) {
		this.db.transaction((tx) => {
			tx.executeSql(query, [], (tx, results) => {
				if(typeof callback == 'function') callback(results);
			});
		});
	}

	insertPhoto(photohash, regdate, title, recipe, comment, signhash) {
		let query = "INSERT INTO `ca_photo`(`photohash`,`reg_date`,`title`,`recipe`,`comment`,`signhash`) " +
			"VALUES ('" + photohash + "','" + regdate + "','" + title + "','" + recipe.replace('\n', '\\n') + "','" + comment.replace('\n', '\\n') + "','" + signhash + "');";
		this.executeQuery(query,console.log);
	}
	insertTag(i_tags, photohash, signhash) {
		let tagquery = "DELETE FROM `ca_tag` WHERE `photohash`='"+photohash+"' AND `signhash`='"+signhash+"';";
		let tagreturn = (tag) => "INSERT INTO `ca_tag`(`name`,`photohash`,`signhash`) VALUES ('"+tag+"','"+photohash+"','"+signhash+"');";
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
	getTagGroups(signhash, callback) {
		let postfix = signhash ? ' WHERE' : '';
		postfix += signhash ? " `signhash`='"+signhash +"'" : "";
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
	getPhoto(callback, signhash, limit) {
		let userFind = signhash ? " WHERE signhash='"+signhash +"'" : "";
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
	getPhotoByTag(callback, signhash, tagname) {
		let query = "SELECT p.idx, p.photohash, p.reg_date, p.title, p.recipe, p.comment, p.signhash FROM ca_photo as p LEFT JOIN ca_tag as t ON p.photohash = t.photohash WHERE";
		query += signhash ? " t.signhash='"+signhash+"'" : "";
		query += signhash && tagname ? " AND" : "";
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
	getPhotoSpecific(callback, signhash, photohash) {
		let postfix = signhash||photohash ? ' WHERE' : '';
		postfix += signhash ? " signhash='"+signhash +"'" : "";
		postfix += signhash&&photohash ? " AND" : "";
		postfix += photohash ? " `photohash`='" + photohash+"'" : "";
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
	getTagSpecific(callback, signhash, photohash) {
		let postfix = signhash||photohash ? ' WHERE' : '';
		postfix += signhash ? " signhash='"+signhash +"'" : "";
		postfix += photohash ? "AND `photohash`='" + photohash+"'" : "";
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
	updatePhoto(photohash, title, recipe, comment, signhash) {
		let query = "UPDATE `ca_photo` SET `title` = '" + title + "',`recipe` = '" + recipe.replace('\n', '\\n') + "',`comment` = '" + comment.replace('\n', '\\n') + "'" +
			"  WHERE `photohash` = '"+photohash+"' AND `signhash` = '"+signhash+"'";
		this.executeQuery(query);
	}
}