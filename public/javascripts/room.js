const socket = io('http://localhost:3000/poker');
console.log(room);
socket.on('connection',(msg)=>{
  console.log(`connection event msg: ${msg}`);
})
console.log(`room name: ${roomName}`)
console.log(`room id: ${roomId}`)
socket.emit('joinRoom',roomId)

socket.on('welcome',(msg) => console.log(msg));
socket.on('fail',(err)=>console.log(err));
socket.on('success',(res)=>{
  console.log(res);
});
socket.emit('poker room','User is sending a message!');