document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messages');
    const timerElement = document.getElementById('timer');

    function fetchMessagesAndTimer() {
        fetch('/data')
            .then(response => response.json())
            .then(data => {
                const { messages, remainingTime } = data;
                messagesContainer.innerHTML = '';
                messages.forEach(message => {
                    const messageElement = createMessageElement(message);
                    messagesContainer.appendChild(messageElement);
                });
                updateTimer(remainingTime);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function createMessageElement(message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message.message;
        messageElement.id = message.id; // Assign the message ID to the element
        messageElement.className = 'message'; // Add a class for styling
        messageElement.style.backgroundColor = '#020202';
        messageElement.style.borderColor = 'ffffff';
        messageElement.style.border = 'solid 1px';
        messageElement.style.borderRadius = '6px';
        messageElement.style.color = 'white';
        messageElement.style.padding = '10px';
        messageElement.style.marginBottom = '10px';

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.style.marginLeft = '30px';
        deleteButton.style.backgroundColor ='black';
        deleteButton.style. color = 'blue';
        deleteButton.style.border = 'none';
        deleteButton.style.fontWeight = 'bold';
        deleteButton.style.borderRadius ='6px';
        deleteButton.className = 'delete-button'; // Add a class for styling
        deleteButton.addEventListener('click', () => {
            deleteMessage(message.id); // Delete the message when the button is clicked
        });

        // Append delete button to message element
        messageElement.appendChild(deleteButton);

        return messageElement;
    }

    function updateTimer(remainingTime) {
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        timerElement.textContent = `Chat will be cleared in ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
    }

    fetchMessagesAndTimer();

    setInterval(fetchMessagesAndTimer, 1000);

    messageForm.addEventListener('submit', event => {
        event.preventDefault();
        const message = messageInput.value;
        if (message.trim() !== '') {
            sendMessage(message);
        }
        messageInput.value = '';
    });

    function sendMessage(text) {
        fetch('/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchMessagesAndTimer();
        })
        .catch(error => console.error('Error sending message:', error));
    }

    function deleteMessage(messageId) {
        fetch('/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messageId })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchMessagesAndTimer(); // Fetch updated messages after deletion
        })
        .catch(error => console.error('Error deleting message:', error));
    }
});
