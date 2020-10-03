import { makeStyles } from "@material-ui/core";

export const landingStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: 752,
        padding: '2rem'
    },
    title: {
        fontSize: '2rem',
        margin: theme.spacing(4, 0, 2),
    },
}));