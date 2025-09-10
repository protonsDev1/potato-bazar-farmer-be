import State from "../database/models/state";
import City from "../database/models/city";
import District from "../database/models/district";

export const listStates = async (req, res) => {
  try {
    const states = await State.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    return res.json({
      success: true,
      message: "States fetched successfully",
      states,
    });
  } catch (error) {
    console.error("Error fetching states:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const listCities = async (req, res) => {
  try {
    const { stateId } = req.query;

    const whereClause: any = {};
    if (stateId) whereClause.stateId = stateId;

    const cities = await City.findAll({
      where: whereClause,
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    // Deduplicate by city name (case-insensitive)
    const uniqueMap = new Map();
    for (const city of cities) {
      const key = city.name.toLowerCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, city);
      }
    }

    const uniqueCities = Array.from(uniqueMap.values());

    return res.json({
      success: true,
      message: "Cities fetched successfully",
      cities: uniqueCities,
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const listDistricts = async (req, res) => {
  try {
    const { stateId } = req.query;

    const whereClause: any = {};
    if (stateId) whereClause.stateId = stateId;

    const districts = await District.findAll({
      where: whereClause,
      include: [
        {
          model: State,
          as: "state",
          attributes: ["id", "name"],
        },
      ],
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    return res.json({
      success: true,
      message: "Districts fetched successfully",
      districts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
