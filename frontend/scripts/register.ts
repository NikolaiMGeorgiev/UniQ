import { validate, validator } from './validation';

const schema = {
    password: validator().password().required('Password is a required field').typeError('Please input a correct password'),
    email: validator().email().required('Email is a required field').typeError('Please input a correct email'),
    name: validator().string().required('Name is a required field').typeError('Please input a correct name'),
    role: validator().oneOf(['student', 'teacher']).required('Role is a required field')
}

const onRegister = (event: SubmitEvent) => {
    event.preventDefault();
    validate(schema)
}

(() => {
    document.getElementById('register-form')?.addEventListener('submit', onRegister)
})()
