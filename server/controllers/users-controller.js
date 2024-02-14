import { addUser, validateUser, getStudents, getUserByEmail } from "../models/users-model.js";
import { encodeToken, handleResponse } from "../helpers/reqest-helper.js";

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
            result.data.token = encodeToken(result.data._id.toString());
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