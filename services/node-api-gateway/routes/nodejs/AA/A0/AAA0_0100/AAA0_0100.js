const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
    res.json({ message: 'AAA0_0100 endpoint response' });
});
module.exports = router;