const socket = io(`${address}/poker`);

console.log(room);
socket.on('connection', (msg) => {
  console.log(`connection event msg: ${msg}`);
})

console.log(`room name: ${roomName}`)
console.log(`room id: ${roomId}`)
let myUser;
document.getElementById('nameSubmitButton').addEventListener('click', function () {
  document.getElementById('nameSubmitButton').style.display='none'
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
    let resetButton = document.createElement('input');
    let submitButton = document.createElement('input');
    submitButton.className='btn';
    resetButton.className='btn';
    if (myUser.admin) {
      submitButton.type = 'button';
      submitButton.value = 'Calculate The SP';
      resetButton.type = 'button';
      resetButton.value='Reset Scores';
      let divCalculateScore = document.getElementById('calculateTheScore');
      divCalculateScore.innerHTML = '';
      divCalculateScore.appendChild(submitButton);
      divCalculateScore.appendChild(resetButton);
    }
    resetButton.addEventListener('click',() => {
      socket.emit('resetScore',roomId);
    });
    submitButton.addEventListener('click', () => {
      socket.emit('calculate',roomId);
    });
    const storyPoints = createPokerScores();
    document.getElementById('sps').innerHTML = storyPoints;
  });
});
socket.on('calculate',finalResult => {
  let users = finalResult.users;
  let averageScore = finalResult.average;
  document.getElementById('averageScore').innerHTML = `<h3> Average Score: ${averageScore} </h3>`
  let listUsersHtml = createJoinedUsersHtmlWithScores(users);
  let joinedUsers = document.getElementById('joinedUsers');
  joinedUsers.innerHTML = listUsersHtml;
});
socket.on('updateUsers', (data) => {
  const users = data.users;
  const isReset = data.isReset;
  // if it's reset. Reset the average score as well
  if (isReset){
    document.getElementById('averageScore').innerHTML = "";
  }
  const joinedUsersHtml = createJoinedUsersHtml(users);
  document.getElementById('joinedUsers').innerHTML = joinedUsersHtml;
});


let createJoinedUsersHtml = (users) => {
  let joinedUsersHtml = '<ul>'
  users.forEach(user => {
    let descriptionOfUser = `${user.name}`
    let classOftag = ""
    if (user.admin){
      descriptionOfUser+= " - Scrum Master";
    }
    if(!user.admin){
      descriptionOfUser+=" - Developer";
    }
    if (user.score == 0) {
      classOftag = "nonVotedUsers";
      descriptionOfUser+= ": NOT VOTED";
    }
    if(user.score != 0) {
      classOftag = "votedUsers"
      descriptionOfUser+= ": VOTED";
    }
    joinedUsersHtml += `<li class="${classOftag}"> ${descriptionOfUser}</li>`
  });
  joinedUsersHtml += '</ul>'
  return joinedUsersHtml
}

let createJoinedUsersHtmlWithScores = (users) => {
  let joinedUsersHtml = '<ul>'
  users.forEach(user => {
      joinedUsersHtml += `<li> ${user.name}: ${user.score}</li>`
  });
  joinedUsersHtml += '</ul>'
  return joinedUsersHtml
}
let createPokerScores = () => {
  let buttonsHTML = ''
  let pokerScores = ['1/2', '1', '2', '3', '5', '8', '13', '21', '40', '100' ,"'&#9749;'"];
  pokerScores.forEach(score => {
    let button = `<input type="button" onclick=sendScore(${score}) class="score-btn btn" value="${score}"/>`;
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
  document.getElementById('myscore').innerHTML = `<h3> I have selected: ${myUser.score} SP</h3>`;
}

socket.on(roomId, (res) => { console.log(res) });
socket.on('welcome', (msg) => console.log(msg));
socket.on('err', (err) => console.log(err));
socket.on('success', (res) => { console.log(res); });