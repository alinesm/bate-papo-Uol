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
