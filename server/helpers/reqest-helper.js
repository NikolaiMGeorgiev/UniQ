function handleResponse(res, requestData) {
    const responseJSON = {};
    const status = requestData.status ? requestData.status : 200;
    
    if (requestData.message) {
        responseJSON.message = requestData.message;
    }

    if (requestData.data) {
        if (requestData.data._id && !requestData.data.id) {
            requestData.data.id = requestData.data._id;
        }
        if (
            requestData.data.length && 
            typeof requestData.data[0] == 'object' &&
            requestData.data[0]._id &&
            !requestData.data[0].id
        ) {
            for (let single of requestData.data) {
                single.id = single._id;
            }
        }
        responseJSON.data = requestData.data;
    }

    responseJSON.success = status == 200;

    res.status(status);
    if (Object.keys(responseJSON).length) {
        res.json(responseJSON);
    } else {
        res.json(responseJSON);
    }
}

export {
    handleResponse
}