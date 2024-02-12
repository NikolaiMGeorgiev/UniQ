const apiRoute = 'http://localhost:8080';
const token = localStorage.getItem("accessToken");
export const login = async (params) => {
    const response = await fetch(`${apiRoute}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: params,
        mode: 'cors',
    });
    return response.json();
};
export const register = async (params) => {
    const response = await fetch(`${apiRoute}/register`, {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
    });
    return await response.json();
};
export const getRooms = async () => {
    const response = await fetch(`${apiRoute}/api/rooms`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        mode: 'cors'
    });
    const responseParsed = await response.json();
    return {
        success: true,
        error: null,
        data: responseParsed.data
    };
};
export const fetchRooms = async () => {
    // const response = await fetch(`${apiRoute}/rooms`, {
    //     method: 'GET',
    //     mode: 'cors'
    // })
    // return response.json();
    return {
        success: true,
        error: null,
        // data: rooms,
        data: []
    };
};
export const fetchRoom = async (id) => {
    const response = await fetch(`${apiRoute}/api/rooms/${id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        mode: 'cors'
    });
    const responseParsed = await response.json();
    return {
        success: true,
        error: null,
        data: responseParsed.data.roomData,
        schedule: responseParsed.data.schedule
    };
};
export const createRoom = async (roomData) => {
    const response = await fetch(`${apiRoute}/api/rooms`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        mode: 'cors',
        body: roomData,
    });
    return response.json();
};
export const updateRoom = async (id, roomData) => {
    const response = await fetch(`${apiRoute}/api/rooms/${id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: roomData,
    });
    return response.json();
};
export const deleteRoom = async (id) => {
    const response = await fetch(`${apiRoute}/api/rooms/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        mode: 'cors',
    });
    return response.json();
};
export const fetchStudents = async () => {
    const response = await fetch(`${apiRoute}/students`, {
        method: 'GET',
        mode: 'cors'
    });
    const responseParsed = await response.json();
    return {
        success: true,
        error: null,
        data: responseParsed.data,
    };
};
