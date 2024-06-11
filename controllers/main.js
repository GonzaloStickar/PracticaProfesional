const path = require('path');

const main = {
    get: (req, res) => {
        try {
            res.sendFile(path.join(__dirname, '..', 'components', 'login.htm'));
        } catch (error) {
            res.json({msg: error.msg})
        }
    }
}

module.exports = main