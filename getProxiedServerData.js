let path = require('path');
let mime = require('mime');
let { PROXY_HOST } = require('./config');

function getExt(reqPath, contentTypeHeader) {
    if ( mime.extension(contentTypeHeader) ) {
        return mime.extension(contentTypeHeader);
    }
    if ( mime.extension(mime.lookup(reqPath)) !== 'bin' ) {
        return mime.extension(mime.lookup(reqPath));
    }
    if ( path.extname(reqPath).slice(1, reqPath.indexOf('?')) !== '' ) {
        let ext = path.extname(reqPath);
        return ext.slice(1, ext.indexOf('?'));
    }
    return 'bin';
}

module.exports = (options) => {
    let { path, method, body } = options;
    let response_data = {
        method,
        path
    };

    return new Promise((resolve, reject) => {
        const request = require(PROXY_HOST.protocol).request(options, (res) => {
            //todo work with charsets
            let { statusCode } = res;
            let ext = getExt(path, res.headers['content-type']);
            let body = [];

            response_data.ext = ext;

            res.on('error', () => {
                console.error(`Error in proxy response: ${statusCode}`);
                response_data.body = Buffer.concat(body);
                resolve(response_data);
            }).on('data', (chunk) => {
                body.push(chunk)
            }).on('end', () => {
                response_data.body = Buffer.concat(body);
                if (statusCode !== 200) {
                    console.error(`Error get data: ${statusCode} - ${path}`);
                }
                resolve(response_data);
            });
        });

        request.on('error', (e) => {
            console.error(`Error in proxy request ${e.message}`);
            response_data.body = Buffer.concat([]);
            response_data.ext = 'json';
            resolve(response_data);
        });

        if (body) {
            request.write(body);
        }
        request.end();
    });
};