import React from 'react';
import Message from './Message';

const ChatWindow = (props: any): JSX.Element => {
    const chat = props.chat
        .map((m: any) => <Message
            key={Date.now() * Math.random()}
            user={m.user}
            message={m.message} />);

    return (
        <div>
            {chat}
        </div>
    )
};

export default ChatWindow;