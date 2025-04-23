let promptA = document.querySelector('#prompt')
let submitbtn = document.querySelector('#submit')
let chatContainer = document.querySelector(".chat-container")
let ImageBtn = document.querySelector("#image")
let imageInput = document.querySelector("#image input")

//let text2 =document.getElementsByClassName(".ai-chat-area")


const Api_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBXPePlc6ulkgz6SAl3tWiEtHVu9XKld_M"
let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
}

async function generateResponse(aiChatBox) {

    let text2 = aiChatBox.querySelector('.ai-chat-area')
    let requestOption = {
        method: "POST",
        header: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [{
                "parts": [{ "text": user.message },
                (user.file.data ? [{ "inline_data": user.file }] : [])
                ]
            }]
        })
    }
    try {
        let response = await fetch(Api_URL, requestOption)
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace().trim();
        text2.innerHTML = apiResponse;
        //console.log(apiResponse);

    } catch (error) {
        console.log(error);
    }
    finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" })
        user.file = {}
    }

}

//create dynmic div and show data
function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

//handle chat-area for user
function chatResponsehandle(userMessage) {
    user.message = userMessage
    let html = `<img src="user.png" alt="" id="userImage" width="10%">
                <div class="user-chat-area">
            ${user.message}
            </div>`
    promptA.value = ""
    let userChatBox = createChatBox(html, "user-chat-box")
    chatContainer.appendChild(userChatBox)

    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" })

    setTimeout(() => {
        let html1 = `<img src="robot.jpeg" alt="" id="aiImage" width="10%">
                           <div class="ai-chat-area">
                          </div>`
        let aiChatBox = createChatBox(html1, "ai-chat-box")
        chatContainer.appendChild(aiChatBox)
        generateResponse(aiChatBox)
    }, 3000)
}

//handle input box
promptA.addEventListener('keydown', (e) => {
    if (e.key == "Enter")
        chatResponsehandle(promptA.value)
})




imageInput.addEventListener("change", () => {
    const file = imageInput.files[0]
    if (!file) return;
    let reader = new FileReader()
    reader.onload = (e) => {
        console.log(e)
        let base64String = e.target.result.split(",")[1]
        user.file = {
            mime_type: file.type,
            data: base64String
        }
    }
    reader.readAsDataURL(file)
})

ImageBtn.addEventListener("click", () => {
    ImageBtn.querySelector("input").click()
})

submitbtn.addEventListener("click", () => {
    chatResponsehandle(promptA.value)
})