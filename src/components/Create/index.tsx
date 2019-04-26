import React from "react";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import "./index.css";
import { state, submitableProd, compareExistingWithDraft } from '../../types/state';
import { Dispatch } from 'redux';
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import {creatingProductNameChange,
        creatingProductPrice,
        creatingProductOrigin,
        creatingProductExpDate,
        creatingProductCategory,
        creatingProductSubmit,
        updatingProductSubmit,
} from "../../actions/product";

function Create({editingMode,
                 product,
                 editingId,
                 currentProduct,
                 onChangeName,
                 onChangePrice,
                 onToggleImported,
                 onToggleNational,
                 onChangeExpDate,
                 onChangeCategory,
                 onSubmitNewProduct,
                 onSubmitProductUpdate,
                }: any){
    const onSubmitCreate = () => onSubmitNewProduct();
    const onSubmitUpdate = () => onSubmitProductUpdate();
    const onSubmit = editingMode && editingId ? onSubmitUpdate : onSubmitCreate;
    const current = currentProduct;
    const date = product.expirationDate ? product.expirationDate : "";
    const cantSubmit = editingMode ? 
        !submitableProd(product)
        && compareExistingWithDraft(current, product)
        : !submitableProd(product);
    return (
        <div className="ProductCreationContainer">
            <div className="dialog-topbar bg-dark text-white rounded-top">
                { editingMode ? 
                  "Editing a product" 
                  : "Create a new product"
                }
            </div>
            <Form className="ProductForm bg-light" placeholder="Category">
                <label>
                    Name:<br/> 
                    <FormControl
                        placeholder="Name"
                        value={ product.name }
                        onChange={ onChangeName }/>
                    <br/>
                </label>
                <br/>
                <label>
                    Category: <br/>
                    <Dropdown>
                        <Dropdown.Toggle 
                            variant="outline-primary" 
                            id="dropdown-basic">
                            { product.category ? product.category : "Category" }
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item 
                                onClick={() => onChangeCategory("FRUIT")}>
                                FRUIT
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => onChangeCategory("VEGETABLE")}>
                                VEGETABLE
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <br/>
                </label>
                <br/>
                <label>
                    Price:<br/>
                    <FormControl 
                        placeholder="Price"
                        type="number"
                        value={ String(product.price) }
                        onChange={ onChangePrice }
                        min="1"
                        step="0.01"
                        data-number-to-fixed="2"
                        data-number-stepfactor="100"
                    />
                    <br/>
                </label>
                <br/>
                <label>
                    Origin:<br/>
                    <Form.Check inline 
                                label="Imported"
                                type="radio"
                                onChange={ onToggleImported }
                                checked={product.imported}
                                id={`inline-radio-1`}
                    />
                    <Form.Check inline 
                                label="National"
                                type="radio"
                                onChange={ onToggleNational }
                                checked={!product.imported}
                                id={`inline-radio-2`}
                    />
                </label>
                <br/>
                <br/>
                <label>
                    Expiration Date:<br/> 
                    <FormControl 
                        placeholder="Expiration Date"
                        value={ date }
                        onChange={ onChangeExpDate }
                        alt="Format: YYYY-MM"/>
                </label>
                <br/>
                <div className="submitButtonContainer">
                    <Button onClick={onSubmit} 
                            disabled={cantSubmit}>
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
}

function mapStateToProps(state: state){
    return { 
        product: state.product.creatingProduct,
        currentProduct: state.product.currentProduct,
        editingId: state.product.editingId,
    };
}

function mapDispatchToProps(dispatch: Dispatch){
    return {
        onChangeName: (e: any) => 
            dispatch(creatingProductNameChange(e.target.value)),
        onChangePrice: (e: any) => {
            dispatch(creatingProductPrice(e.target.value))
        },
        onToggleImported: (e: any) => 
            dispatch(creatingProductOrigin(e.target.value)),
        onToggleNational: (e: any) => {
            const value = (e.target.value === "on") ? "off" : "on";
            dispatch(creatingProductOrigin(value));
        },
        onChangeExpDate: (e: any) => 
            dispatch(creatingProductExpDate(e.target.value)),
        onChangeCategory: (value: string) => 
            dispatch(creatingProductCategory(value)),
        onSubmitNewProduct: () => dispatch(creatingProductSubmit()),
        onSubmitProductUpdate: () => dispatch(updatingProductSubmit()),

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Create);