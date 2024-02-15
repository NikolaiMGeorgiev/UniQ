const apiRoute = 'http://localhost:8080';
const token = localStorage.getItem("accessToken");
export const login = async (params) => {
    const response = await fetch(`${apiRoute}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        mode: 'cors',
    });
    return response.json();
};
export const register = async (params) => {
    const response = await fetch(`${apiRoute}/register`, {
        method: 'POST',
        body: JSON.stringify(params),
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
        data: responseParsed.data
    };
};
export const fetchQueue = async (id) => {
    const response = await fetch(`${apiRoute}/api/queue/${id}`, {
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
export const createRoom = async (roomData) => {
    const response = await fetch(`${apiRoute}/api/rooms`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(roomData),
    });
    return response.json();
};
export const updateRoom = async (id, roomData) => {
    const response = await fetch(`${apiRoute}/api/rooms/${id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData),
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
export const callNextStudent = async (roomId, data) => {
    const response = await fetch(`${apiRoute}/api/queue/next/${roomId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(data)
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
