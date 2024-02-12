import { redirect } from "./utils/redirect.js"

const onLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('type')
    redirect({ path: 'login' })
}

(() => {
    document.getElementById('logout')?.addEventListener('click', onLogout)
})()