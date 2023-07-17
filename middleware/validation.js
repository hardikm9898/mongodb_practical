const { statusCode } = require("../constant/constant");
const { validation } = require("../response-api/responseApi");

const validator = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  const valid = error == null;
  if (valid) {
    next();
  } else {
    const { details } = error;
    const message = details.map((detail) => detail.message).join(",");
    res.status(statusCode.VALIDATION_ERROR).json(validation(message));
  }
};
module.exports = validator;
