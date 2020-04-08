var express = require('express');
var router = express.Router();
var http = require('http');
var server = http.createServer(express);
var server  = require('http').createServer(express);
var io      = require('socket.io').listen(server);
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    socketVersion:'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js'}
  );
});
router.get('/:id', function(req, res, next) {
  const roomName = req.params.id;
  res.render('index', {
    title: 'Express',
    socketVersion:'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js'}
  );
});

io.on('connection', function(socket) {
  console.log('a user connected');
});
module.exports = router;
