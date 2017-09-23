"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiObject_1 = require("./apiObject");
class User extends apiObject_1.ApiObject {
    constructor(token) {
        super(token, "user", "iduser", ["iduser", "login", "email", "type", "country", "lastName",
            "firstName", "phone1", "phone2", "phone3", "office", "tag", "availability", "lang", "postalcode", "city", "address1", "address2"]);
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map