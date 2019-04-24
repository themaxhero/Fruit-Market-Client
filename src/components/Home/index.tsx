import React from "react";
import Button from "react-bootstrap/Button";
import { push } from "connected-react-router";
import { connect } from "react-redux"
import { Dispatch } from 'redux';
import "./index.css"

function Home({ onClick }: any){
    return (
        <div className="Home">
            <h1 className="center">Welcome to the Feira da Fruta.</h1>
            <Button variant="primary" onClick={ onClick }>
                Create a new Product
            </Button>
        </div>
    );
}

function mapDispatchToProps(dispatch: Dispatch){
    return {
        onClick: () => dispatch(push("/register-food")),
    };
}

export default connect(null, mapDispatchToProps)(Home);