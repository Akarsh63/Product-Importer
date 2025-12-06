import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { validateProductDetails } from "../utils/validation";

export default function AddProductModal({
    showModal,
    setShowModal,
    onUpdate
}) {
    if (!showModal) return null;

    const API_URL = import.meta.env.VITE_API_URL;

    const [name, setName] = useState("");
    const [skuId, setSkuId] = useState("");
    const [description, setDescription] = useState("");

    const [validationErrors, setValidationErrors] = useState({});
    const [isExecuting, setIsExecuting] = useState(false);


    const handleCancel = () => {
        if (isExecuting) return;
        setShowModal(false);
    };

    const createProductHandler = async () => {
        if (isExecuting) return;

        setValidationErrors({});

        const data = {
            name,
            sku_id: skuId,
            description
        };

        const errors = validateProductDetails(data);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            toast.error("Please fix validation errors");
            return;
        }

        try {
            setIsExecuting(true);

            const response = await axios({
                url: `${API_URL}/products`,
                method: "POST",
                data
            });

            toast.success(response?.data?.message || "Product created successfully");
            onUpdate();
            setShowModal(false);
        } catch (error) {
            const message = error?.response?.data?.message || error.message;
            toast.error(message);
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[55%] max-h-[90vh] flex flex-col p-0">

                {/* Header */}
                <div className="rounded-t-xl w-full bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 sticky top-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Add New Product</h2>

                        <button
                            onClick={handleCancel}
                            disabled={isExecuting}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white flex flex-col overflow-y-scroll px-5 py-5">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-6">

                        <div>
                            <label className="block text-sm mb-1">Product Name *</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-input"
                            />
                            {validationErrors.name && (
                                <p className="error-message">{validationErrors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm mb-1">SKU ID *</label>
                            <input
                                value={skuId}
                                onChange={(e) => setSkuId(e.target.value)}
                                className="form-input"
                            />
                            {validationErrors.sku_id && (
                                <p className="error-message">{validationErrors.sku_id}</p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="form-input"
                            ></textarea>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 sticky bottom-0 rounded-b-xl border-t border-gray-200 flex justify-end gap-4">
                    <button
                        onClick={handleCancel}
                        disabled={isExecuting}
                        className={`h-9 px-8 border border-[#94BF30] text-[#94BF30] rounded hover:bg-[#94BF30] hover:text-white transition ${isExecuting ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={createProductHandler}
                        disabled={isExecuting}
                        className={`h-9 px-8 bg-[#94BF30] hover:bg-[#7CA126] text-white rounded shadow font-semibold transition ${
                            isExecuting ? "cursor-not-allowed opacity-60" : ""
                        }`}
                    >
                        Create Product
                    </button>
                </div>

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
                    font-size: 0.75rem;
                    margin-top: 0.25rem;
                    font-weight: 500;
                }
                `}
            </style>
        </div>
    );
}
