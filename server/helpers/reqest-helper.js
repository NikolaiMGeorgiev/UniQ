import { ObjectId } from "mongodb";
import { getUser } from "../models/users-model.js";
import { DATABASE_ID_COLUMNS, JWT_SECRET } from "../../config.js";
import jwt from 'jsonwebtoken';

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

async function getReqestData(db, req, getUserData = false) {
    const reqestBody = req.body && Object.keys(req.body).length ? req.body : {};
    const fullData = { data: reqestBody };
    const userId = req.auth && req.auth.id ? new ObjectId(req.auth.id) : null;
    fullData.userId = userId;

    if (userId && getUserData) {
        const userData =  await db.querySingle("users", userId, getUser);
        fullData.userData = userData;
    }

    if (req.params) {
        const paramsRoomData = Object.entries(req.params)
            .reduce((acc, curr) => {
                const [ key, value ] = curr;
                acc[key] = DATABASE_ID_COLUMNS.indexOf(key) > -1 ? new ObjectId(value) : value;
                return acc;
            }, {});
        Object.assign(fullData.data, paramsRoomData);
    }

    return fullData;
}

function decodeToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.id) {
            return;
        }
        return decoded;
    } catch (error) {
        console.error(error);
    }
}

function encodeToken(id) {
    return jwt.sign({ id }, JWT_SECRET);
}

export {
    handleResponse,
    getReqestData,
    encodeToken,
    decodeToken
}