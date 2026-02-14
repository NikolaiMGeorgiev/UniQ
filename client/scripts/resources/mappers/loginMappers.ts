import { Login } from "../types.js";
import { getStringValue } from "./utils.js";

export const mapFormDataToLogin = (formData: FormData): Login => {
    const formDataEntries = Object.fromEntries(formData.entries())

    return {
        password: getStringValue(formDataEntries, 'password') ?? '',
        email: getStringValue(formDataEntries, 'email') ?? '',
    }
}