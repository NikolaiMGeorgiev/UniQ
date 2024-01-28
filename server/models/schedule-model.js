import { ObjectId } from "mongodb";

async function getScheduleByUser(collection, userId) {
    return await collection.find({ studentId: userId }).toArray();   
}

async function getScheduleByRoom(collection, roomId) {
    return await collection.find({ room_id: roomId }).toArray();
}

async function getStudentSchedulePosition(collection, data) {
    const { studentId, roomId } = data;
    const roomSchedule = await getScheduleByRoom(collection, roomId);
    roomSchedule.sort((a, b) => {
        return new Date(a.startTime) - new Date(b.startTime);
    });
    return roomSchedule.findIndex(schedule => schedule.studentId.toString() == studentId);
}

async function getRemainingScheduleByRoom(collection, roomId) {
    return await collection.find({ room_id: roomId, finished: 0 }).toArray();
}


async function getUserRoomSchedule(collection, data) {
    return await collection.findOne({ room_id: data.roomId, studentId: data.studentId });
}

async function addToShcedule(collection, roomData) {
    let scheduleData = [];
    for (let student of roomData.students) {
        scheduleData.push({
            room_id: roomData._id,
            studentId: new ObjectId(student._id),
            startTime: student.startTime ? student.startTime : null,
            finished: 0
        });
    }
    return await collection.insertMany(scheduleData);
}

async function markAsFinished(collection, data) {
    return await collection.updateOne(
        { room_id: data.roomId, studentId: data.studentId },
        { $set: { finished: 1 } }
    );
}

async function removeSchedulesForRoom(collection, roomData) {
    return await collection.deleteMany({ room_id: roomData._id });
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
    markAsFinished,
    getRemainingScheduleByRoom,
    getStudentSchedulePosition
}