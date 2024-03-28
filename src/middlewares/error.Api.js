class APIError extends Error {
    constructor (msg, status){
        super(msg);
        this.status = status;
    }

    static badRequest = (msg = "Invalid REquest", status = 400) =>{
        return new this (msg, status);
    };

    static notFound = (msg = "no Record Found", status = 404) => {
        return new this(msg, status);
    }
    static unauthorized = (msg = "Access Denied", status = 403) => {
        return new this(msg, status);
    }
    static unauthenticated = (msg = "please login to have access", status = 401) => {
        return new this(msg, status);
    }

}

module.exports = {
    APIError,
}