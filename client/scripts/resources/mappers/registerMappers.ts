import { Register, Role } from "../types.js";
import { FormDataEntry, getStringValue } from "./utils.js";

const getRole = (formDataEntries: FormDataEntry, defaultValue: Role): Role => {
    if (!('type' in formDataEntries)) {
        return defaultValue
    }

    const stringifiedValue = String(formDataEntries.type)
    if ('student' === stringifiedValue || 'teacher' === stringifiedValue) {
        return stringifiedValue
    }

    return defaultValue
}

export const mapFormDataToRegister = (formData: FormData): Register => {
    const formDataEntries = Object.fromEntries(formData.entries())

    return {
        password: getStringValue(formDataEntries, 'password') ?? '',
        email: getStringValue(formDataEntries, 'email') ?? '',
        name: getStringValue(formDataEntries, 'name') ?? '',
        role: getRole(formDataEntries, 'student'),
    }
}