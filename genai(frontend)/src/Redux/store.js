import { createStore } from 'redux';
import { themeReducer } from './themereducer';

const store = createStore(themeReducer);

export default store;
