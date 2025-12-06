import React, { useEffect, useState } from "react";
import ToggleSwitch from "./ToggleSwitch";
import axios from "axios";
import toast from "react-hot-toast";
import { validateProductDetails } from "../utils/validation";

export default function UpdateProductDetailsModal({
    showModal,
    setShowModal,
    productDetails,
    setProductDetails,
    onUpdate
}) {
    if (!showModal || !productDetails) return null;

    const API_URL = import.meta.env.VITE_API_URL;

    const [productCopy, setProductCopy] = useState(productDetails);
    const [validationErrors, setValidationErrors] = useState({});
    const [isExecuting, setIsExecuting] = useState(false);

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleValueChange = (name, value) => {
        setProductDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updateProductHandler = async () => {
        if (isExecuting) return;

        try {
            setIsExecuting(true);

            const errors = validateProductDetails(productDetails);
            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
                throw new Error("Please fix the validation errors");
            }

            let data = {};
            Object.keys(productCopy).forEach((key) => {
                if (productCopy[key] !== productDetails[key]) {
                    data[key] = productDetails[key];
                }
            });

            if (Object.keys(data).length === 0) {
                throw new Error("Nothing has been updated");
            }

            const url = `${API_URL}/products/${productDetails.id}`;

            const response = await axios({
                url,
                method: "PUT",
                data,
            });

            toast.success(response?.data?.message || "Product updated successfully");

            onUpdate(productDetails.id, data);
            setShowModal(false);
        } catch (error) {
            const msg = error?.response?.data?.message || error.message;
            console.log(error)
            toast.error(msg);
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[45%] max-h-[90vh] flex flex-col">
                
                <div className="rounded-t-xl w-full bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 sticky top-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Product Details</h2>
                        <button
                            onClick={handleCancel}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition"
                            disabled={isExecuting}
                        >
                            ×
                        </button>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                        Update details for{" "}
                        <span className="font-medium text-gray-900">
                            {productCopy?.name}
                        </span>
                    </p>
                </div>

                <div className="px-6 py-5 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 gap-y-6">

                        <div>
                            <label className="block text-sm mb-1 font-medium">Product Name *</label>
                            <input
                                name="name"
                                value={productDetails.name}
                                onChange={(e) => handleValueChange("name", e.target.value)}
                                className="form-input"
                            />
                            {validationErrors.name && (
                                <p className="error-message">{validationErrors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm mb-1 font-medium">SKU ID *</label>
                            <input
                                name="sku_id"
                                value={productDetails.sku_id}
                                onChange={(e) => handleValueChange("sku_id", e.target.value)}
                                className="form-input"
                            />
                            {validationErrors.sku_id && (
                                <p className="error-message">{validationErrors.sku_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm mb-1 font-medium">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={productDetails.description || ""}
                                onChange={(e) =>
                                    handleValueChange("description", e.target.value)
                                }
                                className="form-input min-h-[90px]"
                            />
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm">Active Status</span>
                            <ToggleSwitch
                                isChecked={productDetails.is_active}
                                handleCheckboxChange={(value) =>
                                    handleValueChange("is_active", value)
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
                    <button
                        onClick={handleCancel}
                        disabled={isExecuting}
                        className={`h-9 px-8 border border-[#94BF30] text-[#94BF30] rounded 
                            hover:bg-[#94BF30] hover:text-white transition 
                            ${isExecuting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={updateProductHandler}
                        disabled={isExecuting}
                        className={`h-9 px-8 bg-[#94BF30] hover:bg-[#7CA126] text-white rounded shadow font-semibold transition 
                            ${isExecuting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        Update Product
                    </button>
                </div>

                <style>
                    {`
                    .form-input {
                        border: 1px solid #e0e0e0;
                        background: #F6F6F6;
                        border-radius: 7px;
                        padding: 0.5rem 0.75rem;
                        width: 100%;
                        font-size: 1rem;
                        font-weight: 500;
                        transition: all 0.2s ease;
                    }
                    .error-message {
                        color: #ef4444;
                        font-size: 0.8rem;
                        font-weight: 500;
                        margin-top: 4px;
                    }
                    `}
                </style>
            </div>
        </div>
    );
}
