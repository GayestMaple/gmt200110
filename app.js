const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const cors = require('koa2-cors');
const Router = require('koa-router');
const koaBody = require('koa-body');
const send = require('koa-send');
const static = require('koa-static');
const DB = require('./module/db');
const ObjectId = require('mongodb').ObjectId;

const app = new Koa();
const router = new Router();

// 配置服务
app
    // 允许跨域访问
    .use(cors())
    .use(koaBody({
        multipart: true,
        formidable: {
            // 设置上传文件大小最大限制，默认2M
            maxFileSize: 2000*1024*1024,
            // 保持文件的后缀
            keepExtensions: true,
        }
    }))

// 配置路由
router
    .get('/', async ctx => {
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./public/index.html')
    })
    .get('/files/download/verify', async ctx => {
        let isExist = false;
        try {
            let oid = ObjectId(ctx.query.cipher);
            await DB.find('file_identification_info', {_id: oid}).then((res) => {
                if (res.length > 0) {
                    isExist = true;
                }
            }).catch((err) => {
                isExist = false;
            });
        } catch (err) {
            isExist = false;
        }
        ctx.body = isExist;
    })
    .get('/files/download', async ctx => {
        let filename = null;
        await DB.find('file_identification_info', {_id: ObjectId(ctx.query.cipher)}).then((res) => {
            filename = res[0].filename;
        });
        await send(ctx, filename, { root: __dirname + '/station'});
    })
    .post('/files/upload', async ctx => {
        const file = ctx.request.files.file;
        const readStream = fs.createReadStream(file.path);
        // 重新以服务器时间戳命名，防止冲突及恶意篡改
        let curtimestamp = new Date().getTime();
        let filePath = path.join(__dirname, 'station/') + '/' + curtimestamp + '.zip';
        const writeStream = fs.createWriteStream(filePath);
        readStream.pipe(writeStream);
        // 数据库存档
        let _cipher = null;
        let _isSaved = false;
        await DB.insert('file_identification_info', {filename: curtimestamp+'.zip'}).then((res) => {
            _isSaved = true;
            _cipher = res.ops[0]._id;
        });
        ctx.body = {isSaved: _isSaved, cipher: _cipher};
    })

// 应用路由
app
    .use(router.routes())
    .use(router.allowedMethods())
    // 配置静态资源服务中间件
    .use(static(path.join( __dirname, './public')));

// 启动服务
app.listen(2999);