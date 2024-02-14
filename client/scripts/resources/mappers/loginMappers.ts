import { Login } from "../types";
import { getStringValue } from "./utils";

export const mapFormDataToLogin = (formData: FormData): Login => {
    const formDataEntries = Object.fromEntries(formData.entries())

    return {
        password: getStringValue(formDataEntries, 'password') ?? '',
        email: getStringValue(formDataEntries, 'email') ?? '',
    }
}