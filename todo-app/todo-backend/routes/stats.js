const express = require('express');
const router = express.Router();
const redisClient = require('../redis')


/* GET todos listing. */
router.get('/', async (_, res) => {
    let value = await redisClient.getAsync("added_todos");
    res.json({
        "added_todos": value
    })
});



module.exports = router;
