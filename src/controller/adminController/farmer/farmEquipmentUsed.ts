import {
  addFarmEquipmentService,
  deleteFarmEquipmentService,
  getFarmEquipmentService,
  updateFarmEquipmentService,
} from "../../../services/adminServices/farmer/farmEquipmentUsedService";

export const addFarmEquipment = async (req, res) => {
  try {
    const { role } = req.user;

    const sowingMethod = req.body;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to add Farm Equipments .",
      });

    const response = await addFarmEquipmentService(sowingMethod);

    if (response.success)
      return res
        .status(200)
        .json({ message: "New Farm Equipment added Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to add Farm Equipment." });
  }
};

export const getFarmEquipment = async (req, res) => {
  try {
    const response = await getFarmEquipmentService();

    if (response.success)
      return res.status(200).json({ message: response.data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to retrieve Farm Equipment." });
  }
};

export const UpdateFarmEquipment = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to update Farm Equipment.",
      });

    const response = await updateFarmEquipmentService(data, id);

    if (response.success)
      return res
        .status(200)
        .json({ message: "Farm Equipment updated Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to update Farm Equipment." });
  }
};

export const deleteFarmEquipment = async (req, res) => {
  try {
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to delete Farm Equipment.",
      });

    const response = await deleteFarmEquipmentService(id);
    if (response.success)
      return res
        .status(200)
        .json({ message: "Farm Equipment deleted Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete Farm Equipment." });
  }
};
