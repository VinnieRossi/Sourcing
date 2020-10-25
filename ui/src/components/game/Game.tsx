
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../common/api/apiModels';
import { API_BASE_URL } from '../common/constants';
import Canvas from './canvas/Canvas';
import axios from 'axios'
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core';

const Game: React.FunctionComponent = (): JSX.Element => {
    const [connection, setConnection] = useState<HubConnection>();
    const [players, setPlayers] = useState<User[]>([]);
    const [player, setPlayer] = useState<User>();

    const pressedKeys = useRef<any>({});

    const playersRef = useRef<User[]>();
    playersRef.current = players;

    const playerRef = useRef<User>();
    playerRef.current = player;

    const KEY = {
        UP: "ArrowUp",
        LEFT: "ArrowLeft",
        DOWN: "ArrowDown",
        RIGHT: "ArrowRight",
        W: "w",
        A: "a",
        S: "s",
        D: "d",
        SPACE: " ",
        ENTER: "Enter"
    };

    useEffect(() => {

        const onKeyDown = async (keyEvent: KeyboardEvent) => {
            const { key } = keyEvent;
            // console.log('down', key);

            pressedKeys.current[key] = true;
            const updatedPlayerState: User = playerRef.current!;

            if (pressedKeys.current[KEY.W] || pressedKeys.current[KEY.UP]) {
                // If server says move is legit
                // Move self
                // Broadcast move
                updatedPlayerState.y -= 2;
                connection?.send('MovePlayerUp', playerRef.current);
            }

            if (pressedKeys.current[KEY.A] || pressedKeys.current[KEY.LEFT]) {
                updatedPlayerState.x -= 2;
                connection?.send('MovePlayerLeft', playerRef.current);
            }

            if (pressedKeys.current[KEY.S] || pressedKeys.current[KEY.DOWN]) {
                updatedPlayerState.y += 2;
                connection?.send('MovePlayerDown', playerRef.current);
            }

            if (pressedKeys.current[KEY.D] || pressedKeys.current[KEY.RIGHT]) {
                updatedPlayerState.x += 2;
                connection?.send('MovePlayerRight', playerRef.current);
            }

            // REMOVE:
            // const previousIndex = players.findIndex((player: User) => player.id === updatedPlayerState.id);

            // const updatedPlayerCollection = Object.assign([], players, { [previousIndex]: updatedPlayerState });

            // setPlayers(updatedPlayerCollection);

        }

        const onKeyUp = async (keyEvent: KeyboardEvent) => {
            const { key } = keyEvent;
            // console.log('keyup', key);

            pressedKeys.current[key] = false;
        }

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connection]);

    // Load users from DB
    useEffect(() => {
        axios.get<User[]>(`${API_BASE_URL}/users`)
            .then(
                (result) => {
                    // setIsLoaded(true);
                    setPlayers(result.data);
                }
            )
            .catch(error => {
                // setIsLoaded(true);
                // setError(error);
            });
    }, []);

    // Create connection
    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(`${API_BASE_URL}/chat`)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    // Start connection and set up listeners
    useEffect(() => {
        if (connection) {
            connection.start()
                .then((result: any) => {
                    console.log('Connected!');

                    setupConnectionListeners();
                })
                .catch((e: any) => console.log('Connection failed: ', e));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connection]);

    // const createUser = async () => {

    //     const newUser: User = {
    //         id: players.length ? players.length + 1 : 1,
    //         name: 'random',
    //         x: Math.floor(Math.random() * Math.floor(800 - 15)),
    //         y: Math.floor(Math.random() * Math.floor(800 - 15)),
    //         isActive: true
    //     };

    //     try {
    //         const res = await axios.post(`${API_BASE_URL}/user`, newUser);

    //         setPlayers(res.data);

    //         await connection?.send('PlayerJoin');
    //     } catch (e) {
    //         console.error(e);
    //     }

    // };

    const setupConnectionListeners = () => {

        if (!connection) {
            return;
        }

        connection.on('PlayersUpdated', (updatedPlayerState: any) => {
            const players = (playersRef.current as User[]);

            console.log('PlayersUpdated', updatedPlayerState);

            if (updatedPlayerState.id === playerRef.current!.id) {
                console.log('skipping server update', updatedPlayerState)
                return;
            }

            // To maintain order
            const previousIndex = players.findIndex((player: User) => player.id === updatedPlayerState.id);

            const updatedPlayerCollection = Object.assign([], players, { [previousIndex]: updatedPlayerState });

            setPlayers(updatedPlayerCollection);


            // const otherPlayers = players.filter((player: User) => player.id !== updatedPlayerState.id);

            // setPlayers([...otherPlayers, updatedPlayerState]);



            if ((playerRef.current as User).id === updatedPlayerState.id) {
                setPlayer(updatedPlayerState);
            }
        });

        connection.on('NewPlayerJoined', (state: any) => {
            console.log(`Player created. All current players: ${state.players}`);

            setPlayers([...state.players]);
        });
    };

    const selectPlayer = (event: any) => {
        const selectedPlayerId: number = event.target.value - 1;
        console.log(selectedPlayerId);
        setPlayer(players[selectedPlayerId]);
    };

    // const moveSquare = async () => {

    //     if (connection?.state === HubConnectionState.Connected) {
    //         try {
    //             await connection?.send('MovePlayer', player);
    //         }
    //         catch (e) {
    //             console.log(e);
    //         }
    //     }
    //     else {
    //         alert('No connection to server yet.');
    //     }
    // };

    return (
        <div>
            {players.length > 0 && (
                <>
                    <Select
                        value=''
                        onChange={selectPlayer}
                    >
                        {players.map(player =>
                            (<MenuItem key={player.id} value={player.id}>{player.name}</MenuItem>)
                        )}

                    </Select>
                    <Canvas connection={connection as any} players={players} />
                    {/* <Chat connection={connection as any} /> */}
                    {/* <button onClick={moveSquare}>Move</button> */}
                </>
            )}
        </div>
    );
};

export default Game;