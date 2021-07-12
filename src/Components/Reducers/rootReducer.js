import { combineReducers } from "redux";
import categoryReducer from "./CategoryReducer";
import categoryPageReducer from './CategoryPageReducer'

const DEFAULT_REDUCER = (initstate, action) => {
	return {
		key: "HELLOW WORLD",
	};
};


const rootReducer = combineReducers({
	DEFAULT: DEFAULT_REDUCER,
	categories: categoryReducer,
	categoryPages: categoryPageReducer
})


export default rootReducer;