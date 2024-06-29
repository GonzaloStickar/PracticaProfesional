const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100} ); //100 segundos de duración de la caché.

const cacheMiddleware = (req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }

    const key = req.originalUrl;
    const cachedResponse = myCache.get(key);

    if (cachedResponse) {
        console.log(`Cache hit for key: ${key}`);
        return res.json(JSON.parse(cachedResponse));
    } else {
        console.log(`Cache miss for key: ${key}`);
        res.originalSend = res.send;
        res.send = (body) => {
        if (res.get('Content-Type').includes('application/json')) {
            myCache.set(key, JSON.stringify(body));
        }
        res.originalSend(body);
        };
        next();
    }
};

module.exports = {
    myCache,
    cacheMiddleware
}