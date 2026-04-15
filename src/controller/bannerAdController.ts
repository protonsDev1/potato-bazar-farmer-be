import * as service from "../services/bannerAdService";

export const createPlan = async (req, res) => {
  const result = await service.createPlan(req.body);
  return res.status(result.statusCode).json(result);
};

export const updatePlan = async (req, res) => {
  const result = await service.updatePlan(req.params.id, req.body);
  return res.status(result.statusCode).json(result);
};

export const getPlans = async (req, res) => {
  const filters: any = {};

  if (req.query.isActive !== undefined) {
    filters.isActive = req.query.isActive === "true";
  }

  const result = await service.getPlans(filters);
  return res.status(result.statusCode).json(result);
};

export const getPlanById = async (req, res) => {
  const result = await service.getPlanById(req.params.id);
  return res.status(result.statusCode).json(result);
};

export const getMySubscription = async (req, res) => {
  const result = await service.getMySubscription(req.user.id);
  return res.status(result.statusCode).json(result);
};

export const buyPlan = async (req, res) => {
  const result = await service.buyPlan(req.user.id, req.params.planId);
  return res.status(result.statusCode).json(result);
};
