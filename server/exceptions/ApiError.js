export default class ApiError extends Error {
    constructor(status, message, details) {
        super(message);
        this.status = status;
        this.details = details;
    }

    static Unauthorized(details) {
        return new ApiError(401, 'Unauthorized error', details);
    }

    static BadRequest(details) {
        return new ApiError(400, 'Bad Request error', details);
    }

    static NotFound(details) {
        return new ApiError(404, 'Not Found error', details);
    }

    static Forbidden(details) {
        return new ApiError(403, 'Forbidden error', details);
    }
}

/*
 * A static method is a function that belongs to the class it self, 
 * not to any specific instance (object) of that class. 
 * * It is called directly using the class name without needing an object beforehand.
 */