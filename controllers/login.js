const path = require('path');
const bcrypt = require('bcryptjs');
const { loginUserName, loginPassword, sessionSecret } = require('./config.js');

const hash = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const loginUserPOSTwrong = (req, res) => {
    return res.status(401).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login</title>
            <link rel="stylesheet" href="/styles/login.css">
        </head>
        <body>
            <div class="login-container">
                <h1>Login</h1>
                <form action="/login" method="POST">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required>
                    <br>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                    <br>
                    <button type="submit">Login</button>
                </form>
            </div>
            <div id="error_message">
                Credenciales incorrectas
            </div>
        </body>
        </html>
    `);
};

const comparePasswords = async (password) => {

    if (!loginPassword) {
        console.error('loginPassword no está definido');
        return false;
    }

    const passwordLogin = loginPassword;

    return new Promise((resolve, reject) => {
        bcrypt.compare(password, passwordLogin, (err, result) => {
            if (err) {
                console.error('Error al comparar la contraseña:', err);
                reject(err);
            } else {
                console.log("Passwords iguales:", result);
                resolve(result);
            }
        });
    });
};

const compareUsername = async (username) => {

    if (!loginUserName) {
        console.error('loginUserName no está definido');
        return false;
    }

    const usernameLogin = loginUserName;

    return new Promise((resolve, reject) => {
        bcrypt.compare(username, usernameLogin, (err, result) => {
            if (err) {
                console.error('Error al comparar el usuario:', err);
                reject(err);
            } else {
                console.log("Usernames iguales:", result);
                resolve(result);
            }
        });
    });
};

const login = {
    getLogin: (req, res) => {
        try {
            res.sendFile(path.join(__dirname, '..', 'components', 'login.htm'));
        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    postLogin: async (req, res) => {
        try {
            const { username, password } = req.body;

            let passwordsIguales = await comparePasswords(password);
            let usernamesIguales = await compareUsername(username);

            if (usernamesIguales && passwordsIguales) {
                res.cookie('session_id', sessionSecret, {
                    secret: sessionSecret, 
                    resave: false, 
                    saveUninitialized: false
                });
                return res.redirect('/dashboard')
            }
            else {
                return loginUserPOSTwrong(req, res);
            }
        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    logout: (req, res) => {
        res.clearCookie('session_id');
        return res.redirect('/inicio')
    }
}

module.exports = login