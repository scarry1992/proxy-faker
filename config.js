const PROXY_HOST = {
    protocol: "https",
    host: "google.com",
    port: 80
};
const SERVICE_HOST = {
    protocol: "http",
    host: "0.0.0.0",
    //port: 80 //docker-compose
    port: 8080 //local
};

module.exports = {PROXY_HOST, SERVICE_HOST};