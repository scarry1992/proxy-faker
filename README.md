# Service Proxy-Faker

That's a server for proxying or faking response from any server. It's creating cache response of proxying server.
If proxying server returning response, it's caching it. If proxying server don't responsing or responsing with error, it's creating empty cache.
 
##Instructions
#####1. Configure your proxied server and local service for you own in config.js
#####2. Configure docker-composer.yml
#####3. Run "docker-compose up" and look your proxy-server in browser.
#####4. Now link your IP of docker container with proxied host in hosts and that's all.