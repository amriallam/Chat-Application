const socket = io("http://localhost:3000");
createRoomButton.addEventListener("click", () => {
  if (checkName()) return;
  showHide(createRoomSection, home);
  socket.emit("createRoom");
  chatWindow.innerHTML=`<div class="text-center text-light"><span class="text-center">You hosted room: ${socket.id}</span><button onclick="copyToClipboard()" class="mx-2 py-0 px-1 btn btn-primary shadow-none">Copy</button></div>`
});
joinRoomButton.addEventListener("click", () => {
  if (checkName()) return;
  showHide(joinRoomSection, home);
});
backButton.addEventListener("click", () => {
  roomId.value = "";
  showHide(home, joinRoomSection);
});
joinButton.addEventListener("click", () => {
  if (validateRoomInput()) {
    roomIdWarning.classList.add("d-none");
    socket.emit("checkRoomExistance", roomId.value.trim());
  }
});
leaveButton.addEventListener("click", () => {
  chatBoxId.value = "";
  showHide(home, createRoomSection);
  let room=roomId.value.trim()||socket.id;
  socket.emit("leaveLobby",room,sessionStorage.getItem("userName"))
}); 
sendButton.addEventListener('click',()=>{
  if(chatBoxId.value.trim()){
    socket.emit('send-message',chatBoxId.value.trim(),sessionStorage.getItem("userName"),roomId.value.trim()||socket.id);
    chatWindow.innerHTML+=`
    <div class="text-start text-light my-1">
      <h4 class="d-inline ">You</h4>
      <h6 class="mx-1 d-inline fw-light">${messegeDate(new Date())}</h6>
    </div>
    <div class="text-start">
      <span class="sentMassage">${chatBoxId.value.trim()}</span>
    </div>`;
    chatBoxId.value="";
    chatWindow.scrollTop=chatWindow.scrollHeight;
  }
})
socket.on('receive-message',(massege,sender)=>{
  if(sender==sessionStorage.getItem("userName"))return;
  chatWindow.innerHTML+=`
    <div class="text-end text-light my-1">
      <h4 class="d-inline ">${sender}</h4>
      <h6 class="mx-1 d-inline fw-light">${messegeDate(new Date())}</h6>
    </div>
    <div class="text-end">
      <span class="recievedMassage">${massege}</span>
    </div>`
    chatWindow.scrollTop=chatWindow.scrollHeight
})
socket.on("userJoined",(joinedUser)=>{
  chatWindow.innerHTML+=`<div class="my-1 text-center"><span class="alert alert-success py-0 px-1">${joinedUser} joined lobby</span></div>`
});
socket.on("leftLobby",(leftUser)=>{
  chatWindow.innerHTML+=`<div class="my-1 text-center"><span class="alert alert-danger py-0 px-1">${leftUser} left lobby</span></div>`
});
socket.on("RoomResult", (result) => {
  if (result) {
    socket.emit("joinMe", roomId.value.trim(),sessionStorage.getItem("userName"));
    showHide(createRoomSection, joinRoomSection);
    chatWindow.innerHTML=`<div class="text-center text-light"><span class="text-center">You joined room: ${roomId.value.trim()}</span><button onclick="copyToClipboard()" class="mx-2 py-0 px-1 btn btn-primary shadow-none">Copy</button></div>`
  } else 
    roomIdWarning.classList.remove("d-none");
});
function checkName() {
  if (!nameId.value.trim().length) {
    nameWarning.classList.remove("d-none");
    nameId.style.border = "1px solid red";
    return 1;
  }
  nameWarning.classList.add("d-none");
  sessionStorage.setItem("userName", nameId.value.trim());
  nameId.style.border = "";
  return 0;
};
function showHide(show, hide) {
  show.classList.remove("d-none");
  hide.classList.add("d-none");
}
function validateRoomInput() {
  roomWarning.classList.add("d-none");
  if (!roomId.value.trim().length) {
    roomWarning.classList.remove("d-none");
    return 0;
  }
  return 1;
}
function copyToClipboard(){
  navigator.clipboard.writeText(roomId.value.trim()||socket.id);
}
function messegeDate(date){
const hours = date.getHours().toString().padStart(2, '0');
const minutes = date.getMinutes().toString().padStart(2, '0');
return formattedTime = `${hours}:${minutes}`;
}
