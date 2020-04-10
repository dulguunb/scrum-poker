var express = require('express');
const uuid = require('uuid');
var router = express.Router();
var http = require('http');
var server = http.createServer(express);
var server  = require('http').createServer(express);
var io      = require('socket.io').listen(server);
let dbHandler = require('../socket/dbHandler');

router.get('/', function(req, res, next) {
  console.log('dbHandler database: ');
  dbHandler.database.find({occupied:false},(err,docs)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log('index.js get(/) function');
      console.log(docs);
    }
    let size = docs.length
    let rIndex = Math.floor(Math.random() * (size - 1));
    console.log(`rIndex: ${rIndex}`);
    console.log('random room: ');
    console.log(docs[rIndex]);
    let assignedRoom = docs[rIndex];
    assignedRoom.occupied = true;
    // update the database after it's randomly selected
    dbHandler.database.update({_id: assignedRoom._id},{occupied:true},function(err,numReplaced){
      if(err){
        console.log('error occured during update: ');
        console.log(err);
      } else {
        console.log('num replaced: ');
        console.log(numReplaced);
      }
    });
    res.render('index', {
      title: 'Express',
      socketVersion:'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js',
      room: assignedRoom
      }
    );
  });
});
module.exports = router;
