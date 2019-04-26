import { History } from "history"
import { product } from '../types/state';

type uuid = string;

enum Category {
    VEGETABLE = "VEGETABLE",
    FRUIT = "FRUIT",
}

export function get(id: uuid){
    return { type: "PRODUCT/GET", payload: { id } };
}

export function edit(id: uuid, product: product){
    return { type: "PRODUCT/EDIT", payload: { id, product } };
}

export function update(id: uuid, parameters: any){
    return { type: "PRODUCT/UPDATE", payload: { id, parameters } };
}

export function destroy(id: uuid){
    return { type: "PRODUCT/DESTROY", payload: { id } };
}

export function search(payload: any){
    return { type: "PRODUCT/SEARCH", payload: payload }
}

export function productGetSuccessfulAction(response: any){
    return { type: "PRODUCT/STORE", payload: { response } };
}

export function productCreateSuccessfulAction(response: any){
    return { 
        type: "PRODUCT/CREATED_SUCCESSFULLY",
        payload: { response },
    };
}

export function productUpdateSuccessfulAction(product: any){
    return { type: "PRODUCT/UPDATED_SUCCESSFULLY", payload: { product }};
}

export function productDestroySuccessfulAction(productId: string){
    return { type: "PRODUCT/DESTROYED_SUCCESSFULLY", payload: { productId }};
}

export function productSearchSuccessfulAction(query: any){
    const type = "PRODUCT/STORE_SEARCH_RESULTS";
    const products = (response: any) => response.data.products;
    const payload = (response: any) => {
        return { products: products(response), query };
    } 
    const action = (response: any) => { 
        return {type, payload: payload(response)} 
    };
    return action;
}

export function productFailedAction(err: any){
    return { type: "PRODUCT/ERROR", payload: { err } };
}

export function creatingProductNameChange(value: string){
    const newValue = value === "" ? undefined : value;
    return {type: "PRODUCT/CREATING_NAME_CHANGE",
            payload: { value: newValue },
    };
}

export function creatingProductPrice(value: string){
    const newValue = +value;
    console.log(newValue);
    return {type: "PRODUCT/CREATING_PRICE_CHANGE",
            payload: { value: newValue },
        };
}

export function creatingProductOrigin(value: string){
    const newValue: boolean = (value === "on")
    return {type: "PRODUCT/CREATING_ORIGIN_CHANGE",
            payload: { value: newValue },
        };
}

export function creatingProductExpDate(value: string){
    return {type: "PRODUCT/CREATING_EXPDATE_CHANGE",
            payload: { value },
        };
}

export function creatingProductCategory(value: string){
    const updateCondition = value === "FRUIT" || value === "VEGETABLE";
    const newValue = updateCondition ? value : undefined;
    return {type: "PRODUCT/CREATING_CATEGORY_CHANGE",
            payload: { value: newValue },
        };
}

export function creatingProductSubmit(){
    return { type: "PRODUCT/SUBMIT_CREATION" }
}

export function updatingProductSubmit(){
    return { type: "PRODUCT/SUBMIT_UPDATE" }
}

export function redirect(destiny: string, history: History<any>){
    return { type: "PRODUCT/REDIRECT", payload: { history, destiny }}
}