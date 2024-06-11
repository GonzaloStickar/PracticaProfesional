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
            
            const usernameTrucho="usernameTrucho"
            const passwordTrucha="passwordTrucha"

            if (username===usernameTrucho && password===passwordTrucha) {
                console.log("Estoy en if")
                res.cookie('session_id', 'secret', {
                    secret: 'secret',
                    resave: false,
                    saveUninitialized: false
                });
                return res.json({msg: "OK", username, password});
            }
            res.json({msg: "Bad, credenciales incorrectas."});
        } catch (error) {
            res.json({msg: error.msg})
        }
    }
}

module.exports = bookController