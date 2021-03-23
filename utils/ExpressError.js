class ExpressError extends Error {
    constructor(message, statusCode) {
        super(); //calls the Error class's constructor
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
