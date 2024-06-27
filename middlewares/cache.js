const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100} ); //100 segundos de duración de la caché.

module.exports = {
    myCache
}