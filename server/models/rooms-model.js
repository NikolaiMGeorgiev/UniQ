import { ObjectId } from "mongodb";

const ROOM_TYPES = {
    queue: "queue",
    schedule: "schedule"
};
const ROOM_DATA_FIELDS = [
    '_id', 'name', 'creatorId', 'startTime', 'type', 'turnDuration', 'description', 'status'
];
const ROOM_EDITABLE_FIELDS = [
    'name', 'startTime', 'type', 'turnDuration', 'description', 'status'
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
    roomData = filterRoomData(roomData, ROOM_DATA_FIELDS);
    if (!roomData.description) {
        roomData.description = "";
    }
    roomData.status = 'not-started';
    roomData.creatorId = new ObjectId(roomData.creatorId);
    const result = await collection.insertOne(roomData);
    return { status: 200, roomId: result.insertedId };
}

async function editRoom(collection, roomData) {
    const roomId = roomData._id
    const roomEditData = filterRoomData(roomData, ROOM_EDITABLE_FIELDS);
    const result = await collection.updateOne({ _id: roomId }, {$set: roomEditData});
    return result.matchedCount === 1 ? { status: 200 } : { status: 404, message: "No such room found" };
}

async function removeRoom(collection, roomId) {
    const result = await collection.deleteOne({ _id: roomId });
    return result.deletedCount === 1 ? { status: 200 } : { status: 404, message: "No such room found" };
}

function filterRoomData(roomData, acceptableFields) {
    return Object.entries(roomData).reduce((acc, curr) => {
        if (acceptableFields.indexOf(curr[0]) > -1) {
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
    ROOM_TYPES
}