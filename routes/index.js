var express = require('express');
var router = express.Router();
let dbHandler = require('../socket/dbHandler');

router.get('/', function (req, res, next) {
    dbHandler.database.find({ occupied: false }, (err, rooms) => {
      if (err) {
        console.log(err);
      }
      let newRoom = {
        id:rooms.length+1,
        name: `room-${rooms.length+1}`,
        occupied: false,
        users:[]
      }
      dbHandler.insert(newRoom);
      let size = rooms.length
      let rIndex = Math.floor(Math.random() * (size - 1));
      console.log(`rIndex: ${rIndex}`);
      console.log('random room: ');
      console.log(rooms[rIndex]);
      let assignedRoom = rooms[rIndex];
      assignedRoom.occupied = true;
      // update the database after it's randomly selected
      dbHandler.database.update({ _id: assignedRoom._id }, { occupied: true }, function (err, numReplaced) {
        if (err) {
          console.log('error occured during update: ');
          console.log(err);
        } else {
          console.log('num replaced: ');
          console.log(numReplaced);
        }
      });
      res.render('index', {
        title: 'Distributed Scrum Poker',
        socketVersion: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js',
        room: assignedRoom,
        address: process.env.WEBSITE_URL,
        releaseHash: process.env.RELEASE_HASH
      }
      );
    });
});
router.get('/room',function(req,res,next){
  console.log(`website url ${process.env.WEBSITE_URL}`)
  console.log('dbHandler database: ');
  const roomId = req.query.roomId;
  console.log(`room ID: ${roomId}`);
  if (roomId) {
    console.log(`room ID: ${roomId}`);
    dbHandler.database.find({ _id: roomId }, (err, room) => {
      if (err) {
        console.log('error occured during a GET request to /:id');
        console.log(err);
      }
      else if (room.length > 1) {
        console.log('documents are greater than 1. Constraint failed');
      }
      else if (room.length == 1) {
        console.log('room length = 1 sending it to the user!');
        console.log(room[0]);
        res.render('index', {
          title: 'Distributed Scrum Poker',
          socketVersion: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js',
          room: room[0],
          address: process.env.WEBSITE_URL,
          releaseHash: process.env.RELEASE_HASH
        }
        );
      }
      else {
        console.log('unknown error occured ...');
        console.log(`length of document: ${room.length}`)
      }
    })
  }
})
module.exports = router;
