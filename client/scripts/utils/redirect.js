export const redirect = (props) => {
    if ('id' in props) {
        window.location.assign(`${props.path}.html?id=${props.id}`);
    }
    else {
        window.location.assign(`${props.path}.html`);
    }
};
