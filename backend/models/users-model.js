import crypto from "crypto";
import { ObjectId } from "mongodb";

const USER_TYPE = {
    student: 1,
    teacher: 2
};

async function getUser(collection, id) {
    const user = await collection.findOne({ _id: new ObjectId(id) });
    return user;
}

async function getUserByToken(collection, userToken) {
    const user = await collection.findOne({ token: userToken });
    return user;
}

async function addUser(collection, userData) {
    let filteredUserData = filterUserData(userData);
    const existingUser = await collection.findOne({
        username: userData.username, 
        password: userData.password
    });
    if (!existingUser) {
        const token = crypto.randomBytes(32).toString('hex');
        filteredUserData.token = token;
        await collection.insertOne(filteredUserData);
        return { status: 200 };
    } else {
        return { status: 409, message: "Username already taken"};
    }
}

async function validateUser(collection, userData) {
    const existingUser = await collection.findOne({
        username: userData.username, 
        password: userData.password
    });
    if (existingUser) {
        return { status: 200, data: existingUser};
    } else {
        return { status: 401, message: "Wrong username or password"};
    }
}

function filterUserData(userData) {
    return Object.entries(userData).reduce((acc, curr) => {
        if (['username', 'name', 'type', 'password'].indexOf(curr[0]) > -1) {
            acc[curr[0]] = curr[1];
        }
        return acc;
    }, {});
}

export {
    addUser,
    getUser,
    getUserByToken,
    validateUser,
    USER_TYPE
}