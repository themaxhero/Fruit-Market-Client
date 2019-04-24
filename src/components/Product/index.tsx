import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux"
import { edit, destroy } from "../../actions/product";
import Button from "react-bootstrap/Button"
import "./index.css"
import { formatMoney } from '../../utils';
import { product } from '../../types/state';

function getPriceText(price: string){
    if (document.documentElement.clientWidth < 465){
        return `Price: ${ price }`
    } else {
        return price
    }
}

function Product({ product, editProduct, deleteProduct }: any) {
    if (product !== undefined){
        const origin = product.imported ? "Imported" : "National";
        const date = product.expirationDate.toDateString();
        const price = formatMoney("$", product.price);
        const priceText = getPriceText(price);
        return (
            <div className="product">
                <div className="
                    d-flex
                    align-items-center
                    p-3
                    bg-dark
                    my-3
                    product-name
                    rounded
                    shadow-sm
                    no-select">
                    <div>{ product.name }</div>
                    <div>
                        <Button 
                            variant="primary"
                            onClick={() => editProduct(product.id, product)}>
                            Edit
                        </Button>
                        <Button 
                            variant="danger" 
                            onClick={() => deleteProduct(product.id)}>
                            Delete
                        </Button>
                    </div>
                </div>
                <div className="product-specs rounded p-3 bg-light">
                    <div>
                        <div>Category: { product.category } </div>
                        <div>Origin: { origin }</div>
                        <div>Expiration Date: { date }</div>
                    </div>
                    <div className="product-price">
                        <div className="d-flex justify-content-end ml-auto">
                            { priceText }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return <div>Loading...</div>
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: any){
    console.log(ownProps);
    return {
        editProduct: (id: string, product: product) => 
            dispatch(edit(id, product)),
        deleteProduct: (id: string) => {
            dispatch(destroy(id))
        },
    };
}

export default connect(null, mapDispatchToProps)(Product);