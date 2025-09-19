import MandiList from "../database/models/mandiList";

export const addMandi = async (req, res) => {
  try {
    const { cityId, mandiName } = req.body;

    await MandiList.create({
      cityId,
      mandiName,
    });

    return res
      .status(201)
      .json({ success: true, message: "Mandi added successfully." });
  } catch (error) {
    console.error("Failed to add mandi:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add mandi",
      error: error.message,
    });
  }
};

export const getAllMandiByCity = async (req, res) => {
  try {
    const { cityId } = req.params;

    const mandiList = await MandiList.findAll({ where: { cityId } });

    return res.status(200).json({
      success: true,
      message: "All Mandis retrieved by city successfully.",
      data: mandiList,
    });
  } catch (error) {
    console.error("Failed to retrieve all mandis by city:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve all mandis by city.",
      error: error.message,
    });
  }
};

export const updateMandi = async (req, res) => {
  try {
    const { id } = req.params;

    const { mandiName } = req.body;

    await MandiList.update({ mandiName }, { where: { id } });

    return res.status(200).json({
      success: true,
      message: "Mandi name updated successfully.",
    });
  } catch (error) {
    console.error("Failed to update mandi:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update mandi.",
      error: error.message,
    });
  }
};

export const deleteMandi = async (req, res) => {
  try {
    const { id } = req.params;

    await MandiList.destroy({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Mandi deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete mandi:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete mandi.",
      error: error.message,
    });
  }
};
