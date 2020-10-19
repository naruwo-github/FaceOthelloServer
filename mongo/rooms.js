

const createRoom = function(client, room_id, callback){
    const db = client.db('Rooms');
    db.collection('rooms').insert({
        room_id: room_id,
        num: 0,
        createdAt: Date.now()
    }, (err, result) => {
        if(err)console.log(err);
        callback();
    });
}

const enterRoom = async function(client, req, res, callback){
    let room_id = req.params.id;
    let user_id = req.session.id;
    const db = client.db('Rooms');
    var room = await db.collection('rooms').findOne({
        room_id: room_id
    });
    if(!room){
        res.status(404).send('The room not found');
        callback();
        return false;
    }else{
        if(room.num === 0){
            await db.collection('rooms').updateOne({
                room_id: room_id
            }, {
                $set: {
                    num: 1,
                    member1: user_id
                }
            });
            res.status(200).send({
                player_num: 1
            });
            req.session.room_id = room_id;
        }else if(room.num === 1){
            await db.collection('rooms').updateOne({
                room_id: room_id
            }, {
                $set: {
                    num: 2,
                    member2: user_id
                }
            });
            res.status(200).send({
                player_num: 2
            });
        }else{
            res.status(500).send('the room is already full');
            callback();
            return false;
        }
    }
    callback();
    return true;
}

const exitRoom = async function(client, room_id, user_id, callback){
    const db = client.db('Rooms');
    var room = await db.collection('rooms').findOne({
        room_id: room_id
    });
    if(room.member1 === user_id){
        delete room.member1;
        room.num--;
        if(room.member2){
            room.member1 = room.member2;
            delete room.member2;
        }
    }else if(room.member2 === user_id){
        delete room.member2;
        room.num--;
    }
    await db.collection('rooms').deleteOne({
        room_id: room_id
    });
    await db.collection('rooms').insert(room);
    callback();
}

module.exports = {
    createRoom,
    enterRoom,
    exitRoom,
}