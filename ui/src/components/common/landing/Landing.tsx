import { List, ListItem, ListItemText, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import axios from 'axios'
import React, { useEffect, useState } from "react";
import { User } from '../api/apiModels';
import { API_BASE_URL } from '../constants';
import { landingStyles } from './LandingStyles';

const Landing = (): JSX.Element => {

    // TODO: Create custom hook to handle error, loading, data
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    const styles = landingStyles();

    useEffect(() => {
        axios.get<User[]>(`${API_BASE_URL}/users`)
            .then(
                (result) => {
                    setIsLoaded(true);
                    setUsers(result.data);
                }
            )
            .catch(error => {
                setIsLoaded(true);
                setError(error);
            });
    }, []);

    const createUser = () => {

        const newUser: User = {
            id: users.length ? users.length + 1 : 1,
            isActive: true
        };

        axios.post(`${API_BASE_URL}/user`, newUser)
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => console.error(err));
    };

    return (
        <div className={styles.root}>
            <Typography variant="h1" className={styles.title}>
                Landing Page
          </Typography>
            {error && <span>error: {error}</span>}
            {isLoaded && users && (
                <List>
                    {users.map((user: any) => <ListItem key={user.id}><ListItemText>User Id: {user.id}</ListItemText></ListItem>)}
                </List>
            )}

            <Button disabled={!isLoaded} onClick={createUser} variant="contained" color="primary">Create User</Button>
        </div>
    );
};

export default Landing;