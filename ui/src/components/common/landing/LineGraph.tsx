import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { Chart } from "react-charts";
import NumberFormat from "react-number-format";
import useInterval from "use-interval";

interface LineGraphProps {
  data: {
    date: string;
    value: number;
  }[];
}

const LineGraph = ({ data }: LineGraphProps) => {
  const cleanData = data.map((datum) => {
    return [new Date(datum.date).getTime(), parseFloat(datum.value.toFixed(2))];
  });

  const [cash, setCash] = useState(1000000);
  const [shares, setShares] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(0);

  const [ghostCash, setGhostCash] = useState(1000000);
  const [ghostShares, setGhostShares] = useState(0);
  const [ghostPortfolioValue, setGhostPortfolioValue] = useState(0);

  const [daysPassed, setDaysPassed] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(4);

  const [sharePrice, setSharePrice] = useState(cleanData[daysPassed][1]);
  const [inputData, setInputData] = useState([
    { label: "$ Amount", data: cleanData.slice(0, daysPassed + 1) },
  ]);

  const calculateGhostPortfolio = () => {
    const sharePrice = cleanData[daysPassed][1];
    const numberOfPurchasedShares = Math.floor(ghostCash / sharePrice);
    const transactionAmount = parseFloat(
      (numberOfPurchasedShares * sharePrice).toFixed(2)
    );
    const newBalance = parseFloat((ghostCash - transactionAmount).toFixed(2));

    setGhostShares(numberOfPurchasedShares);
    setGhostCash(newBalance);
  };

  useEffect(() => {
    calculateGhostPortfolio();
  }, []);

  useEffect(() => {
    const portfolioValue = cash + parseFloat((sharePrice * shares).toFixed(2));

    const ghostPortfolioValue =
      ghostCash + parseFloat((sharePrice * ghostShares).toFixed(2));

    setPortfolioValue(portfolioValue);
    setGhostPortfolioValue(ghostPortfolioValue);
  }, [sharePrice]);

  useInterval(() => {
    if (daysPassed === cleanData.length - 1) {
      setIsGameOver(true);
      console.log("GAME OVER!");
    } else if (!isPaused) {
      // Trigger a new day. This means a new graph draw and new share price
      setSharePrice(cleanData[daysPassed + 1][1]);
      setInputData([
        {
          label: "$ Amount",
          data: cleanData.slice(0, daysPassed + 2), // We add an additional value here since the graph drawing is based off of a slice command
        },
      ]);
      setDaysPassed(daysPassed + 1);
    }
  }, 500 * gameSpeed);

  const series = useMemo(
    () => ({
      showPoints: true,
    }),
    []
  );

  const getSeriesStyle = React.useCallback((series) => {
    return {
      fill: "#28A96C",
      color: "#28A96C",
    };
  }, []);

  const axes = useMemo(
    () => [
      { primary: true, type: "time", position: "bottom" },
      { type: "linear", position: "left" },
    ],
    []
  );

  const purchaseShares = () => {
    const sharePrice = cleanData[daysPassed][1];
    const numberOfPurchasedShares = Math.floor(cash / sharePrice);
    const transactionAmount = parseFloat(
      (numberOfPurchasedShares * sharePrice).toFixed(2)
    );
    const newBalance = parseFloat((cash - transactionAmount).toFixed(2));

    // Remove
    console.log(`Bought on day ${daysPassed}, at price ${sharePrice}`);
    console.log(
      `Buying ${numberOfPurchasedShares} shares for ${transactionAmount}`
    );
    console.log(`New balance: ${newBalance}`);

    setShares(numberOfPurchasedShares);
    setCash(newBalance);
  };

  const sellShares = () => {
    const sharePrice = cleanData[daysPassed][1];
    const shareSellAmount = parseFloat((sharePrice * shares).toFixed(2));
    const newBalance = parseFloat((cash + shareSellAmount).toFixed(2));

    // Remove
    console.log(`Sold on day ${daysPassed}, at price ${sharePrice}`);
    console.log(`Selling ${shares} shares for ${sharePrice}`);
    console.log(`New balance: ${newBalance}`);

    setShares(0);
    setCash(newBalance);
  };

  return (
    <>
      <div
        style={{
          width: "1200px",
          height: "300px",
        }}
      >
        <Chart
          data={inputData}
          series={series}
          getSeriesStyle={getSeriesStyle}
          axes={axes}
          tooltip
        />
        <Grid container justify="center">
          <Grid item container justify="center" spacing={3}>
            <Grid item>
              <Button
                onClick={() => {
                  setGameSpeed(Math.min(gameSpeed + 1, 10));
                }}
              >
                Slow down
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  setGameSpeed(Math.max(gameSpeed - 1, 1));
                }}
              >
                Speed up
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ background: "#28A96C" }}
                onClick={purchaseShares}
              >
                Buy
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={sellShares}
              >
                Sell
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setIsPaused(!isPaused);
                }}
              >
                {isPaused ? "Resume" : "Pause"}
              </Button>
            </Grid>
          </Grid>

          <Grid item>
            <h2>
              <NumberFormat
                value={sharePrice}
                decimalScale={2}
                fixedDecimalScale
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
              />
            </h2>
          </Grid>

          <Grid item container justify="center" spacing={2}>
            <Grid item container justify="center" spacing={3}>
              <Grid item>
                <Typography>Balance:</Typography>
                <NumberFormat
                  value={cash}
                  decimalScale={2}
                  fixedDecimalScale
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </Grid>
              <Grid item>
                <Typography>Shares: </Typography>
                <Typography>{shares}</Typography>
              </Grid>
              <Grid item>
                <Typography>Portfolio Value: </Typography>
                <NumberFormat
                  value={portfolioValue}
                  decimalScale={2}
                  fixedDecimalScale
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </Grid>
            </Grid>

            <Grid item container justify="center" spacing={3}>
              <Grid item>
                <Typography>Ghost Balance:</Typography>
                <NumberFormat
                  value={ghostCash}
                  decimalScale={2}
                  fixedDecimalScale
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </Grid>
              <Grid item>
                <Typography>Ghost Shares: </Typography>
                <Typography>{ghostShares}</Typography>
              </Grid>
              <Grid item>
                <Typography>Ghost Portfolio Value: </Typography>
                <NumberFormat
                  value={ghostPortfolioValue}
                  decimalScale={2}
                  fixedDecimalScale
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default LineGraph;
