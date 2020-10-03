import React from 'react';
import {
  Switch,
  Route, BrowserRouter as Router
} from "react-router-dom";
import LandingComponent from './common/landing/Landing';

const App = (): JSX.Element => {

  return (
    <>
      <header>

      </header>
      <Router>
        <main>
          <Switch>
            <Route path="/" component={LandingComponent} />
          </Switch>
        </main>
      </Router>
    </>
  );
}

export default App;
