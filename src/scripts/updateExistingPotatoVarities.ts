import sequelize from "../database/models/db";
import PotatoVarietyGrown from "../database/models/potatoVarietyGrown";

import {
  potatoSubVarietyList,
  potatoSubVarietyListOld,
  potatoVarietyList,
  potatoVarietyListOld,
} from "../utils/constants/farmerSeedList";

// Map variety oldName -> newName
const varietyMap: Record<string, string> = {};
potatoVarietyListOld.forEach((oldVariety, i) => {
  const newVariety = potatoVarietyList[i];
  if (newVariety) {
    varietyMap[oldVariety.name] = newVariety.name;
  }
});

// Map subVariety oldName -> newName (per variety)
const subVarietyMap: Record<string, { varietyName: string; name: string }> = {};
potatoSubVarietyListOld.forEach((oldSub, i) => {
  const newSub = potatoSubVarietyList[i];
  if (newSub) {
    const key = `${oldSub.varietyName}:${oldSub.name}`;
    subVarietyMap[key] = {
      varietyName: newSub.varietyName,
      name: newSub.name,
    };
  }
});

async function updateFarmerPotatoVarieties() {
  try {
    await sequelize.authenticate();
    console.log("DB connection established.");

    const allRecords = await PotatoVarietyGrown.findAll();

    for (const record of allRecords) {
      const updatedFields: any = {};

      // update variety if mapping exists
      if (record.variety && varietyMap[record.variety]) {
        updatedFields.variety = varietyMap[record.variety];
      }

      // update subVariety if mapping exists
      const key = `${record.variety}:${record.subVariety}`;
      if (record.subVariety && subVarietyMap[key]) {
        updatedFields.subVariety = subVarietyMap[key].name;
      }

      if (Object.keys(updatedFields).length > 0) {
        await record.update(updatedFields);
      }
    }

    console.log("Farmer PotatoVarietyGrown records updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating Farmer PotatoVarietyGrown records:", err);
    process.exit(1);
  }
}

updateFarmerPotatoVarieties();
