const Joi = require('joi');

const nameSchema = Joi.string().min(20).max(60).required();
const emailSchema = Joi.string().email().required();
const passwordSchema = Joi.string()
  .min(8)
  .max(16)
  .pattern(/[A-Z]/)
  .pattern(/[!@#$%^&*]/)
  .required()
  .messages({
    'string.pattern.base': 'Password must contain uppercase letter and special character'
  });
const addressSchema = Joi.string().max(400).allow('');
const ratingSchema = Joi.number().min(1).max(5).required();

const signupSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema
});

const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required()
});

const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: passwordSchema
});

const storeSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  owner_id: Joi.number().integer().required()
});

const ratingSubmitSchema = Joi.object({
  store_id: Joi.number().integer().required(),
  rating: ratingSchema
});

const userCreationSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: Joi.string().valid('admin', 'user', 'owner').required()
});

module.exports = {
  signupSchema,
  loginSchema,
  updatePasswordSchema,
  storeSchema,
  ratingSubmitSchema,
  userCreationSchema
};
