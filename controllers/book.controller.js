const path = require('path');

const bookController = {
    getAll: (req, res) => {
        try {
            res.sendFile(path.join(__dirname, '..', 'components', 'login.htm'));
        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    create: (req, res) => {
        try {
            const { username, password } = req.body;
            res.json({msg: "OK", username, password});
        } catch (error) {
            res.json({msg: error.msg})
        }
    }
}

module.exports = bookController