export const isUserLoggedIn = () => !!localStorage.getItem('accessToken')

export const isUserStudent = () => {
    const type = localStorage.getItem('type')
    return isUserLoggedIn() && type === 'student'
}

export const isUserTeacher = () => {
    const type = localStorage.getItem('type')
    return isUserLoggedIn() && type === 'teacher'
}