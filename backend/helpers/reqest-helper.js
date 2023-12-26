function handleResponse(res, requestData) {
    const responseJSON = {};
    const status = requestData.status ? requestData.status : 200;
    if (requestData.message) {
        responseJSON.message = requestData.message;
    }
    if (requestData.data) {
        responseJSON.data = requestData.data;
    }
    res.status(status);
    if (Object.keys(responseJSON).length) {
        res.json(responseJSON);
    } else {
        res.send();
    }
}

export {
    handleResponse
}