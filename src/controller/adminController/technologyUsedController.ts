import {
  addTechnologyUsedService,
  deleteTechnologyUsedService,
  getTechnologyUsedService,
  updateTechnologyUsedService,
} from "../../services/adminService/technologyUsedService";

export const addTechnologyUsed = async (req, res) => {
  try {
    const { role } = req.user;

    const technologyUsed = req.body;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to add Technology.",
      });

    const response = await addTechnologyUsedService(technologyUsed);

    if (response.success)
      return res
        .status(200)
        .json({ message: "New Technology added Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to add Technology." });
  }
};

export const getTechnologyUsed = async (req, res) => {
  try {
    const response = await getTechnologyUsedService();

    if (response.success)
      return res.status(200).json({ message: response.data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to retrieve Technology." });
  }
};

export const updateTechnologyUsed = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to update Technology.",
      });

    const response = await updateTechnologyUsedService(data, id);

    if (response.success)
      return res
        .status(200)
        .json({ message: " Technology updated Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to update Technology." });
  }
};

export const deleteTechnologyUsed = async (req, res) => {
  try {
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to delete Technology.",
      });

    const response = await deleteTechnologyUsedService(id);
    if (response.success)
      return res
        .status(200)
        .json({ message: "Technology deleted Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete Technology." });
  }
};
