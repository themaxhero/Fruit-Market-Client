export interface IConfig{
    api: string;
    port: number;
    uri: string;
}

interface IProduct {
    id: string;
    name: string;
    expirationDate: Date;
    category: string;
    price: number;
    imported: boolean;
}

interface IdLessProduct{
    name?: string;
    expirationDate?: string;
    category?: string;
    price?: number;
    imported: boolean;
}

export function submitableProd(prod: IdLessProduct){
    const allFieldsAreFilled = prod.name 
        && prod.expirationDate 
        && prod.category 
        && prod.price;
    const regex = /^[0-9]{4}-[0-1][0-9]$/;
    const expDate = prod.expirationDate
    const expDateHasValidFormat = expDate === undefined ? 
        false : regex.test(expDate);
    return (allFieldsAreFilled && expDateHasValidFormat);
}

export function fromExistingToDraft(current: product): IdLessProduct{
    const year = current.expirationDate.getFullYear();
    const month = current.expirationDate.getMonth();
    return {
        name: current.name,
        expirationDate: `${year}-${month}`,
        category: current.category,
        price: current.price,
        imported: current.imported,
    };
}

export function compareExistingWithDraft(current: product, prod: IdLessProduct){
    const regex = /^[0-9]{4}-[0-1][0-9]$/;
    const expDate = prod.expirationDate;
    const expDateHasValidFormat = 
        expDate === undefined ? false : regex.test(expDate);
    if (!expDateHasValidFormat || !expDate){
        return false
    }
    const [year, month] = expDate.split("-");
    const equalName = current.name === prod.name;
    const equalExpDate = current.expirationDate === new Date(+year, +month);
    const equalCategory = current.category === prod.category;
    const equalImported = current.imported === prod.imported;
    const equalPrice = current.price === prod.price;
    return equalName 
           && equalExpDate
           && equalCategory
           && equalImported
           && equalPrice;
}

export const baseProd: IdLessProduct = {
    imported: false,
}

export type product = IProduct;

interface ISearch{
    currentQuery: string | undefined;
}

export type searchState = ISearch;

interface IProductState {
    editingId?: string;
    creatingProduct: IdLessProduct;
    currentProduct: IProduct | undefined;
    searchResult: IProduct[] | undefined;
    prevQuery: any | undefined;
}

export type productState = IProductState;

interface IState{
    product: productState;
    search: searchState;
}

export type state = IState;