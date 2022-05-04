import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../_reducers';
import _ from 'lodash';
import { saveState } from '../utils/localstorage';

export const store = createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(thunkMiddleware)
    )
);

store.subscribe(_.throttle(() => {
    if (store.getState().tokens.length > 0) {
        saveState(store.getState());
    }
}, 1000));

export default store;