const {constants} = require("../ErrorCodes")

const ErrorHandler = () => {
  const StatusCode = res.StatusCode ? res.StatusCode : 500;
  

  switch (StatusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation Error",
        message: errorToJSON.message,
        stackTrace: errorToJSON.stack,
      });
      break;
    case constants.UNAUTHORISED:
      res.json({
        title: "UnAuthorised Access",
        message: errorToJSON.message,
        stackTrace: errorToJSON.stack,
      });
    case constants.NON_FOUND:
      res.json({
        title: "Not Found",
        message: errorToJSON.message,
        stackTrace: errorToJSON.stack,
      });
      case constants.FORBIDEN:
        res.json({
          title: "Forbidden Access",
          message: errorToJSON.message,
          stackTrace: errorToJSON.stack,
        });
        case constants.SERVER_ERROR:
            res.json({
              title: "Internal Server Error",
              message: errorToJSON.message,
              stackTrace: errorToJSON.stack,
            });
    default:
        console.log("No Error!, Working Tree Clean");
      break;
  }
};
module.exports = ErrorHandler;
