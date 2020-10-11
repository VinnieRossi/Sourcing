
import React, { useState } from 'react';

const ChatInput = (props: any): JSX.Element => {
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');

    const onSubmit = (e: any): void => {
        e.preventDefault();

        const isUserProvided = user && user !== '';
        const isMessageProvided = message && message !== '';

        if (isUserProvided && isMessageProvided) {
            props.sendMessage(user, message);
        }
        else {
            alert('Please insert an user and a message.');
        }
    }

    const onUserUpdate = (e: any): void => {
        setUser(e.target.value);
    }

    const onMessageUpdate = (e: any): void => {
        setMessage(e.target.value);
    }

    return (
        <form
            onSubmit={onSubmit}>
            <label htmlFor="user">User:</label>
            <br />
            <input
                id="user"
                name="user"
                value={user}
                onChange={onUserUpdate} />
            <br />
            <label htmlFor="message">Message:</label>
            <br />
            <input
                type="text"
                id="message"
                name="message"
                value={message}
                onChange={onMessageUpdate} />
            <br /><br />
            <button>Submit</button>
        </form>
    )
};

export default ChatInput;
