import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import thunk from "redux-thunk";
import * as serviceWorker from './serviceWorker';
import {createStore ,applyMiddleware , compose} from "redux";
import rootReducer from "./Components/Reducers/rootReducer";
import { createMuiTheme ,ThemeProvider } from '@material-ui/core/styles';
import {red,blueGrey} from '@material-ui/core/colors';




const composeEnhancers=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store= createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);




const theme = createMuiTheme({
  palette: {
    primary: red,
    secondary: blueGrey,
  },
});


ReactDOM.render(
    <Provider store={store}>
    <ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
 
);


serviceWorker.unregister();
