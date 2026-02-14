import { getStringValue } from "./utils.js";
export const mapFormDataToLogin = (formData) => {
    const formDataEntries = Object.fromEntries(formData.entries());
    return {
        password: getStringValue(formDataEntries, 'password') ?? '',
        email: getStringValue(formDataEntries, 'email') ?? '',
    };
};
