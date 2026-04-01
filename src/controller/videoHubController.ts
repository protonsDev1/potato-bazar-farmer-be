import { Request, Response } from "express";
import * as VideoHubService from "../services/videoHubService";

export const createVideoHub = async (req, res) => {
  try {
    const payload = req.body;
    const result = await VideoHubService.createVideoHubService(payload);

    return res.status(result.statusCode).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in creating Video Hub.",
    });
  }
};

export const getAllVideoHubs = async (req, res) => {
  try {
    const { page, limit, categoryId } = req.query as any;

    const result = await VideoHubService.listVideoHubsService({
      page,
      limit,
      categoryId,
    });

    return res.status(result.statusCode).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in retrieving Video Hubs.",
    });
  }
};

export const updateVideoHub = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const result = await VideoHubService.updateVideoHubService(id, payload);

    return res.status(result.statusCode).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in updating Video Hub.",
    });
  }
};

export const deleteVideoHub = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await VideoHubService.deleteVideoHubService(id);

    return res.status(result.statusCode).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in deleting Video Hub.",
    });
  }
};

export const createVideoHubCategory = async (req, res) => {
  try {
    const payload = req.body;
    const result = await VideoHubService.createVideoHubCategoryService(payload);

    return res.status(result.statusCode).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in creating Video Hub Category.",
    });
  }
};

export const getAllVideoHubCategories = async (req, res) => {
  try {
    const { page, limit } = req.query as any;

    const result = await VideoHubService.listVideoHubCategoriesService({
      page,
      limit,
    });

    return res.status(result.statusCode).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in retrieving Video Hub Categories.",
    });
  }
};

export const deleteVideoHubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await VideoHubService.deleteVideoHubCategoryService(id);

    return res.status(result.statusCode).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in deleting Video Hub Category.",
    });
  }
};
