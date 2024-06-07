const bookController = {
    getAll: (req, res) => {
        try {
            res.json({msg: "OK"})
        } catch (error) {
            res.json({msg: error.msg})
        }
    }
}

module.exports = bookController