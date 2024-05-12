const Sentry = require('@sentry/node');

module.exports.ErrorHandler = (err, req, res, next) => {
    // Error handler w/ reporting to sentry
    Sentry.captureException(err); 

    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    return res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg
    })

}

