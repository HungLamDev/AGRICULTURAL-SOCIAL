import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import {thunk} from 'redux-thunk'; // Remove curly braces

import rootReducer from './reducers';

import { compose } from 'redux';

const store = createStore(
  rootReducer,
  compose(applyMiddleware(thunk))
);

const DataProvider = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default DataProvider;
