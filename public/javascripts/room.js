const socket = io(`${address}/poker`);

console.log(room);
socket.on('connection', (msg) => {
  console.log(`connection event msg: ${msg}`);
})

console.log(`room name: ${roomName}`)
console.log(`room id: ${roomId}`)
let myUser;

document.getElementById('nameSubmitButton').addEventListener('click', function () {
  console.log(document.getElementById('nameOfUser').value);
  let userName = document.getElementById('nameOfUser').value;
  console.log(`DOM read: ${userName}`);
  let auth = {
    userName: userName,
    roomId: roomId
  }
  socket.emit('joinRoom', auth);
  socket.on("newUser", (joinedUsers) => {
    console.log('joined Users: ');
    console.log(joinedUsers);
    joinedUsers.forEach(user => { 
      if (user.name == userName)
      { myUser = user } 
    });
    const joinedUsersHtml = createJoinedUsersHtml(joinedUsers);
    document.getElementById('joinedUsers').innerHTML = joinedUsersHtml;
    document.getElementById('nameSubmitButton').disabled = true;
    let submitButton = document.createElement('input');
    if (myUser.admin) {
      submitButton.type = 'button'
      submitButton.value = 'Calculate The SP';
      let divCalculateScore = document.getElementById('calculateTheScore');
      divCalculateScore.innerHTML = '';
      divCalculateScore.appendChild(submitButton);
    }
    submitButton.addEventListener('click', () => {
      socket.emit('calculate',roomId);
    });
    const storyPoints = createPokerScores();
    document.getElementById('sps').innerHTML = storyPoints;
  });
});
socket.on('calculate',averageScore => {
  document.getElementById('averageScore').innerHTML = `<h3> Average Score: ${averageScore} </h3>`
});
socket.on('updateUsers', (users) => {
  const joinedUsersHtml = createJoinedUsersHtml(users);
  document.getElementById('joinedUsers').innerHTML = joinedUsersHtml;
});

let createJoinedUsersHtml = (users) => {
  let joinedUsersHtml = '<ul>'
  users.forEach(user => {
    if (user.score == 0) {
      joinedUsersHtml += `<li> ${user.name}: NOT VOTED</li>`
    }
    else {
      joinedUsersHtml += `<li> ${user.name}: VOTED</li>`
    }
  });
  joinedUsersHtml += '</ul>'
  return joinedUsersHtml
}

let createPokerScores = () => {
  let buttonsHTML = ''
  let pokerScores = [1, 2, 3, 5, 8, 13, 21, 40, 100];
  pokerScores.forEach(score => {
    let button = `<input type="button" onclick=sendScore(${score}) class="${score} score-btn" value="${score}"/>`;
    buttonsHTML += button;
    console.log(button);
  });
  return buttonsHTML;
}

let sendScore = (score) => {
  console.log(score);
  myUser.score = score;
  console.log('modified User: ');
  console.log(myUser);
  socket.emit('voteScore', myUser);
}

socket.on(roomId, (res) => { console.log(res) });
socket.on('welcome', (msg) => console.log(msg));
socket.on('err', (err) => console.log(err));
socket.on('success', (res) => { console.log(res); });