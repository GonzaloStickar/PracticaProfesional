const path = require('path');
const fs = require('fs');

const main = {
    getInicio: (req, res) => {
        try {
            res.sendFile(path.join(__dirname, '..', 'components', 'index.htm'));
        }
        catch (e) {
            res.send({msg:e});
        } 
    },
    notFound: (req,res) => {
        res.send("Página no encontrada.");
    }
}

module.exports = main