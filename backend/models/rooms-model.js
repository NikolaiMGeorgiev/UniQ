import { ObjectId } from "mongodb";
import { USER_TYPE } from "./users-model.js";

const ROOM_STATUSES = {
    inactive: 0,
    active: 1,
    break: 2
};
const ROOM_TYPES = {
    normal: 1,
    scheduled: 2
};
const ROOM_DATA_FIELDS = [
    '_id', 'name', 'creatorId', 'startDate', 'type', 'turnDuration', 'description', 'users', 'status', 'lastUpdated'
];

async function getRoomsByUser(collection, userData) {
    let roomsData = [];
    if (userData.type == USER_TYPE.student) {
        for (let schedule of userData.schedule) {
            let roomData = await collection.findOne({ _id: schedule.room_id });
            if (roomData) {
                roomData.startTime = schedule.startTime;
                roomsData.push(roomData);
            }
        }
    } else {
        roomsData = await collection.find({ creatorId: userData._id }).toArray();
    }
    return roomsData;
}

async function getRoom(collection, roomId) {
    return await collection.findOne({ _id: roomId });
}

async function addRoom(collection, roomData) {
    roomData = filterRoomData(roomData);
    roomData.status = 0;
    if (!roomData.description) {
        roomData.description = "";
    }
    roomData.creatorId = new ObjectId(roomData.creatorId);
    roomData.lastUpdated = null;
    await collection.insertOne(roomData);
    return { status: 200 };
}

async function editRoom(collection, roomData) {
    roomData = filterRoomData(roomData);
    const result = await collection.updateOne({ _id: roomData._id }, {$set: roomData});
    return result.matchedCount === 1 ? { status: 200 } : { status: 404, message: "No such room found" };
}

async function removeRoom(collection, roomData) {
    const result = await collection.deleteOne({ _id: roomData._id });
    return result.deletedCount === 1 ? { status: 200 } : { status: 404, message: "No such room found" };
}

function filterRoomData(roomData) {
    return Object.entries(roomData).reduce((acc, curr) => {
        if (ROOM_DATA_FIELDS.indexOf(curr[0]) > -1) {
            acc[curr[0]] = curr[1];
        }
        return acc;
    }, {});
}

export {
    addRoom,
    editRoom,
    removeRoom,
    getRoomsByUser,
    getRoom,
    ROOM_STATUSES,
    ROOM_TYPES
}