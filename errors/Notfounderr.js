const CustomAPIError = require('./customerror');
const {StatusCodes} = require('http-status-codes');

class NotFoundError extends CustomAPIError{
    constructor(message,statusCode){
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

module.exports= NotFoundError