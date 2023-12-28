export const getRoomIdFromURL = () => window?.location?.search
    ?.replace('?', '')
    .split('&')
    .map((el) => el.split('='))
    .find((el) => el[0] === 'id')?.[1]
