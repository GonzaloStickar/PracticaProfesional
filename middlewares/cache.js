const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100} );

module.exports = {
    myCache
}