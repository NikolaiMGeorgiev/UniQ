export const removeLoader = (id: string) => {
    const loader = document.getElementById(id)
    if (loader) {
        loader.remove()
    }
}