export const removeLoader = (id) => {
    const loader = document.getElementById(id);
    if (loader) {
        loader.remove();
    }
};
