export const validateProductDetails = (data) => {
    let errors = {};

    if (!data.name || data.name.trim() === "") {
        errors.name = "Product name is required";
    }

    if (!data.sku_id || data.sku_id.trim() === "") {
        errors.sku_id = "SKU ID is required";
    }

    return errors;
};