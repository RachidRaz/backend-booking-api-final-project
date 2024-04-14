module.exports.ErrorHandler = (err, req, res, next) => {
    console.log("Middleware Error Handling", err);

    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
   return res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg
    })
}

