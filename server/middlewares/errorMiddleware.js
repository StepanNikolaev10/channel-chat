import ApiError from "../exceptions/ApiError.js";

export default function(err, req, res, next) {
    console.log(err);
    if(err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message, details: err.details });
    }
    return res.status(500).json({ message: 'Unexpected error', details: err.details || null });
}