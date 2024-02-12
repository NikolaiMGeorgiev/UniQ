import { ObjectId } from "mongodb";

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
    '_id', 'name', 'creatorId', 'startTime', 'type', 'turnDuration', 'description', 'users', 'status', 'lastUpdated'
];

async function getRoomsById(collection, roomIds) {
    let rooms = [];
    for (let roomId of roomIds) {
        const roomData = await collection.findOne({ _id: roomId });
        roomData.id = roomData._id;
        rooms.push(roomData);
    }
    return rooms;
}

async function getRoomsByTeacher(collection, teacherId) {
    return await collection.find({ creatorId: teacherId }).toArray();
}

async function getRoom(collection, roomId) {
    return await collection.findOne({ _id: roomId });
}

async function addRoom(collection, roomData) {
    roomData = filterRoomData(roomData);
    if (!roomData.description) {
        roomData.description = "";
    }
    roomData.status = 'not-started';
    roomData.creatorId = new ObjectId(roomData.creatorId);
    roomData.lastUpdated = 0;
    const result = await collection.insertOne(roomData);
    return { status: 200, roomId: result.insertedId };
}

async function editRoom(collection, roomData) {
    roomData = filterRoomData(roomData);
    const result = await collection.updateOne({ _id: roomData._id }, {$set: roomData});
    return result.matchedCount === 1 ? { status: 200 } : { status: 404, message: "No such room found" };
}

async function removeRoom(collection, roomId) {
    const result = await collection.deleteOne({ _id: roomId });
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
    getRoomsById,
    getRoomsByTeacher,
    getRoom,
    ROOM_STATUSES,
    ROOM_TYPES
}