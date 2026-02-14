import { addUser, validateUser, getStudents, getUserByEmail, updateStudentToken } from "../models/users-model.js";
import { encodeToken, handleResponse } from "../helpers/reqest-helper.js";
import { DatabaseHelper } from "../helpers/database-helper.js";

class UserController {
    
    constructor() {
        this.db = new DatabaseHelper();
    }

    async initEndpoints(app) {
        app.post('/register', async (req, res) => {
            const userData = req.body;

            let result = await this.db.querySingle("users", userData.email, getUserByEmail);
            if (result) {
                return handleResponse(res, { status: 409 });
            }
            
            result = await this.db.querySingle("users", userData, addUser);
            handleResponse(res, result);
        });
        
        app.post('/login', async (req, res) => {
            const userData = req.body;
            const result = await this.db.querySingle("users", userData, validateUser);

            if (!result || result.status != 200) {
                handleResponse(res, result);
                return;
            }
            
            const userId = result.data._id;
            const token = encodeToken(userId.toString());
            const tokenUpdateResult = await this.db.querySingle("users", {userId, token}, updateStudentToken);
            if (!tokenUpdateResult || tokenUpdateResult.status != 200) {
                return handleResponse(res, tokenUpdateResult);
            }
            result.data.token = token;
            handleResponse(res, result);
        });

        app.get('/students', async (req, res) => {
            const userData = req.body;
            const result = await this.db.querySingle("users", userData, getStudents);
            handleResponse(res, result);
        });
    }
}

export {
    UserController
}