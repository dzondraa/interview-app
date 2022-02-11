const express = require('express')
const router = express.Router()

router.get('/' , (req, res) => {
    res.send("Server up and runnig")
})

module.exports = router