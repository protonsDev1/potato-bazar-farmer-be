import {
  createCropDiagnosisService,
  listCropDiagnosisService,
  getCropDiagnosisByIdService,
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
