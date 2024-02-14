import { addError } from './form.js';
import { getSelectedOptions } from './getSelectedStudentIds.js';
import { isInputElement } from './typecheck.js';
export const validator = function () {
    let type = 'string';
    let required = true;
    let minLength = 0;
    let minValue = -Infinity;
    let requiredErrorMessage = '';
    let typeErrorMessage = '';
    let minLengthErrorMessage = '';
    let minValueErrorMessage = '';
    return {
        string: function () {
            type = 'string';
            return this;
        },
        number: function () {
            type = 'number';
            return this;
        },
        boolean: function () {
            type = 'boolean';
            return this;
        },
        date: function () {
            type = 'date';
            return this;
        },
        multiselect: function () {
            type = 'multiselect';
            return this;
        },
        password: function () {
            type = 'password';
            return this;
        },
        email: function () {
            type = 'email';
            return this;
        },
        required: function (errorMessage) {
            required = true;
            requiredErrorMessage = errorMessage ?? 'This field is required';
            return this;
        },
        notRequired: function () {
            required = false;
            return this;
        },
        min: function (value, errorMessage) {
            minValue = value;
            minValueErrorMessage =
                errorMessage ??
                    `The min value for this field is ${minValue}`;
            return this;
        },
        minLength: function (l, errorMessage) {
            minLength = l;
            minLengthErrorMessage =
                errorMessage ??
                    `This field should be at least ${minLength} characters long`;
            return this;
        },
        typeError: function (errorMessage) {
            typeErrorMessage = errorMessage;
            return this;
        },
        test: function (value) {
            if (required && isEmptyValue(getValue(value, type)))
                return requiredErrorMessage;
            if (minLength > 0 &&
                (typeof value === 'boolean' || value.length < minLength))
                return minLengthErrorMessage;
            if (typeof value === 'string' && !isNaN(parseInt(value)) && minValue > -Infinity && parseInt(value) < minValue)
                return minValueErrorMessage;
            if (type === 'multiselect' && !getSelectedOptions().length)
                return typeErrorMessage;
            if (typeof value !== 'string')
                return typeErrorMessage;
            if (type === 'string' && typeof value !== 'string')
                return typeErrorMessage;
            if (type === 'number' && isNaN(parseInt(value)))
                return typeErrorMessage;
            if (type === 'date' && isNaN(new Date(value).valueOf()))
                return typeErrorMessage;
            if (type === 'email' && !isValidEmail(value))
                return typeErrorMessage;
            if (type === 'password' && !isValidPassword(value))
                return typeErrorMessage;
        },
    };
};
const getValue = (value, type) => type === 'multiselect' ? getSelectedOptions() : value;
const isEmptyValue = (value) => Array.isArray(value) ? !value.length : !value;
const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
const isValidPassword = (password) => {
    const re = /[a-zA-Z0-9]/;
    return password.length > 5 && re.test(password);
};
const getFieldValue = (field) => {
    if (Array.isArray(field)) {
        return getRadioInputValue(field);
    }
    if (isInputElement(field)) {
        return field.value;
    }
    return getSelectedOptions();
};
const getRadioInputValue = (fields) => {
    let value = false;
    fields.map((field) => {
        if (isInputElement(field)) {
            value ||= field.checked;
        }
    });
    return value;
};
export const validate = (schema) => {
    let valid = true;
    Object.keys(schema).forEach((key) => {
        const fieldValidator = schema[key];
        const fieldNodes = Array.from(document.getElementsByName(key));
        const field = fieldNodes.length === 1 ? fieldNodes[0] : fieldNodes;
        if (!field || (Array.isArray(field) && !field.length))
            return;
        const fieldValue = Array.isArray(field)
            ? getRadioInputValue(field)
            : getFieldValue(field);
        // TODO remove after testing
        const errorMessage = fieldValidator.test(fieldValue);
        if (errorMessage && key != "type") {
            valid = false;
            const errorFieldName = Array.isArray(field) ? `${key}-wrapper` : key;
            addError(errorFieldName, errorMessage);
        }
    });
    return valid;
};
