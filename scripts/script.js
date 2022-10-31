// let userName = prompt("enter with your userName")
let userName = "babaa"

enterChat()

function enterChat() {
  axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: userName})
  .then(enterSuccess)    
  .catch(enterError)
}

function enterSuccess(response) {
  console.log(response.status)
}

function enterError(error) {
  console.log(error); 
  // if(error.response.status === 400){
  //   alert("Choose other userName")
  // } 
  // window.location.reload()
}

function getMessages() { 
  const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
  promise.then(messagesResponse); 
}

let chats = []
function messagesResponse(response){  
  chats = response.data;  
  renderMessages();
}

setInterval(getMessages, 3000);

function renderMessages() {
  const chatContent = document.querySelector('.chatContent');
  chatContent.innerHTML = '';
  
  for (let i = 0; i < chats.length; i++) {
      let chat = chats[i];            
      if (chat.type === "status"){
         chatContent.innerHTML += `
          <div class="message status-message">
             <p class="time">(${chat.time})</p>      
              <p class="name">${chat.from}</p>
              <p>${chat.text}</p>               
          </div>
      `;
      } else if (chat.type === "private_message" && chat.to === userName){
        chatContent.innerHTML += `
        <div class="message private-message">
           <p class="time">(${chat.time})</p>      
            <p class="name">${chat.from}</p>
            <p>reservadamente para</p>
            <p class="name">${chat.to}:</p>
            <p>${chat.text}</p>               
        </div>
    `;
      }  
    else if (chat.type === "private_message" && chat.from === userName){
        chatContent.innerHTML += `
        <div class="message private-message">
           <p class="time">(${chat.time})</p>      
            <p class="name">${chat.from}</p>
            <p>reservadamente para</p>
            <p class="name">${chat.to}:</p>
            <p>${chat.text}</p>               
        </div>
    `;
      } 
    else {
        chatContent.innerHTML += `
        <div class="message">
           <p class="time">(${chat.time})</p>      
            <p class="name">${chat.from}</p>
            <p>para</p>
            <p class="name">${chat.to}:</p>
            <p>${chat.text}</p>               
        </div>
    `;
      }             
  }

  let scrollMessage = document.querySelector('.message:last-child')
  if(scrollMessage) {
    scrollMessage.scrollIntoView()
  }    
}

function keepConnected() {
  setInterval(() => {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", { name: userName })
    .then((resposta) => console.log(resposta.status));
  }, 5000);
}

keepConnected();

function getParticipants() { 
  const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants'); 
  promise.then(getListofParticipants)
}

let listaPart = []
function getListofParticipants(res) {
  let response = res.data
  for(i=0; i < response.length ; i++){
    let part = response[i];   
    listaPart.push(part.name);  
  }  
}

getParticipants()

function openSidebar(){
  const sibeBar = document.querySelector('.sidebarContainer');
  sibeBar.classList.add("openSidebarContainer")
  renderParticipants()
}

function closeSidebar(){
  const sibeBar = document.querySelector('.sidebarContainer');
  sibeBar.classList.remove("openSidebarContainer")
  
  const visibilities = document.querySelector(".visibilityOption.checked")
  visibilities.classList.remove("checked")
}

function renderParticipants(){
  const participantesContent = document.querySelector('.participantes');
  participantesContent.innerHTML = ` 
        <h3>Escolha um contato para enviar mensagem:</h3>
        <div class="onlineParticipant" onclick="checkParticipant(this)">
          <div>
            <ion-icon class="everybody" name="people"></ion-icon>
            <p>Todos</p>
          </div>
          <ion-icon class="checkMark" name="checkmark-outline"></ion-icon>
        </div>`;

    for(i=0; i < listaPart.length ; i++){   
      participantesContent.innerHTML += `
          <div class="onlineParticipant" onclick="checkParticipant(this)">
            <div>
              <ion-icon class="iconPerson" name="person-circle"></ion-icon>
              <p>${listaPart[i]}</p>  
            </div>
            <ion-icon class="checkMark" name="checkmark-outline"></ion-icon>
          </div>`
    }
  }

let participantSelected;
function checkParticipant(clicked) {
  document.querySelector(".privateTo").innerHTML = ""
  let participantSelectedBefore = document.querySelector(".participantes .checked")
  if (participantSelectedBefore !== null){      
    participantSelectedBefore.classList.remove('checked');
  }  
  clicked.classList.add("checked")
  participantSelected =  document.querySelector(".participantes .checked").getElementsByTagName("p")[0].innerHTML
}

let visibilitySelected;
function checkVisibilidade(clicked) {
  document.querySelector(".privateTo").innerHTML = ""
  let visibilitySelectedBefore = document.querySelector(".visibilities .checked")
  if (visibilitySelectedBefore !== null){      
    visibilitySelectedBefore.classList.remove('checked');
  }  
  clicked.classList.add("checked")
  visibilitySelected =  document.querySelector(".visibilities .checked").getElementsByTagName("p")[0].innerHTML
  sendTo()
}

function sendTo() {
  if (participantSelected && visibilitySelected === "Reservadamente" && participantSelected !== "Todos") {
    document.querySelector(".privateTo").innerHTML += `Enviando para ${participantSelected} (Reservadamente)`
  } else if (participantSelected && visibilitySelected === "Público" && participantSelected !== "Todos") {
    document.querySelector(".privateTo").innerHTML += `Enviando para ${participantSelected} (Publicamente)`
  } else if (participantSelected === "Todos") {
    document.querySelector(".privateTo").innerHTML += `Enviando para Todos`
  } else {
    document.querySelector(".privateTo").innerHTML += `Enviando para Todos`
  }
}

function sendMessage(){
  const typedMessage = document.querySelector('.typedMessage').value;

  if(participantSelected && visibilitySelected === "Reservadamente" && participantSelected !== "Todos") {
    newMessage = {
      from: userName,
      to: participantSelected ,
      text: typedMessage,
      type: "private_message", 
    };

  } else if (participantSelected && visibilitySelected === "Público" && participantSelected !== "Todos") {
    newMessage = {
      from: userName,
      to: participantSelected ,
      text: typedMessage,
      type: "message", 
    };

  } else if(participantSelected === "Todos") {
    newMessage = {
      from: userName,
      to: "todos",
      text: typedMessage,
      type: "message", 
    };
  }
  else {
    newMessage = {
      from: userName,
      to: "todos",
      text: typedMessage,
      type: "message", 
    };
  }
    
  axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', newMessage)
  .then(res => {console.log("Sucesso no POST: ",res)})
  .catch(() => {window.location.reload()})

  document.querySelector('.typedMessage').value = "";
  document.querySelector(".privateTo").innerHTML = "";
  visibilitySelected = ""
  participantSelected = ""
}


