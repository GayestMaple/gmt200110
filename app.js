const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const cors = require('koa2-cors');
const Router = require('koa-router');
const koaBody = require('koa-body');
const send = require('koa-send');
const static = require('koa-static');

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
    .get('/files/download', async ctx => {
        try {
            await send(ctx, ctx.query.filename, { root: __dirname + '/station'});
        } catch (err) {
            ctx.body = 'File does not exist!';
        }
    })
    .post('/files/upload', async ctx => {
        const fileList = ctx.request.files.fileList;
        if (Array.isArray(fileList)) {
            fileList.forEach(file => {
                // 创建可读流
                const readStream = fs.createReadStream(file.path);
                let filePath = path.join(__dirname, 'station/') + `/${file.name}`;
                // 创建可写流
                const writeStream = fs.createWriteStream(filePath);
                // 可读流通过管道写入可写流
                readStream.pipe(writeStream);
            });        
        } else {
            const file = fileList;
            const readStream = fs.createReadStream(file.path);
            let filePath = path.join(__dirname, 'station/') + `/${file.name}`;
            const writeStream = fs.createWriteStream(filePath);
            readStream.pipe(writeStream);
        }
        ctx.body = "server: saved successfully!\n";
    })

// 应用路由
app
    .use(router.routes())
    .use(router.allowedMethods())
    // 配置静态资源服务中间件
    .use(static(path.join( __dirname, './public')));

// 启动服务
app.listen(2999);