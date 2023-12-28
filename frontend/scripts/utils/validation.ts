import { addError } from "./form"
import { getSelectedOptions } from "./getSelectedStudentIds"
import { isInputElement } from "./typecheck"

export const validator = function() {
    let type = 'string'
    let required = true
    let minLength = 0

    let requiredErrorMessage = ''
    let typeErrorMessage = ''
    let minLengthErrorMessage = ''

    let allowedValues: string[] = []

    return {
        string: function() {
            type = 'string'
            return this
        },
        number: function() {
            type = 'number'
            return this
        },
        boolean: function() {
            type = 'boolean'
            return this
        },
        date: function() {
            type = 'date'
            return this
        },
        multiselect: function() {
            type = 'multiselect'
            return this
        },
        password: function() {
            type = 'password'
            return this
        },
        email: function() {
            type = 'email'
            return this
        },
        required: function(errorMessage?: string) {
            required = true
            requiredErrorMessage = errorMessage ?? 'This field is required'
            return this
        },
        notRequired: function() {
            required = false
            return this
        },
        minLength: function(l: number, errorMessage?: string) {
            minLength = l
            minLengthErrorMessage = errorMessage ?? `This field should be at least ${minLength} characters long`
            return this
        },
        oneOf: function(options: string[]) {
            type = 'array'
            allowedValues = options
            return this
        },
        typeError: function(errorMessage: string) {
            typeErrorMessage = errorMessage
            return this
        },
        test: function(value: any) {
            if (required && isEmptyValue(getValue(value, type))) return requiredErrorMessage

            if (minLength > 0 && value.length < minLength) return minLengthErrorMessage

            if (type === 'string' && typeof value !== 'string') return typeErrorMessage
            if (type === 'number' && isNaN(parseInt(value))) return typeErrorMessage
            if (type === 'date' && isNaN((new Date(value)).valueOf()) ) return typeErrorMessage
            if (type === 'email' && !isValidEmail(value)) return typeErrorMessage
            if (type === 'password' && !isValidPassword(value)) return typeErrorMessage
            if (type === 'array' && !allowedValues.includes(value)) return typeErrorMessage
            if (type === 'multiselect' && !getSelectedOptions().length) return typeErrorMessage
        }
    }
}

const getValue = (value: any, type: string) => type === 'multiselect' ? getSelectedOptions() : value
const isEmptyValue = (value: any) => Array.isArray(value) ? !value.length : !value

const isValidEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
}

const isValidPassword = (password: string) => {
    const re = /[a-zA-Z0-9]/;
    return password.length > 5 && re.test(password);
}

const getFieldValue = (field: HTMLElement) => {
    if (Array.isArray(field)) {
        return getRadioInputValue(field)
    }

    if (isInputElement(field)) {
        return field.value
    }

    return getSelectedOptions()
}

const getRadioInputValue = (fields: HTMLElement[]) => {
    let value = false

    fields.map((field) => {
        if (isInputElement(field)) {
            value ||= field.checked
        }
    })

    return value
}

// TODO: fix schema type
export const validate = (schema: Record<string, any>) => {
    let valid = true

    Object.keys(schema).forEach((key) => {
        const fieldValidator = schema[key]
        const fieldNodes = Array.from(document.getElementsByName(key))
        const field = fieldNodes.length === 1 ? fieldNodes[0] : fieldNodes

        if (!field || (Array.isArray(field) && !field.length)) return

        const fieldValue = Array.isArray(field) ? getRadioInputValue(field) : getFieldValue(field)

        const errorMessage = fieldValidator.test(fieldValue)
        if (errorMessage) {
            valid = false
            const errorFieldName = Array.isArray(field) ? `${key}-wrapper` : key
            addError(errorFieldName, errorMessage)
        }
    })

    return valid
}

