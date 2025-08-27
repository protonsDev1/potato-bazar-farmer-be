import sequelize from "../database/models/db";
import State from "../database/models/state";
import City from "../database/models/city";

import { City as CityData, State as StateData } from "country-state-city";

async function populateCities() {
  try {
    await sequelize.authenticate();
    console.log("DB connection established.");

    const statesInDb = await State.findAll();
    const stateNameToId: Record<string, number> = {};
    statesInDb.forEach(state => {
      stateNameToId[state.name] = state.id; 
    });

    const indianCities = CityData.getCitiesOfCountry("IN");

    const citiesToInsert = indianCities
      .map(city => {
        const state = StateData.getStatesOfCountry("IN").find(
          s => s.isoCode === city.stateCode
        );
        if (!state) return null;

        const stateId = stateNameToId[state.name];
        if (!stateId) return null; 

        return {
          name: city.name,
          stateId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
      .filter(Boolean);

    
    await City.bulkCreate(citiesToInsert as any[]);
    console.log(`Inserted ${citiesToInsert.length} cities successfully!`);

    process.exit(0);
  } catch (err) {
    console.error("Error populating cities:", err);
    process.exit(1);
  }
}

populateCities();
