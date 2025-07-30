import AdminPotatoSubVarietyGrown from "../../database/models/adminModels/farmer/adminPotatoSubVariety";
import AdminPotatoVarietyGrown from "../../database/models/adminModels/farmer/adminPotatoVarietyGrown";
import { seedData } from "../../scripts/seedHelper";

export const seedPotatoSubVariety = async (potatoSubVarietyList) => {
  const keyMap = {};

  const potatoVarieties = await AdminPotatoVarietyGrown.findAll();

  potatoVarieties.map((variety) => {
    keyMap[variety.name] = variety.id;
    console.log(variety.id, "production -------->>>>>>> ///////////////***************************///////////////.......................................>>>>>>>>>>>>>>>...................>>>>>>>.....varietyId");
  });

  const data = potatoSubVarietyList.map((subVariety) => {
    return {
      varietyId: keyMap[subVariety.varietyName],
      name: subVariety.name,
    };
  });

  await seedData(AdminPotatoSubVarietyGrown, data, "Potato Sub Varieties");
};
