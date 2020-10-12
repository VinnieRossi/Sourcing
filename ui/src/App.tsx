import React, { useEffect, useState } from 'react';
import {
  Switch,
  Route, BrowserRouter as Router
} from "react-router-dom";
import axios from 'axios'
import About from './components/About';
import { API_BASE_URL } from './components/common/constants';
import Landing from './components/common/landing/Landing';

const App = (): JSX.Element => {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/banner`)
      .then(
        (result: any): void => {
          setShowBanner(result.data.showBanner);
          setBannerMessage(result.data.bannerMessage);
        }
      )
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Router>
        <main>
          {showBanner && <span>{bannerMessage}</span>}
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
