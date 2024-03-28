// error middleware for error massage
exports.notFound = (_req, res, _next) => {
    const err = new Error("Route not found");                       
    err.status = 404;
    res.status(err.status).json({error: err.message});
};

// error middleware is usee for an error middleware
exports.errorHandler = (err, req, res, _next) =>{
    if(err.error){
        return res.status(err.status || 404).json({error: err.massage});
    }
    res.status(err.status || 500).json({error: err.message || "unknown error occurred"})
}