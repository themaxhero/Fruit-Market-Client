import React, { useEffect } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { get } from "../../actions/product";
import Product from "../Product";
import { state, product } from "../../types/state";

interface OwnProps {
    match: any;
}

interface StateProps {
    currentProduct: product | undefined;
}

interface DispatchProps {
    getProduct: (id: string) => void,
}

type props = StateProps & DispatchProps & OwnProps;

function ProductContainer({ match, getProduct, currentProduct}: props){
    if (currentProduct === undefined || currentProduct.id !== match.params.id){
        useEffect(() => { getProduct(match.params.id )})
    }
    return <Product product={ currentProduct } />;
}

function mapStateToProps(state: state): StateProps {
    return { currentProduct: state.product.currentProduct };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps{
    return { getProduct: (id: string) => dispatch(get(id)) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductContainer);