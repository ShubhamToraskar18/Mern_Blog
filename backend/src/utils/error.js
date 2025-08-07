const errorHandler = (statusCodeFromRes, msg) => {
    let error = new Error();
    error.statusCode = statusCodeFromRes;
    error.message = msg;
    return error; 
}

export default errorHandler;