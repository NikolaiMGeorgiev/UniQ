import { ObjectId } from "mongodb";
import { ROOM_TYPES } from "./rooms-model.js";

async function getScheduleByUser(collection, userId) {
    return await collection.find({ studentId: userId }).toArray();   
}

async function getScheduleByRoom(collection, data) {
    const sortBy = data.type == "queue" ? { entryTime: 1 } : { position: 1 };
    return await collection.find({ room_id: data._id }).sort(sortBy).toArray();
}

async function getUserRoomSchedule(collection, data) {
    const schedule = await collection.findOne({ room_id: data.roomId, studentId: data.studentId });
    return schedule ? {
        studentId: schedule.studentId,
        position: schedule.position,
        finished: schedule.finished
    } : {};
}

async function addToShcedule(collection, roomData) {
    let scheduleData = [];
    const students = roomData.students;
    for (let position in students) {
        const student = students[position];
        scheduleData.push({
            room_id: roomData._id,
            studentId: new ObjectId(student),
            position: roomData.type == ROOM_TYPES.schedule ? position : undefined,
            link: null,
            entryTime: null,
            finished: 0
        });
    }
    return await collection.insertMany(scheduleData);
}

async function removeSchedulesForRoom(collection, roomId) {
    return await collection.deleteMany({ room_id: roomId });
}

async function updateStartTimeByRoom(collection, data) {
    return await collection.updateMany(
        { room_id: data.roomId },
        { $inc: { startTime: data.timeOffset } }
    );
}

export {
    addToShcedule,
    getScheduleByUser,
    removeSchedulesForRoom,
    getScheduleByRoom,
    updateStartTimeByRoom,
    getUserRoomSchedule,
}