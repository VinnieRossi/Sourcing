import React from "react";
import { Typography } from "@material-ui/core";
import { landingStyles } from "./common/landing/LandingStyles";

const About = (): JSX.Element => {

    const styles = landingStyles();

    return (
        <div className={styles.root}>
            <Typography variant="h1" className={styles.title}>
                About Page
          </Typography>
        </div>
    );
};

export default About;
