module.exports = class UnissuedTokens {
    constructor(user) {
        this._user = user;
        this._tokens = [];
    }

    Process(data) {
        for (const item of data.rows) {
            if(item.owner === this._user) {
                this._tokens.push(item);
            }
        }
        return this._tokens;
    }
}
