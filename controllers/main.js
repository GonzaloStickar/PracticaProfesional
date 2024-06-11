const path = require('path');

const main = {
    getInicio: (req, res) => {
        try {
            res.sendFile(path.join(__dirname, '..', 'components', 'index.htm'));
        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    notFound: (req,res) => {
        res.send("Página no encontrada.");
    }
}

module.exports = main