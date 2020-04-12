const socket = io(`${address}/poker`);
console.log(room);
socket.on('connection',(msg)=>{
  console.log(`connection event msg: ${msg}`);
})
console.log(`room name: ${roomName}`)
console.log(`room id: ${roomId}`)


document.getElementById('nameButton').addEventListener('click',function(){
  console.log(document.getElementById('nameOfUser').value);
  let userName = document.getElementById('nameOfUser').value;
  console.log(`DOM read: ${userName}`);
  let auth = {
    userName: userName,
    roomId: roomId
  }
  socket.emit('joinRoom',auth);
  socket.on("newUser",(joinedUsers)=>{
    console.log('joined Users: ');
    console.log(joinedUsers);
    const joinedUsersHtml = createJoinedUsersHtml(joinedUsers);
    document.getElementById('joinedUsers').innerHTML = joinedUsersHtml;
  });
});
socket.on('joinRoom',(users) => {
  const joinedUsersHtml = createJoinedUsersHtml(users);
  document.getElementById('joinedUsers').innerHTML = joinedUsersHtml;
});

let createJoinedUsersHtml = (users) =>{
  let joinedUsersHtml = '<ul>'
  users.forEach( user =>{
    joinedUsersHtml+=`<li> ${user.name}: ${user.id}</li>`
  })
  joinedUsersHtml+='</ul>'
  return joinedUsersHtml
}

socket.on(roomId,(res)=>{console.log(res)});
socket.on('welcome',(msg) => console.log(msg));
socket.on('err',(err)=>console.log(err));
socket.on('success',(res)=>{console.log(res);});