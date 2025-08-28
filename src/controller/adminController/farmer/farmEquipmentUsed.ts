import AdminFarmEquipmentUsed from "../../../database/models/adminModels/farmer/adminFarmEquipmentUsed";
import {
  createRecord,
  deleteRecord,
  getActiveRecords,
  getAllRecords,
  updateRecord,
} from "../../../services/adminServices/crudOperationService";

export const addFarmEquipment = async (req, res) => {
  try {
    const equipmentData = req.body;

    const response = await createRecord(AdminFarmEquipmentUsed, equipmentData);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Farm Equipment with this name already exists.",
      });
    }

    if (response?.success)
      return res.status(201).json({
        message: "New Farm Equipment added successfully.",
        data: response.data,
      });

    return res.status(400).json({ message: "Failed to add Farm Equipment." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Farm Equipment.",
    });
  }
};

export const getFarmEquipment = async (req, res) => {
  try {
    const response = await getAllRecords(AdminFarmEquipmentUsed);

    if (response?.success)
      return res.status(200).json({
        message: "Farm Equipments fetched successfully.",
        data: response.data,
      });

    return res.status(404).json({ message: "No Farm Equipment found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Farm Equipment.",
    });
  }
};

export const getActiveFarmEquipment = async (req, res) => {
  try {
    const response = await getActiveRecords(AdminFarmEquipmentUsed);

    if (response?.success)
      return res.status(200).json({
        message: "Farm Equipments fetched successfully.",
        data: response.data,
      });

    return res.status(404).json({ message: "No Farm Equipment found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Farm Equipment.",
    });
  }
};

export const updateFarmEquipment = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const response = await updateRecord(AdminFarmEquipmentUsed, id, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Farm Equipment with this name already exists.",
      });
    }

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Farm Equipment not found.",
      });
    }

    return res.status(200).json({
      message: "Farm Equipment updated successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Farm Equipment.",
    });
  }
};

export const deleteFarmEquipment = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(AdminFarmEquipmentUsed, id);

    if (!response || response.success === false)
      return res.status(404).json({
        message: response?.error || "Farm Equipment not found.",
      });

    return res.status(200).json({
      message: "Farm Equipment deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Farm Equipment.",
    });
  }
};
