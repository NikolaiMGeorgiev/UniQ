type RedirectProps = {
    path: 'login' | 'register' | 'rooms' | 'index'
} | {
    path: 'room'
    id: string
}

export const redirect = (props: RedirectProps) => {
    if ('id' in props) {
        window.location.assign(`${props.path}.html?id=${props.id}`)
    } else {
        window.location.assign(`${props.path}.html`)
    }
}
