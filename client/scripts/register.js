import { displayErrorAlert } from './components/alert.js';
import { register } from './resources/api.js';
import { DEFAULT_ERROR_MESSAGE } from './resources/constants.js';
import { mapFormDataToRegister } from './resources/mappers/registerMappers.js';
import { clearError } from './utils/form.js';
import { redirect } from './utils/redirect.js';
import { isFormElement } from './utils/typecheck.js';
import { isUserLoggedIn } from './utils/user.js';
import { validate, validator } from './utils/validation.js';
const schema = {
    password: validator()
        .password()
        .required('Password is a required field')
        .typeError('Please input a correct password')
        .minLength(7, 'Password should be at least 7 characters long'),
    email: validator()
        .email()
        .required('Email is a required field')
        .typeError('Please input a correct email'),
    name: validator()
        .string()
        .required('Name is a required field')
        .typeError('Please input a correct name'),
    role: validator().boolean().required('Role is a required field'),
};
const onRegister = async (event) => {
    event.preventDefault();
    const loginForm = document.getElementById('register-form');
    if (!loginForm || !isFormElement(loginForm)) {
        return;
    }
    if (!validate(schema)) {
        event.preventDefault();
        return;
    }
    try {
        const formData = mapFormDataToRegister(new FormData(loginForm));
        const response = await register(formData);
        if (response.success) {
            redirect({ path: 'login' });
            return;
        }
        if (!response.success) {
            displayErrorAlert({ message: response.message });
        }
    }
    catch (err) {
        console.error(err);
        displayErrorAlert({ message: DEFAULT_ERROR_MESSAGE });
    }
};
const clearErrorsOnChange = () => {
    document
        .getElementById('student')
        ?.addEventListener('change', () => clearError('role-wrapper'));
    document
        .getElementById('teacher')
        ?.addEventListener('change', () => clearError('role-wrapper'));
    document
        .getElementById('name')
        ?.addEventListener('change', () => clearError('name'));
    document
        .getElementById('email')
        ?.addEventListener('change', () => clearError('email'));
    document
        .getElementById('password')
        ?.addEventListener('change', () => clearError('password'));
};
(() => {
    if (isUserLoggedIn()) {
        return redirect({ path: 'rooms' });
    }
    document
        .getElementById('register-form')
        ?.addEventListener('submit', onRegister);
    clearErrorsOnChange();
})();
