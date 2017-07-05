let mime = require('mime');
let { PROXY_HOST } = require('./config');

module.exports = (options) => {
    let { path, method, body } = options;
    let response_data = {
        method,
        path
    };

    return new Promise((resolve, reject) => {
        const request = require(PROXY_HOST.protocol).request(options, (res) => {
            let { statusCode } = res;
            let ext = mime.extension(res.headers['content-type']);
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
                    console.error(`Error get data: ${statusCode}`);
                }
                resolve(response_data);
            });
        });

        request.on('error', () => {
            console.error(`Error in proxy request`);
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