const socket = io('http://localhost:3000')
socket.on('chat-message', data => {
    console.log(data);
})
let textBox = $(".inputTestBox")
let submitClass = $(".submitButton")
let chatForm = $(".chat_text_container")


$(".chat_text_container").submit(e =>{
    e.preventDefault()
    let dataToSend = textBox.val()
    socket.emit('send-message',dataToSend)
    console.log(dataToSend)
    textBox.attr("value","")
    $(".chat_text").append("<p>"+dataToSend+"</p>")
})

socket.on('chat-message', (data) =>{
    console.log("Message Receieved")
    $(".chat_text").append("<p>" + data + "</p>")
})