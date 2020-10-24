
import React, { useState, useRef, useEffect } from 'react';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import ChatInput from './ChatInput';
import ChatWindow from './ChatWindow';

interface ChatProps {
    connection: HubConnection;
}

const Chat: React.FunctionComponent<ChatProps> = ({ connection }: ChatProps): JSX.Element => {

    const [chat, setChat]: any = useState([]);
    const latestChat: any = useRef(null);

    latestChat.current = chat;

    useEffect(() => {
        if (!connection) { return; }
        connection.on('ReceiveMessage', (message: any) => {
            const updatedChat = [...latestChat.current];
            updatedChat.push(message);

            setChat(updatedChat);
        });

    }, [connection]);

    const sendMessage = async (user: any, message: any) => {
        const chatMessage = {
            user: user,
            message: message
        };

        if (connection?.state === HubConnectionState.Connected) {
            try {
                await connection.send('SendMessage', chatMessage);
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
        }
    };

    return (
        <div>
            <ChatInput sendMessage={sendMessage} />
            <hr />
            <ChatWindow chat={chat} />
        </div>
    );
};

export default Chat;