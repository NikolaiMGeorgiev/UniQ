async function getRoomQueue(collection, roomId) {
    return await collection.find({ room_id: roomId }).sort({ entryTime: 1 }).toArray();  
}

async function addToQueue(collection, data) {
    const result = await collection.insertOne({
        room_id: data.roomId,
        studentId: data.userId,
        link: null,
        entryTime: new Date().getTime()
    });
    return result && result.insertedId ? { status: 200 } : { status: 404 };
}

async function addUserLink(collection, data) {
    return await collection.updateOne(
        { room_id: data.roomId, studentId: data.studentId }, 
        { $set: { link: data.link } }
    );
}

async function emptyQueueByRoom(collection, roomId) {
    await collection.deleteMany({ room_id: roomId });
}

async function removeFromRoomQueue(collection, data) {
    return await collection.deleteOne({ 
       room_id : data.roomId,
       studentId: data.userId
    });
}

export {
    addToQueue,
    getRoomQueue,
    emptyQueueByRoom,
    removeFromRoomQueue,
    addUserLink
}