const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Store the deletion time (24 hours from now)
const deletionTime = new Date();
deletionTime.setHours(deletionTime.getHours() + 24);

// Function to read messages from JSON file
function readMessages() {
    try {
        const messagesData = fs.readFileSync('messages.json', 'utf8');
        return JSON.parse(messagesData);
    } catch (err) {
        console.error('Error reading messages:', err);
        return [];
    }
}

// Function to write messages to JSON file
function writeMessages(messages) {
    try {
        fs.writeFileSync('messages.json', JSON.stringify(messages), 'utf8');
    } catch (err) {
        console.error('Error writing messages:', err);
    }
}

// GET route to retrieve messages and remaining time
app.get('/data', (req, res) => {
    const messages = readMessages();
    const currentTime = new Date();
    const remainingTime = deletionTime - currentTime;
    res.json({ messages, remainingTime });
});

// POST route to submit a message
app.post('/message', (req, res) => {
    const { message } = req.body;
    const messages = readMessages();
    const messageId = messages.length; // Generate ID by incrementing the length of the messages array
    messages.push({ id: messageId, message }); // Add the ID to the message object
    writeMessages(messages);
    res.json({ message: 'Message sent successfully.' });
});

// POST route to delete a message
app.post('/delete', (req, res) => {
    const { messageId } = req.body;
    let messages = readMessages();
    messages = messages.filter(msg => msg.id !== messageId); // Filter out the message with the given ID
    writeMessages(messages);
    res.json({ message: 'Message deleted successfully.' });
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
