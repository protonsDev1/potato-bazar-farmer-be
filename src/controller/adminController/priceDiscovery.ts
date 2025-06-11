import {
  addPriceDiscoveryService,
  deletePriceDisoveryService,
  getPriceDiscoveryService,
  updatePriceDiscoveryService,
} from "../../services/adminService/priceDiscoveryService";

export const addPriceDiscovery = async (req, res) => {
  try {
    const { role } = req.user;

    const priceDiscovery = req.body;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to add Price Discovery.",
      });

    const response = await addPriceDiscoveryService(priceDiscovery);

    if (response.success)
      return res
        .status(200)
        .json({ message: "New Price Discovery added Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to add Price Discovery." });
  }
};

export const getPriceDiscovery = async (req, res) => {
  try {
    const response = await getPriceDiscoveryService();

    if (response.success)
      return res.status(200).json({ message: response.data });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Price Discovery.",
    });
  }
};

export const updatePriceDiscovery = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to update Price Discovery.",
      });

    const response = await updatePriceDiscoveryService(data, id);

    if (response.success)
      return res
        .status(200)
        .json({ message: "Price Discovery updated Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to update Price Discovery." });
  }
};

export const deletePriceDiscovery = async (req, res) => {
  try {
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to delete Price Discovery.",
      });

    const response = await deletePriceDisoveryService(id);
    if (response.success)
      return res
        .status(200)
        .json({ message: "Price Discovery deleted Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete Price Discovery." });
  }
};
