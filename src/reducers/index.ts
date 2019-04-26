import { combineReducers } from "redux-loop";
import products from "./product";
import search from "./search";
import { connectRouter } from "connected-react-router";
import { History } from "history";

export default (history: History<any>) => {
    return combineReducers({ 
        product: products,
        search,
        router: connectRouter(history),
    } as any);
}