const Joi = require('joi');

const querySchema = Joi.object({
    limit: Joi.number(),
    loginSubstring: Joi.string()
});
export const createSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().regex(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i).required(),
    age: Joi.number().min(4).max(130).required(),
    isDeleted: Joi.boolean().required()
});

export const updateSchema = Joi.object({
    login: Joi.string(),
    password: Joi.string().regex(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i),
    age: Joi.number().min(4).max(130),
    isDeleted: Joi.boolean()
});

export default querySchema;
