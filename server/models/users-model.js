const USER_TYPE = {
    student: "student",
    teacher: "teacher"
};

async function getUser(collection, id) {
    const user = await collection.findOne({ _id: id });
    return user;
}

async function getUserByEmail(collection, email) {
    return await collection.findOne({ email });
}

async function getStudents(collection) {
    const students = await collection.find({ role: USER_TYPE.student }).toArray();
    students = students.map(studentData => {
        return {
            id: studentData._id.toString(),
            name: studentData.name
        }
    });
    return { status: 200, data: students };
}

async function addUser(collection, userData) {
    let filteredUserData = filterUserData(userData);
    const existingUser = await collection.findOne({
        name: userData.name, 
        password: userData.password,
        email: userData.email
    });
    if (!existingUser) {
        await collection.insertOne(filteredUserData);
        return { status: 200 };
    } else {
        return { status: 409, message: "Username already taken"};
    }
}

async function validateUser(collection, userData) {
    const existingUser = await collection.findOne({
        email: userData.email, 
        password: userData.password
    });
    if (existingUser) {
        return { status: 200, data: existingUser};
    } else {
        return { status: 401, message: "Wrong name or password"};
    }
}

function filterUserData(userData) {
    return Object.entries(userData).reduce((acc, curr) => {
        if (['name', 'email', 'name', 'role', 'password'].indexOf(curr[0]) > -1) {
            acc[curr[0]] = curr[1];
        }
        return acc;
    }, {});
}

export {
    addUser,
    getUser,
    getStudents,
    getUserByEmail,
    validateUser,
    USER_TYPE
}