import React from "react";
import { Link, Typography } from "@material-ui/core";
import { landingStyles } from "./common/landing/LandingStyles";
import Game from "./game/Game";

const About = (): JSX.Element => {

    const styles = landingStyles();

    return (
        <div className={styles.root}>
            <Typography variant="h1" className={styles.title}>
                About Page
          </Typography>
            <Link href="/">Home</Link>
            <Game />
        </div>
    );
};

export default About;