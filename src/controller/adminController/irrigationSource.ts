import {
  addIrrigationService,
  deleteIrrigationSourceService,
  getIrrigationSourceService,
  updateIrrigationSourceService,
} from "../../services/adminService/IrrigationSourceService";

export const addIrrigationSource = async (req, res) => {
  try {
    const { role } = req.user;

    const irrigationSource = req.body;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to add irrigation sources.",
      });

    const response = await addIrrigationService(irrigationSource);

    if (response.success)
      return res
        .status(200)
        .json({ message: "New Irrigation Source added Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to add irrigation source." });
  }
};

export const getIrrigationSource = async (req, res) => {
  try {
    const response = await getIrrigationSourceService();

    if (response.success)
      return res.status(200).json({ message: response.data });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve irrigation sources.",
    });
  }
};

export const updateIrrigationSource = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to update irrigation sources.",
      });

    const response = await updateIrrigationSourceService(data, id);

    if (response.success)
      return res
        .status(200)
        .json({ message: "Irrigation Source updated successfully." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update irrigation sources.",
    });
  }
};

export const deleteIrrigationSource = async (req, res) => {
  try {
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to delete irrigation sources.",
      });

    const response = await deleteIrrigationSourceService(id);

    if (response.success)
      return res
        .status(200)
        .json({ message: "Irrigation Source deleted successfully." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete irrigation sources.",
    });
  }
};
