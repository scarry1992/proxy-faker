let url = require('url'),
    path = require('path'),
    getCache = require('./getCache'),
    getProxiedServerData = require('./getProxiedServerData'),
    { PROXY_HOST, SERVICE_HOST } = require('./config'),
    server = require(SERVICE_HOST.protocol).createServer().listen({
        host: SERVICE_HOST.host,
        port: SERVICE_HOST.port
    });

server.on('request', async (req, res) => {
    let body = [];
    let request_options = Object.assign({}, PROXY_HOST, {path: req.url, protocol: `${PROXY_HOST.protocol}:`, method: req.method});

    req.on('error', () => {
        console.error(`Error!!!!!!!!!!!!!!`);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', async () => {
        body = Buffer.concat(body).toString();

        if (body) {
            request_options.body = body;
        }

        try {
            let proxy_response_data = await getProxiedServerData(request_options);
            let cache = await getCache(proxy_response_data);
            res.end(cache);
        } catch (e) {
            console.error(`Error make cache: ${e.message}`);
            res.end();
        }

    });
});