import { addError } from "./form"

export const validator = function() {
    let type = 'string'
    let required = true

    let requiredErrorMessage = ''
    let typeErrorMessage = ''

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

const getFieldValue = (field: HTMLInputElement) => {
    if (field.type === 'radio') {
        return field.checked
    }

    return field.value
}

// TODO: fix schema type
export const validate = (schema1: Record<string, any>) => {
    const fields = document.getElementsByTagName('input')

    const findFieldByName = (name: string) => {
        for (let field of fields) {
            if (field.name === name) return field
        }

        return null
    }

    Object.keys(schema1).forEach((key) => {
        const fieldValidator = schema1[key]
        const field = findFieldByName(key)

        if (!field) return

        const fieldValue = getFieldValue(field)

        const errorMessage = fieldValidator.test(fieldValue)
        if (errorMessage) {
            const fieldOrWrapper = field.type === 'radio' ? document.getElementById(`${key}-wrapper`) : field
            addError(fieldOrWrapper, errorMessage)
        }
    })
}
