export const isUserLoggedIn = () => !!localStorage.getItem('accessToken');
export const isUserStudent = () => {
    const type = localStorage.getItem('role');
    return isUserLoggedIn() && type === 'student';
};
export const isUserTeacher = () => {
    const type = localStorage.getItem('role');
    return isUserLoggedIn() && type === 'teacher';
};
