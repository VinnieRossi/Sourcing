import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import React, { useState, useEffect, useRef } from "react";
import { User } from "../common/api/apiModels";
import { API_BASE_URL } from "../common/constants";
import Canvas from "./canvas/Canvas";
import axios from "axios";
import Select from "@material-ui/core/Select";
import { MenuItem } from "@material-ui/core";

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
    ENTER: "Enter",
  };

  const interval = 50; // 20 ticks per second, tick = 50ms

  let currentTime = 0;
  let lastTime = new Date().getTime();
  let delta = 0;

  const gameLoop = (): void => {
    requestAnimationFrame(gameLoop);

    // console.log('loop');
    if (!playerRef.current) {
      return;
    }

    currentTime = new Date().getTime();
    delta = currentTime - lastTime;

    if (delta < interval) {
      return;
    }

    // console.log(delta);
    // console.log(interval); // 6.9444

    // if (
    //     playerRef.current.x !== playerRef.current.targetX ||
    //     playerRef.current.y !== playerRef.current.targetY
    // ) {
    //     // If there's a pending movement update, do nothing
    //     return;
    // }

    // playerRef.current.targetX = playerRef.current.x;
    // playerRef.current.targetY = playerRef.current.y;

    if (pressedKeys.current[KEY.W] || pressedKeys.current[KEY.UP]) {
      // If server says move is legit
      // Move self
      // Broadcast move
      // updatedPlayerState.y -= 2;
      // console.log('sending up');
      playerRef.current.targetY -= 2;
    }

    if (pressedKeys.current[KEY.A] || pressedKeys.current[KEY.LEFT]) {
      // updatedPlayerState.x -= 2;
      playerRef.current.targetX -= 2;
      // console.log('sending left');
      // connection?.send('MovePlayerLeft', playerRef.current);
    }

    if (pressedKeys.current[KEY.S] || pressedKeys.current[KEY.DOWN]) {
      // updatedPlayerState.y += 2;
      playerRef.current.targetY += 2;
      // console.log('sending down');
      // connection?.send('MovePlayerDown', playerRef.current);
    }

    if (pressedKeys.current[KEY.D] || pressedKeys.current[KEY.RIGHT]) {
      // updatedPlayerState.x += 2;
      playerRef.current.targetX += 2;
      // console.log('sending right');
      // connection?.send('MovePlayerRight', playerRef.current);
    }

    if (
      playerRef.current.x !== playerRef.current.targetX ||
      playerRef.current.y !== playerRef.current.targetY
    ) {
      console.log(
        `delta: ${delta}, current time: ${currentTime}, last time: ${lastTime}, interval: ${interval}`
      );
      connection?.send("MovePlayer", playerRef.current);
      lastTime = currentTime - (delta % interval);
    }
  };

  useEffect(() => {
    const onKeyDown = async (keyEvent: KeyboardEvent) => {
      const { key } = keyEvent;
      pressedKeys.current[key] = true;
    };

    const onKeyUp = async (keyEvent: KeyboardEvent) => {
      const { key } = keyEvent;
      pressedKeys.current[key] = false;
    };

    gameLoop();

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  // Load users from DB
  useEffect(() => {
    axios
      .get<User[]>(`${API_BASE_URL}/users`)
      .then((result) => {
        // setIsLoaded(true);
        const players: User[] = result.data;

        players.forEach((player) => {
          player.targetX = player.x;
          player.targetY = player.y;
        });

        setPlayers(players);
      })
      .catch((error) => {
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
      connection
        .start()
        .then((result: any) => {
          console.log("Connected!");

          setupConnectionListeners();
        })
        .catch((e: any) => console.log("Connection failed: ", e));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  const setupConnectionListeners = () => {
    if (!connection) {
      return;
    }

    connection.on("PlayersUpdated", (updatedPlayerState: any) => {
      const players = playersRef.current as User[];

      // console.log('PlayersUpdated', updatedPlayerState);
      console.log("updating players");

      // To maintain order
      const previousIndex = players.findIndex(
        (player: User) => player.id === updatedPlayerState.id
      );

      const updatedPlayerCollection = Object.assign([], players, {
        [previousIndex]: updatedPlayerState,
      });

      setPlayers(updatedPlayerCollection);

      // const otherPlayers = players.filter((player: User) => player.id !== updatedPlayerState.id);

      // setPlayers([...otherPlayers, updatedPlayerState]);

      if ((playerRef.current as User).id === updatedPlayerState.id) {
        setPlayer(updatedPlayerState);
        // playerRef.current!.targetX = playerRef.current!.x;
        // playerRef.current!.targetY = playerRef.current!.y;
      }
    });

    connection.on("NewPlayerJoined", (state: any) => {
      console.log(`Player created. All current players: ${state.players}`);

      setPlayers([...state.players]);
    });
  };

  const selectPlayer = (event: any) => {
    const selectedPlayerId: number = event.target.value - 1;
    console.log(selectedPlayerId);
    setPlayer(players[selectedPlayerId]);
  };

  return (
    <div>
      {players.length > 0 && (
        <>
          <Select value="" onChange={selectPlayer}>
            {players.map((player) => (
              <MenuItem key={player.id} value={player.id}>
                {player.name}
              </MenuItem>
            ))}
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
