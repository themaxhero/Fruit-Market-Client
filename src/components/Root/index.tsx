import React from "react";
import { Store } from "redux";
import { Provider, ReactReduxContext } from "react-redux";
import { BrowserRouter as _, Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { History } from "history";
import Navbar from "../Navbar";
import Home from "../Home";
import Create from "../Create";
import Search from "../Search";
import ProductContainer from "../ProductContainer";

interface IRootProps {
    store: Store,
    history: History,
}

type props = IRootProps;

function Root({ store, history }: props){
    return(
        <Provider store={ store }>
            <Navbar/>
            <ConnectedRouter history={ history }>
                <Switch>
                    <Route path="/" component={ Home } exact/>
                    <Route path="/register-food" component={ Create }/>
                    <Route path="/editing" component={() => <Create editingMode/>}/>
                    <Route path="/search" component={ Search }/>
                    <Route path="/product/:id" component={ ProductContainer }/>
                </Switch>
            </ConnectedRouter>
        </Provider>
    )
}

export default Root;