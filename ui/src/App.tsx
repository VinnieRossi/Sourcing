import React from 'react';
import {
  Switch,
  Route, BrowserRouter as Router
} from "react-router-dom";
import About from './components/About';
import Landing from './components/common/landing/Landing';

const App = (): JSX.Element => {

  return (
    <>
      <header>

      </header>
      <Router>
        <main>
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/about" component={About} />
          </Switch>
        </main>
      </Router>
    </>
  );
}

export default App;
