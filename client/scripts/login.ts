import { clearError } from './utils/form'
import { login } from './resources/api'
import { showMessage, clearMessage } from './utils/messages'
import { DEFAULT_ERROR_MESSAGE } from './resources/constants'
import { isFormElement } from './utils/typecheck'
import { validate, validator } from './utils/validation'
import { redirect } from './utils/redirect'
import { isUserLoggedIn } from './utils/user'

const schema = {
    password: validator()
        .password()
        .required('Password is a required field')
        .typeError('Please input a correct password'),
    email: validator()
        .email()
        .required('Email is a required field')
        .typeError('Please input a correct email'),
}

const clearErrorsOnChange = () => {
    document
        .getElementById('email')
        ?.addEventListener('change', () => clearError('email'))
    document
        .getElementById('password')
        ?.addEventListener('change', () => clearError('password'))
}

const onInput = (inputId: string) => clearError(inputId)

const onLogin = async (event: SubmitEvent) => {
    event.preventDefault()
    clearMessage('error-message')
    const loginForm = document.getElementById('login-form')

    if (!loginForm || !isFormElement(loginForm)) {
        return
    }

    if (!validate(schema)) {
        event.preventDefault()
        return
    }

    try {
        const response = await login(new FormData(loginForm))

        if (!response.success) {
            showMessage('error-message', response.error?.message)
        } else {
            localStorage.setItem('accessToken', response.data.token)
            localStorage.setItem('type', response.data.type)
            redirect({ path: 'login' })
            return
        }
    } catch (err) {
        showMessage('error-message', DEFAULT_ERROR_MESSAGE)
    }
}

;(() => {
    if (isUserLoggedIn()) {
        return redirect({ path: 'rooms'})
    }

    document.getElementById('login-form')?.addEventListener('submit', onLogin)
    document
        .getElementById('password')
        ?.addEventListener('input', () => onInput('password'))
    document
        .getElementById('email')
        ?.addEventListener('input', () => onInput('email'))
    clearErrorsOnChange()
})()
