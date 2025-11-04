import {
  createCropDiagnosisService,
  listCropDiagnosisService,
  getCropDiagnosisByIdService,
  createEndorsementService,
  getEndorsementsService,
  updateEndorsementService,
  deleteEndorsementService,
} from "../services/cropDiagnosisService";

export const createCropDiagnosis = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      userId: req.user.id,
    };
    const result = await createCropDiagnosisService(payload);
    return res.status(result.statusCode).json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const listCropDiagnosis = async (req, res) => {
  try {
    const { search = "", page = 1, perPage = 10 } = req.query;

    const result = await listCropDiagnosisService({
      userId: req.user.id,
      search: search?.toString(),
      page: Number(page),
      limit: Number(perPage),
    });

    return res.status(result.statusCode).json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getCropDiagnosisById = async (req, res) => {
  try {
    const result = await getCropDiagnosisByIdService(Number(req.params.id));
    return res.status(result.statusCode).json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};



export const createEndorsement = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      createdBy: req.user?.id, 
    };

    const result = await createEndorsementService(payload);
    return res.status(result.statusCode).json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
export const getEndorsements = async (req, res) => {
  try {
    console.log("Received query params:", req.query);

    const { page = 1, limit = 10, disease } = req.query;

    const params = {
      page: Number(page),
      limit: Number(limit),
      disease: disease ? String(disease).trim().toLowerCase() : null
    };

    const result = await getEndorsementsService(params);
    return res.status(result.statusCode).json(result);

  } catch (error: any) {
    console.error("Error in getEndorsements controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateEndorsement = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = {
      ...req.body,
      updatedBy: req.user?.id,
    };

    const result = await updateEndorsementService(id, payload);
    return res.status(result.statusCode).json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const deleteEndorsement = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await deleteEndorsementService(id);
    return res.status(result.statusCode).json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};


