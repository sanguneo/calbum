/**
 * Created by 나상권 on 2017-05-19.
 */

const SQLite = require('react-native-sqlite-storage');
export default class dbSvc {
    constructor = () => {
        this.setDB(SQLite.openDatabase({name: 'consultAlbum.db', location: 'Library'}));
    }
    initialDB = () => {
        this.db.transaction((tx) => {
            tx.executeSql('CREATE TABLE "ca_user" (`idx` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,`unuque_key` TEXT NOT NULL UNIQUE,`reg_date` TEXT NOT NULL,`user_id` TEXT NOT NULL);', []);
            tx.executeSql('CREATE TABLE "ca_tags" (`idx` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,`photo_key` TEXT,`album_key` TEXT,`user_key` TEXT,`unique_key` TEXT NOT NULL UNIQUE);', []);
            tx.executeSql('CREATE TABLE `ca_photo` (`idx` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,`unique_key` TEXT NOT NULL UNIQUE,`reg_date` TEXT NOT NULL,`title` TEXT NOT NULL,`recipe` TEXT,`album_key` TEXT,`comment` TEXT,`user_key` TEXT NOT NULL);', []);
            tx.executeSql('CREATE TABLE "ca_album" (`idx` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,`unique_key` TEXT NOT NULL UNIQUE,`reg_date` TEXT NOT NULL,`title` TEXT NOT NULL,`user_key` TEXT NOT NULL);', []);
            tx.executeSql('CREATE INDEX `user_idx` ON `ca_user` (`idx` ASC,`unuque_key` );', []);
            tx.executeSql('CREATE INDEX `tags_idx` ON `ca_tags` (`idx` ASC,`unique_key` )', []);
            tx.executeSql('CREATE INDEX `photo_idx` ON `ca_photo` (`idx` ASC ,`unique_key` );', []);
            tx.executeSql('CREATE INDEX `album_idx` ON `ca_album` (`idx` ASC ,`unique_key` );', []);
        });
    }
    setDB = (db) => {
        this.db = db;
        return this.db;
    }
    getDB = () => {
        return this.db;
    }
    regUSER = (uniqkey, regdate, userid) => {
        this.db.transaction((tx) => {
            tx.executeSql("INSERT INTO `ca_user` VALUES (null,'${uniqkey}','${regdate}','${userid}');", []);
        });
    }
}