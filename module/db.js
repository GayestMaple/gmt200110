const MongoClient = require('mongodb').MongoClient;
const Config = require('../config');

class Db {

    // 实现单例模式
    static getInstance () {
        if (!Db.instance) {
            Db.instance = new Db();
        }
        return Db.instance;
    }

    constructor () {
        this.db = '';
        this.connect();
    }

    // 连接数据库
    connect () {
        // 使返回一个异步对象
        return new Promise( (resolve, reject) => {
            // 判断db对象存不存在，不存在则创建，存在则返回已有的，避免每次都进行重新连接
            if (!this.db) {
                MongoClient.connect(Config.dbUrl, {useNewUrlParser:true, useUnifiedTopology: true}, (err, client) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.db = client.db(Config.dbName);
                        resolve(this.db);
                    }
                });
            } else {
                resolve(this.db);
            }
        }); 
    }

    find (collectionName, cjson, ajson={}) {
        return new Promise( (resolve, reject) => {
            this.connect().then( (db) => {
                let result = db.collection(collectionName).find(cjson).project(ajson);
                // 遍历结果
                result.toArray(function (err, docs) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(docs);
                    }
                });
            });
        });
    }

    update (collectionName, wjson, ujson) {
        return new Promise( (resolve, reject) => {
            this.connect().then( (db) => {
                db.collection(collectionName).updateOne(wjson, { $set:ujson }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        });
    }

    insert (collectionName, json) {
        return new Promise( (resolve, reject) => {
            this.connect().then( (db) => {
                db.collection(collectionName).insertOne(json, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        });
    }

    remove (collectionName, json) {
        return new Promise( (resolve, reject) => {
            this.connect().then( (db) => {
                db.collection(collectionName).removeOne(json, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        });
    }

    aggregate (collectionName, json) {
        return new Promise( (resolve, reject) => {
            this.connect().then( (db) => {
                let result = db.collection(collectionName).aggregate(json);
                result.toArray(function (err, docs) {
                    if (err) {
                        reject(err);
                    } else {
                        let res = [];
                        for (let i=0; i<docs.length; i++) {
                            let item = {}                            
                            item.avatarUrl = docs[i].avatarUrl;
                            item.username = docs[i].username;
                            res.push(item);
                        }
                        resolve(res);
                    }
                });
            });
        });
    }
}

module.exports = Db.getInstance();