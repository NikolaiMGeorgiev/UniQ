type Path = 'login' | 'register' | 'rooms' | 'index'
export const redirect = (path: Path) => {
    window.location.pathname = `${path}.html`
}