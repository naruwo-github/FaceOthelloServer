var express = require('express');
const session = require('express-session');
var router = express.Router();
const { nanoid } = require('nanoid');


router.get('/create', function(req, res, next){
    let generated_id = nanoid(8);
    res.status(200).send(generated_id);
});

router.get('/enter/:id', function(req, res, next){
    req.session.room_id = req.params.id;
    res.status(200).send(req.params.id);
});

router.get('/exit', function(req, res, next){
    let id = req.session.room_id;
    delete req.session.room_id;
    res.status(200).send(id);
});

module.exports = router;