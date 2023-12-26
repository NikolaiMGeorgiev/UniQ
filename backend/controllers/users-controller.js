import { addUser, validateUser } from "../models/users-model.js";
import { handleResponse } from "../helpers/reqest-helper.js";

class UserController {
    
    constructor(db) {
        this.db = db;
    }

    async initEndpoints(app) {
        app.post('/register', async (req, res) => {
            await this.userHandler(req, res, addUser);
        });
        
        app.post('/login', async (req, res) => {
            await this.userHandler(req, res, validateUser);
        });
    }

    async userHandler(req, res, cb) {
        const userData = req.body;
        const result = await this.db.querySingle("users", userData, cb);
        handleResponse(res, result);
    }
}

export {
    UserController
}