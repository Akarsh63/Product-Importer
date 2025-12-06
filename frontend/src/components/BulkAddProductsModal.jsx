import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function BulkAddProductsModal({
    showModal,
    setShowModal,
    onUpdate
}) {
    if (!showModal) return null;

    const API_URL = import.meta.env.VITE_API_URL;
    const [file, setFile] = useState(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleCancel = () => {
        if (isExecuting) return;
        setFile(null);
        setProgress(0);
        setShowModal(false);
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];

        if (!selected) return;

        if (!selected.name.endsWith(".csv")) {
            toast.error("Please upload only a CSV file");
            return;
        }

        setFile(selected);
    };

    const uploadCSVHandler = async () => {
        if (!file) {
            toast.error("Please upload a CSV file");
            return;
        }
        if (isExecuting) return;

        try {
            setIsExecuting(true);
            setProgress(0);

            const formData = new FormData();
            formData.append("file", file);

            const url = API_URL + "/products/bulk-upload-csv";

            const response = await axios.post(url, formData);

            toast.success(response?.data?.message || "Products uploaded successfully!");
            onUpdate();
            setShowModal(false);

        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message;
            toast.error(errorMessage);
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-[45%] rounded-xl shadow-xl border border-gray-200 flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl flex items-center justify-between">
                    <h2 className="font-bold text-lg text-gray-900">
                        Bulk Upload Products (CSV)
                    </h2>
                    <button
                        onClick={handleCancel}
                        disabled={isExecuting}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 disabled:cursor-not-allowed"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <label className="block mb-2 font-medium">Upload CSV File *</label>

                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        disabled={isExecuting}
                        className="w-full border border-gray-300 bg-gray-50 rounded p-2"
                    />

                    {/* Progress bar */}
                    {isExecuting && (
                        <div className="mt-4 w-full bg-gray-200 h-3 rounded">
                            <div
                                className="h-3 bg-green-500 rounded transition-all"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 px-6 py-4 border-t bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-xl">
                    <button
                        onClick={handleCancel}
                        disabled={isExecuting}
                        className={`h-9 px-8 border border-[#94BF30] text-[#94BF30] rounded hover:bg-[#94BF30] hover:text-white 
                        ${isExecuting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={uploadCSVHandler}
                        disabled={isExecuting}
                        className={`h-9 px-8 rounded font-semibold text-white shadow
                        bg-[#94BF30] hover:bg-[#7CA126]
                        ${isExecuting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                    >
                        Upload CSV
                    </button>
                </div>
            </div>
        </div>
    );
}
