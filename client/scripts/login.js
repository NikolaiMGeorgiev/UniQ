import { clearError, prepareFormData } from './utils/form.js';
import { login } from './resources/api.js';
import { showMessage, clearMessage } from './utils/messages.js';
import { DEFAULT_ERROR_MESSAGE } from './resources/constants.js';
import { isFormElement } from './utils/typecheck.js';
import { validate, validator } from './utils/validation.js';
import { redirect } from './utils/redirect.js';
import { isUserLoggedIn } from './utils/user.js';
const schema = {
    password: validator()
        .password()
        .required('Password is a required field')
        .typeError('Please input a correct password'),
    email: validator()
        .email()
        .required('Email is a required field')
        .typeError('Please input a correct email'),
};
const clearErrorsOnChange = () => {
    document
        .getElementById('email')
        ?.addEventListener('change', () => clearError('email'));
    document
        .getElementById('password')
        ?.addEventListener('change', () => clearError('password'));
};
const onInput = (inputId) => clearError(inputId);
const onLogin = async (event) => {
    event.preventDefault();
    clearMessage('error-message');
    const loginForm = document.getElementById('login-form');
    if (!loginForm || !isFormElement(loginForm)) {
        return;
    }
    if (!validate(schema)) {
        event.preventDefault();
        return;
    }
    try {
        const formData = prepareFormData(new FormData(loginForm));
        const response = await login(formData);
        if (!response.success) {
            showMessage('error-message', response.error?.message);
        }
        else {
            localStorage.setItem('accessToken', response.data.token);
            localStorage.setItem('role', response.data.role);
            redirect({ path: 'login' });
            return;
        }
    }
    catch (err) {
        showMessage('error-message', DEFAULT_ERROR_MESSAGE);
    }
};
(() => {
    if (isUserLoggedIn()) {
        return redirect({ path: 'rooms' });
    }
    document.getElementById('login-form')?.addEventListener('submit', onLogin);
    document
        .getElementById('password')
        ?.addEventListener('input', () => onInput('password'));
    document
        .getElementById('email')
        ?.addEventListener('input', () => onInput('email'));
    clearErrorsOnChange();
})();
