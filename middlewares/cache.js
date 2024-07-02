const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 300} ); //300 segundos de duración de la caché.

module.exports = {
    myCache
}