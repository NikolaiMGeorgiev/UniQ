import { addError, clearError } from './form';
import { login } from './api'
import { showMessage, clearMessage } from './messages';
import { DEFAULT_ERROR_MESSAGE } from './constants'
import { isFormElement, isInputElement } from './utils/typecheck';

const isValidEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
}

const isValidPassword = (password: string) => {
    const re = /[a-zA-Z0-9]/;
    return password.length > 5 && re.test(password);
}

const isFieldValid = (field: 'email' | 'password'): boolean => {
    const element = document.getElementById(field)

    if (!element) return false

    if (isInputElement(element) && field === 'email') {
        return isValidEmail(element.value)
    }

    if (isInputElement(element) && field === 'password') {
        return isValidPassword(element.value)
    }

    return false
}

// TODO: convert into something like yup for validation
const isFormValid = () => isFieldValid('email') && isFieldValid('password')

const addFormErrors = () => {
    if (!isFieldValid('password')) addError(document.getElementById('password'), 'Invalid password')
    if (!isFieldValid('email')) addError(document.getElementById('email'), 'Invalid email')
}

const onInput = (inputId: string) => clearError(inputId)

const onLogin = async (event: SubmitEvent) => {
    event.preventDefault();
    clearMessage('error-message')
    const loginForm = document.getElementById('login-form')

    if (!loginForm || !isFormElement(loginForm)) {
        return
    }

    if (!isFormValid()) {
        addFormErrors()
        event.preventDefault();
        return
    }

    try {
        const response = await login(new FormData(loginForm))

        if (response.success) {
            // TODO: redirect 
            return
        }

        showMessage('error-message', response?.error?.message)
    } catch(err) {
        showMessage('error-message', DEFAULT_ERROR_MESSAGE)
    } 
}

(() => {
    document.getElementById('login-form')?.addEventListener('submit', onLogin)
    document.getElementById('password')?.addEventListener('input', () => onInput('password'))
    document.getElementById('email')?.addEventListener('input', () => onInput('email'))
})()
