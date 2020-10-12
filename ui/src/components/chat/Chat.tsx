
import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import ChatInput from './ChatInput';
import ChatWindow from './ChatWindow';
import { API_BASE_URL } from '../common/constants';

const Chat = () => {
    const [connection, setConnection]: any = useState(null);
    const [chat, setChat]: any = useState([]);
    const [playerState, setPlayerState] = useState({ user: 'default', x: 0, y: 0 } as any);
    const latestChat: any = useRef(null);

    latestChat.current = chat;

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(`${API_BASE_URL}/chat`)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then((result: any) => {
                    console.log('Connected!');

                    setupConnectionListeners();
                })
                .catch((e: any) => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const setupConnectionListeners = () => {

        connection.on('UpdatePlayerState', (state: any) => {
            console.log(state);

            setPlayerState(state);
        });

        connection.on('ReceiveMessage', (message: any) => {
            const updatedChat = [...latestChat.current];
            updatedChat.push(message);

            setChat(updatedChat);
        });
    };

    const sendMessage = async (user: any, message: any) => {
        const chatMessage = {
            user: user,
            message: message
        };

        if (connection.connectionStarted) {
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
    }

    const moveSquare = async () => {

        if (connection.connectionStarted) {
            try {
                await connection.send('SendPlayerState', playerState);
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
        }
    }

    return (
        <div>
            <ChatInput sendMessage={sendMessage} />
            <button onClick={moveSquare} >Move</button>
            <span>Global counter: {playerState.x}</span>
            <hr />
            <ChatWindow chat={chat} />
        </div>
    );
};

export default Chat;