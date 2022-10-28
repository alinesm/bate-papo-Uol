let userName = prompt("enter with your userName")

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
  if(error.response.status === 400){
    alert("Choose other userName")
  } 
  window.location.reload()
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
  const listaReceitas = document.querySelector('.chatContent');
  listaReceitas.innerHTML = '';
  
  for (let i = 0; i < chats.length; i++) {
      let chat = chats[i];            
      if (chat.type === "status"){
         listaReceitas.innerHTML += `
          <div class="message status-message">
             <p class="time">(${chat.time})</p>      
              <p class="name">${chat.from}</p>
              <p>${chat.text}</p>               
          </div>
      `;
      } else if (chat.type === "private_message" || chat.to === userName){
        listaReceitas.innerHTML += `
        <div class="message private-message">
           <p class="time">(${chat.time})</p>      
            <p class="name">${chat.from}</p>
            <p>reservadamente para</p>
            <p class="name">${chat.to}:</p>
            <p>${chat.text}</p>               
        </div>
    `;
      } else {
        listaReceitas.innerHTML += `
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

function sendMessage(){

  const typedMessage = document.querySelector('.typedMessage').value;
  
  const newMessage = {
    from: userName,
    to: "todos",
    text: typedMessage,
    type: "message", 
  };
  
  axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', newMessage)
  .then(res => {console.log("Sucesso no POST: ",res)})
  .catch(() => {window.location.reload()})

  document.querySelector('.typedMessage').value = "";
}