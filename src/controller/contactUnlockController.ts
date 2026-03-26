import * as service from "../services/contactUnlockService";

export const createModulePricing = async (req, res) => {
  const result = await service.createModulePricing(req.body);
  return res.status(result.statusCode).json(result);
};

export const updateModulePricing = async (req, res) => {
  const result = await service.updateModulePricing(req.params.id, req.body);
  return res.status(result.statusCode).json(result);
};

export const getModulePricings = async (req, res) => {
  const result = await service.getModulePricings();
  return res.status(result.statusCode).json(result);
};

export const getModulePricingById = async (req, res) => {
  const result = await service.getModulePricingById(req.params.id);
  return res.status(result.statusCode).json(result);
};

export const unlockContact = async (req, res) => {
  const result = await service.unlockContact(req.user.id, req.body);
  return res.status(result.statusCode).json(result);
};
