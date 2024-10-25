const { exec } = require('child_process');

class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox_button'),
            chatBox: document.querySelector('.chatbox_support'),
            sendButton: document.querySelector('.send_button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;
        console.log('Open button clicked');
        openButton.addEventListener('click', () => {
            console.log('Open button clicked');
            this.toggleState(chatBox);
        });

        sendButton.addEventListener('click', () => {
            console.log('Send button clicked');
            this.onSendButton(chatBox);
        });

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                console.log('Enter key pressed');
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if (this.state) {
            chatbox.classList.add('chatbox-active')
        } else {
            chatbox.classList.remove('chatbox-active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        // Call Python script with user input
        runPythonScript(text1)
            .then(response => {
                let msg2 = { name: "CC", message: response };
                this.messages.push(msg2);
                this.updateChatText(chatbox)
                textField.value = ''
            })
            .catch(error => {
                console.error('Error executing Python script:', error);
                this.updateChatText(chatbox)
                textField.value = ''
            });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function (item, index) {
            if (item.name === "CC") {
                html += '<div class="messages_item messages_item-visitor">' + item.message + '</div>'
            } else {
                html += '<div class="messages_item messages_item-operator">' + item.message + '</div>'
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox_messages');
        chatmessage.innerHTML = html;
    }
}

function runPythonScript(message) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['running.py']);
        
        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python script exited with code ${code}: ${stderr}`));
            } else {
                resolve(stdout.trim());
            }
        });

        pythonProcess.stdin.write(message + '\n');
        pythonProcess.stdin.end();
    });
}

const chatbox = new Chatbox();
chatbox.display();