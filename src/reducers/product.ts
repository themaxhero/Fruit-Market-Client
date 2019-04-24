import { loop, Cmd } from 'redux-loop';
import { ActionCreator } from 'redux';
import axios from "axios";
import { action, cmdRunOptionsGen } from "../types/action";
import { productGetSuccessfulAction,
         productCreateSuccessfulAction,
         productUpdateSuccessfulAction,
         productSearchSuccessfulAction,
         productFailedAction,
} from "../actions/product";
import { push } from "connected-react-router";
import { productState as state,
         IConfig,
         product,
         baseProd,
         fromExistingToDraft 
} from '../types/state';

const config: IConfig = require("../config.json");
const { api, port, uri } = config;


// Helpers

function makeParam(paramName: string, param: any){
    if (!param){
        return "";
    }
    return `${paramName}=${param}`;
}

// Side-Effects

function createProduct(payload: any){
    const { name, expirationDate, category, price, imported } = payload;
    const body = { name, expirationDate, category, price, imported };
    return axios.post(`${api}:${port}${uri}/product/register`, body);
}

function getProduct(productId: string){
    const url = `${api}:${port}${uri}/product/${ productId }`;
    return axios.get(url);
}

function updateProduct(payload: any){
    const { id, name, expirationDate, category, price, imported } = payload;
    const body = { id, name, expirationDate, category, price, imported };
    return axios.post(`${api}:${port}${uri}/product/update`, body);
}

function destroyProduct(payload: any){
    const { id } = payload;
    const body = { id };
    return axios.post(`${api}:${port}${uri}/product/destroy`, body);
}

function searchProduct(payload: any){
    const { category, name, min, max, imported } = payload;
    const urlParams = [
        makeParam("q", name),
        makeParam("c", category),
        makeParam("min", min),
        makeParam("max", max),
        (imported ? "imported" : ""),
    ]
    .filter((param) => param !== "")
    .join("&")
    const url = `${api}:${port}${uri}/products?${ urlParams }`
    return axios.get(url);
}

// Actions

function get(state: state, payload: any){
    const { id } = payload;
    const options =
        cmdRunOptionsGen(productGetSuccessfulAction,
                         productFailedAction,
                         [ id ],
        );
    const cmd = Cmd.run(getProduct, options);
    return loop(state, cmd);
}

function edit(state: state, payload: any){
    const price = payload.product.price / 100;
    const prod = {...payload.product, price};
    const newState = {
        ...state,
        creatingProduct: fromExistingToDraft(prod),
        editingId: payload.id,
    };
    const cmd = Cmd.action(push("/editing"));
    console.log(cmd);
    return loop(newState, cmd);
}

function destroy(state: state, payload: any){
    const success = push("/");
    const fail = push(`/product/${ payload.id }`);
    const options = {
        successActionCreator: (a: any) => success,
        failActionCreator: (b: any) => fail,
        args: [ payload ],
    };
    const cmd = Cmd.run(destroyProduct, options);
    return loop(state, cmd);
}

function search(state: state, payload: any){
    const success = 
        productSearchSuccessfulAction(payload) as ActionCreator<any>;
    const fail = 
        productFailedAction as ActionCreator<any>;
    const options = 
        { successActionCreator: success,
          failActionCreator: fail,
          args:[ payload ],
        };
    const cmd = Cmd.run(searchProduct, options);
    return loop(state, cmd);
}

function store(state: state, payload: any){
    const { response } = payload;
    const cmd = Cmd.none;
    const decodeProduct = () => {
        const productJSON = response.data;
        const parsedJSON = JSON.parse(productJSON);
        const { expirationDate } = parsedJSON;
        const decodedProduct = 
            {...parsedJSON, expirationDate: new Date(expirationDate)};
        return decodedProduct;
    }
    const currentProduct: product = decodeProduct();
    const newState = {...state, currentProduct};
    return loop(newState, cmd);
}

function createdSuccessfully(state: state, payload: any){
    const { response } = payload;
    const decodeProduct = () => {
        const productJSON = response.data;
        const parsedJSON = JSON.parse(productJSON);
        const { expirationDate } = parsedJSON;
        const decodedProduct = 
            {...parsedJSON, expirationDate: new Date(expirationDate)};
        return decodedProduct;
    }
    const product = decodeProduct();
    const { id } = product;
    const cmd = Cmd.action(push(`/product/${ id }`));
    return loop(state, cmd);
}
function updatedSuccessfully(state: state, payload: any){
    const { response } = payload;
    const decodeProduct = () => {
        const productJSON = response.data;
        const parsedJSON = JSON.parse(productJSON);
        const { expirationDate } = parsedJSON;
        const decodedProduct = 
            {...parsedJSON, expirationDate: new Date(expirationDate)};
        return decodedProduct;
    }
    const product = decodeProduct();
    const { id } = product;
    const cmd = Cmd.action(push(`/product/${ id }`));
    return loop(state, cmd);
}
function destroyedSuccessfully(state: state, payload: any){
    const cmd = Cmd.action(push("/"));
    return loop(state, cmd);
}
function storeSearchResults(state: state, payload: any){
    console.log(payload);
    const { products, query } = payload;
    const parsedProds: product[] = products;
    const cmd = Cmd.none;
    const newState = {
        ...state, 
        searchResult: parsedProds,
        prevQuery: query,
    }
    return loop(newState, cmd);
}
function setError(state: state, payload: any){
    const { error } = payload;
    const cmd = Cmd.none;
    const newState = {...state, error}
    return loop(newState, cmd);
}

function creatingProdNameChange(state: state, payload: any){
    const { value } = payload;
    const prod = state.creatingProduct;
    const newProd = {...prod, name: value};
    const newState = {...state, creatingProduct: newProd};
    return loop(newState, Cmd.none);
}
function creatingProdPriceChange(state: state, payload: any){
    const { value } = payload;
    const prod = state.creatingProduct;
    const newProd = {...prod, price: value};
    const newState = {...state, creatingProduct: newProd};
    return loop(newState, Cmd.none);
}
function creatingProdOriginChange(state: state, payload: any){
    const { value } = payload;
    const prod = state.creatingProduct;
    const newProd = {...prod, imported: value};
    const newState = {...state, creatingProduct: newProd};
    return loop(newState, Cmd.none);
}
function creatingProdExpDateChange(state: state, payload: any){
    const { value } = payload;
    const prod = state.creatingProduct;
    const newProd = {
        ...prod, 
        expirationDate: value,
    };
    const newState = {...state, creatingProduct: newProd};
    return loop(newState, Cmd.none);
}
function creatingProdCategoryChange(state: state, payload: any){
    const { value } = payload;
    const prod = state.creatingProduct;
    const newProd = {...prod, category: value};
    const newState = {...state, creatingProduct: newProd};
    return loop(newState, Cmd.none);
}

function submitCreation(state: state){
    const prod = state.creatingProduct;
    if (prod.expirationDate === undefined){
        return loop(state, Cmd.none);
    }
    const [year, month] = prod.expirationDate.split("-");
    if (prod.name && prod.expirationDate && prod.category && prod.price){
        const body = {
            ...prod,
            price: (prod.price * 100),
            expirationDate: new Date(+year, +month)
        };
        const success = productCreateSuccessfulAction as ActionCreator<any>;
        const fail = productFailedAction as ActionCreator<any>;
        const options = {
            successActionCreator: success,
            failActionCreator: fail,
            args: [ body ]
        };
        const cmd = Cmd.run(createProduct, options);
        const newState = {creatingProduct: baseProd};
        return loop(newState, cmd)
    } else {
        throw new Error("Product does not have the required fields");
    }
}

function submitUpdate(state: state){
    const { editingId, creatingProduct} = state;
    const prod = creatingProduct;
    if (prod.expirationDate === undefined){
        return loop(state, Cmd.none);
    }
    const [year, month] = prod.expirationDate.split("-");
    const expirationDate = new Date(+year, +month);
    if (editingId 
        && prod.name
        && prod.expirationDate
        && prod.category
        && prod.price){
        const params = {
            ...creatingProduct,
            expirationDate,
        }
        const options =
            cmdRunOptionsGen(productUpdateSuccessfulAction,
                             productFailedAction,
                             [ params ],
            );
        const cmd = Cmd.run(updateProduct, options);
        return loop(state, cmd);

    }
    const cmd = Cmd.none;
    return loop(state, cmd)
}

// Reducer

const initialState: state = {
    editingId: undefined,
    creatingProduct: baseProd,
    currentProduct: undefined,
    searchResult: undefined,
    prevQuery: undefined,
}

export default function products(state: state = initialState,
                                { type, payload }: action){
    switch(type) {
        case "PRODUCT/GET":
            return get(state, payload);

        case "PRODUCT/EDIT":
            return edit(state, payload);
        
        case "PRODUCT/DESTROY":
            return destroy(state, payload);
        
        case "PRODUCT/SEARCH":
            return search(state, payload);
        
        case "PRODUCT/STORE":
            return store(state, payload);
        
        case "PRODUCT/CREATED_SUCCESSFULLY":
            return createdSuccessfully(state, payload);
        
        case "PRODUCT/UPDATED_SUCCESSFULLY":
            return updatedSuccessfully(state, payload);
        
        case "PRODUCT/DESTROYED_SUCCESSFULLY":
            return destroyedSuccessfully(state, payload);
        
        case "PRODUCT/STORE_SEARCH_RESULTS":
            return storeSearchResults(state, payload);
        
        case "PRODUCT/ERROR":
            return setError(state, payload);

        case "PRODUCT/CREATING_NAME_CHANGE":
            return creatingProdNameChange(state, payload);

        case "PRODUCT/CREATING_PRICE_CHANGE":
            return creatingProdPriceChange(state, payload);

        case "PRODUCT/CREATING_ORIGIN_CHANGE":
            return creatingProdOriginChange(state, payload);

        case "PRODUCT/CREATING_EXPDATE_CHANGE":
            return creatingProdExpDateChange(state, payload);

        case "PRODUCT/CREATING_CATEGORY_CHANGE":
            return creatingProdCategoryChange(state, payload);

        case "PRODUCT/SUBMIT_CREATION":
            return submitCreation(state);

        case "PRODUCT/SUBMIT_UPDATE":
            return submitUpdate(state);
        
        default:
            return loop(state, Cmd.none);
    }
}
