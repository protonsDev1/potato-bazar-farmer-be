import Joi from 'joi';

export const coldStorageSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  userId: Joi.number().integer().required(),
  capacity: Joi.number().integer().min(0).required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  district: Joi.string().required(),
  state: Joi.string().required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  email: Joi.string().email().required(),
  contactPerson: Joi.string().required(),
  licenseNumber: Joi.string().required(),
  yearOfEstablishment: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  refrigerationType: Joi.string().required(),
  powerBackup: Joi.boolean().required(),
  shedType: Joi.string().required(),
  numberOfChambers: Joi.number().integer().min(0).required(),
  computerized: Joi.boolean().required(),
  onBoardedBy: Joi.string().required(),

  storageTypes: Joi.array().items(
    Joi.object({
      type: Joi.string().required(),
    })
  ).required(),

  usageTypes: Joi.array().items(
    Joi.object({
      usage: Joi.string().required(),
    })
  ).required(),

  operationalChallenges: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
    })
  ).required(),

  elevatorsAndStuffing: Joi.array().items(
    Joi.object({
      elevatorCount: Joi.number().integer().min(0).required(),
      stuffingType: Joi.string().required(),
    })
  ).required(),

  chamberCapacities: Joi.array().items(
    Joi.object({
      chamberName: Joi.string().required(),
      capacity: Joi.number().integer().min(0).required(),
    })
  ).required(),

  sheds: Joi.array().items(
    Joi.object({
      type: Joi.string().required(),
      capacity: Joi.number().integer().min(0).required(),
    })
  ).required(),
});
