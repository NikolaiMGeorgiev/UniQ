import { addError } from "../form"

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
            if (required && !value) return requiredErrorMessage

            if (minLength > 0 && value.length < minLength) return minLengthErrorMessage

            if (type === 'string' && typeof value !== 'string') return typeErrorMessage
            if (type === 'number' && isNaN(parseInt(value))) return typeErrorMessage
            if (type === 'email' && !isValidEmail(value)) return typeErrorMessage
            if (type === 'password' && !isValidPassword(value)) return typeErrorMessage
            if (type === 'array' && !allowedValues.includes(value)) return typeErrorMessage
        }
    }
}

const isValidEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
}

const isValidPassword = (password: string) => {
    const re = /[a-zA-Z0-9]/;
    return password.length > 5 && re.test(password);
}

const getValue = (field: HTMLInputElement) => field.value

const getRadioInputValue = (fields: HTMLInputElement[]) => {
    let value = false

    fields.map((field) => value ||= field.checked)

    return value
}

// TODO: fix schema type
export const validate = (schema: Record<string, any>) => {
    let valid = true
    const fields = document.getElementsByTagName('input')

    const findFieldByName = (name: string) => {
        let foundFields: HTMLInputElement[] = []
        for (let field of fields) {
            if (field.name === name) foundFields = [...foundFields, field]
        }

        return foundFields.length === 1 ? foundFields[0] : foundFields
    }

    Object.keys(schema).forEach((key) => {
        const fieldValidator = schema[key]
        const field = findFieldByName(key)

        if (!field) return

        const fieldValue = Array.isArray(field) ? getRadioInputValue(field) : getValue(field)

        const errorMessage = fieldValidator.test(fieldValue)
        if (errorMessage) {
            valid = false
            const fieldOrWrapper = Array.isArray(field) ? document.getElementById(`${key}-wrapper`) : field
            addError(fieldOrWrapper, errorMessage)
        }
    })

    return valid
}

