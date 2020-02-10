const UnissuedTokens = require("../models/unissued_tokens.js");

module.exports = {
    GetUsersUnissuedTokens(user, data) {
        let tokens = new UnissuedTokens(user);
        return tokens.Process(data);
    }
}
