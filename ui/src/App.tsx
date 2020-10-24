import React, { } from 'react';
import {
  Switch,
  Route, BrowserRouter as Router
} from "react-router-dom";
import About from './components/About';
import Landing from './components/common/landing/Landing';

const App = (): JSX.Element => {

  return (
    <>
      <Router>
        <main>
          <Switch>
            <Route path="/about" component={About} />
            <Route path="/" component={Landing} />
          </Switch>
        </main>
      </Router>
    </>
  );
}

export default App;
