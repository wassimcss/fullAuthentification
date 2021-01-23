const Joi = require("@hapi/joi");


// register validation for a User
const registerValidation = (data) => {
    const schema = Joi.object({
        name :Joi.string().min(3).required(),
        email :Joi.string().min(6).email().required(),
        password : Joi.string().min(6).required(),
      
    })
    return schema.validate(data)
}

// login validation for User
const loginValidation = (data) => {
    const schema =Joi.object({
        email :Joi.string().min(6).email().required(),
        password :Joi.string().min(6).required()
    })
    return schema.validate(data)

}

module.exports = {registerValidation ,loginValidation}