import { addUser, validateUser, getStudents, getUserByEmail } from "../models/users-model.js";
import { handleResponse } from "../helpers/reqest-helper.js";
import { JWT_SECRET } from './../../config.js';
import jwt from 'jsonwebtoken';

class UserController {
    
    constructor(db) {
        this.db = db;
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

            var token = jwt.sign({ id: result.data._id }, JWT_SECRET);
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