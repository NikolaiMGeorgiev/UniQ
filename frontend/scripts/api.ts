const apiRoute = './api';

// TODO: add better typing
type LoginType = (params: BodyInit) => Promise<any>
export const login: LoginType = async (params) => {
    const response = await fetch(`${apiRoute}/login`, {
        method: 'POST',
        body: params,
        mode: 'cors'
    });
    
    return response.json();
}

type RegisterType = (params: BodyInit) => Promise<any>
export const register: RegisterType = async (params) => {
    const response = await fetch(`${apiRoute}/register`, {
        method: 'POST',
        body: params,
        mode: 'cors'
    });
    
    return response.json();
}