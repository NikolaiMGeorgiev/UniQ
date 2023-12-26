import { register } from './resources/api';
import { DEFAULT_ERROR_MESSAGE } from './resources/constants';
import { clearError } from './utils/form';
import { clearMessage, showMessage } from './utils/messages';
import { redirect } from './utils/redirect';
import { isFormElement } from './utils/typecheck';
import { validate, validator } from './utils/validation';

const schema = {
    password: validator()
        .password()
        .required('Password is a required field')
        .typeError('Please input a correct password')
        .minLength(7, 'Password should be at least 7 characters long'),
    email: validator().email().required('Email is a required field').typeError('Please input a correct email'),
    name: validator().string().required('Name is a required field').typeError('Please input a correct name'),
    role: validator().boolean().required('Role is a required field')
}

const onRegister = async (event: SubmitEvent) => {
    event.preventDefault();
    clearMessage('error-message')
    const loginForm = document.getElementById('register-form')

    if (!loginForm || !isFormElement(loginForm)) {
        return
    }
    
    if (!validate(schema)) {
        event.preventDefault();
        return
    }

    try {
        const response = await register(new FormData(loginForm))

        if (response.success) {
            redirect('login')
            return
        }

        if ('error' in response && response.error) {
            response.error?.message
            showMessage('error-message', response.error?.message)
        }
    } catch(err) {
        showMessage('error-message', DEFAULT_ERROR_MESSAGE)
    }
}

const clearErrorsOnChange = () => {
    document.getElementById('student')?.addEventListener('change', () => clearError('role-wrapper'))
    document.getElementById('teacher')?.addEventListener('change', () => clearError('role-wrapper'))
    document.getElementById('name')?.addEventListener('change', () => clearError('name'))
    document.getElementById('email')?.addEventListener('change', () => clearError('email'))
    document.getElementById('password')?.addEventListener('change', () => clearError('password'))
}

(() => {
    document.getElementById('register-form')?.addEventListener('submit', onRegister)
    clearErrorsOnChange()
})()
