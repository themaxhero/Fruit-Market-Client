import React from "react";
import "./index.css"
import { formatMoney } from "../../utils";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { Dispatch } from "redux";

function SearchProduct({ product, onClick }: any){
    const { id, name, price, category, imported } = product;
    return (<div className="SearchPage-product
                            bg-light
                            round
                            no-select"
                            key={ id } 
                 onClick={() => onClick(id)}>
                <div className="SearchPage-product-topbar bg-dark rounded-top">
                    <div className="SearchPage-pdt-name">{ name }</div> 
                    <div className="SearchPage-pdt-prc-value">
                        { formatMoney("$", price) }
                    </div>
                </div>
                <div className="SearchPage-pdt-info rounded-bottom">
                    <div>Category: { category }</div>
                    <div>Origin: { imported ? "Imported" : "National" }</div>
                </div>
            </div>)
}

function mapDispatchToProps(dispatch: Dispatch){
    return { onClick: (id: string) => dispatch(push(`/product/${id}`)) }
}

export default connect(null, mapDispatchToProps)(SearchProduct);