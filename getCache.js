let bluebird = require('bluebird'),
    fs = bluebird.promisifyAll(require('fs')),
    path = require('path'),
    url = require('url'),
    mkdirp = bluebird.promisify(require('mkdirp')),
    { PROXY_HOST } = require('./config');

async function getCache(data) {
    let { path: reqPath, body, ext, method } = data,
        paresedUrl = url.parse(reqPath),
        name = paresedUrl.query || "index",
        pathToDir = path.join(__dirname, 'cache', PROXY_HOST.host, ...paresedUrl.pathname.split('/').filter(item => !!item), method),
        files = [],
        stat = '';

    try {
        stat = await fs.statAsync(pathToDir);
    } catch (e) {
        stat = void 0;
    }

    if (!stat) {
        await mkdirp(pathToDir);
    } else {
        files = await fs.readdirAsync(pathToDir);
    }

    if ( !files.includes(`${name}.${ext}`) ) {
        console.log(`in ${pathToDir} file ${name}.${ext} does not exist`);
        console.log(`Creating a file ${name}.${ext}...`);
        let stream = await fs.createWriteStream(path.join(pathToDir, `${name}.${ext}`));
        stream.write(body.toString());
        stream.end();
        return body.toString();
    } else {
        return await fs.readFileAsync(path.join(pathToDir, `${name}.${ext}`));
    }
}

module.exports = getCache;