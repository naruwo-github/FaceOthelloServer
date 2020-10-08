var express = require('express');
var router = express.Router();
const { nanoid } = require('nanoid');
const crud_rooms = require('../mongo/rooms');
const mongo = require('mongodb');
const session = require('express-session');
const mongoClient = mongo.MongoClient;

const url = 'mongodb://root:FaceOthello@mongo:27017/';

const option = {
    useUnifiedTopology: true
};

router.get('/create', function(req, res, next){
    let generated_id = nanoid(8);
    mongoClient.connect(url, option, (err, client) => {
        crud_rooms.createRoom(client, generated_id, () => {
            client.close();
        });
    });
    res.status(200).send(generated_id);
});

router.get('/enter/:id', function(req, res, next){
    console.log(req.session.room_id);
    if(!req.session.room_id){
        mongoClient.connect(url, option, (err, client) => {
            let success = crud_rooms.enterRoom(client, req, res, () => {
                client.close();
            });
            if(success){
                req.session.room_id = req.params.id;
            }
        });
    }else{
        res.status(500).send('You already enter room');
    }
});

router.get('/exit', function(req, res, next){
    let id = req.session.room_id;
    if(id){
        delete req.session.room_id;
        mongoClient.connect(url, option, (err, client) => {
            crud_rooms.exitRoom(client, id, req.session.id, () => {
                client.close();
            });
        });
        res.status(200).send(id);
    }else{
        res.status(500).send('You did not enter room');
    }
});

module.exports = router;