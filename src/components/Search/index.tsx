import React, { useEffect } from "react";
import { connect } from "react-redux"
import { Dispatch } from "redux";
import "./index.css";
import SearchProduct from "./SearchProduct";
import { search } from "../../actions/product";
import { product } from '../../types/state';

function Search({ location,
                  searchResult,
                  doSearch,
                  prevQuery }: any){
    const params = new URLSearchParams(location.search);
    const name = params.get('q');
    const min = params.get('min');
    const max = params.get('max');
    const c = params.get('c');
    const imported = params.get("imported");
    const query = {name, category: c, min, max, imported};
    const newQuery = query === prevQuery;
    const queryUndefined = prevQuery === undefined;
    if ( newQuery || queryUndefined ){
        useEffect(() => { doSearch(query) });
    }
    if (searchResult){
        const results = searchResult.map(
            (product: product) => 
                <SearchProduct 
                    product={ product } 
                    key={product.id}/>
        )
        return (<div>{ results }</div>)
    }
    return (<div></div>)
}

function mapStateToProps(state: any){
    return {
        searchResult: state.product.searchResult,
        prevQuery: state.product.prevQuery,
    };
}

function mapDispatchToProps(dispatch: Dispatch){
    return {
        doSearch: (payload: any) => dispatch(search(payload)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)