import fs from "fs";
import path from "path";
import csv from "csv-parser";
import sequelize from "../database/models/db";
import State from "../database/models/state";
import City from "../database/models/city";
import District from "../database/models/district";

const filePath = path.resolve(process.cwd(), "data/locations.csv");

const importLocations = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connection established");

    console.log("Clearing existing location data...");

    await District.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await City.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await State.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    console.log("Old location data cleared.");

    const rows: any[] = [];
    const stateSet = new Set<string>();
    const citySet = new Set<string>();
    const districtSet = new Set<string>();

    // Step 1: Read CSV
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          const stateName = row.State.trim();
          const cityName = row.City.trim();
          const districtName = row.District.trim();

          rows.push({ stateName, cityName, districtName });
          stateSet.add(stateName);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // Step 2: Insert unique States
    const statesToInsert = Array.from(stateSet).map((name) => ({ name }));
    const insertedStates = await State.bulkCreate(statesToInsert, {
      ignoreDuplicates: true,
    });

    const stateMap = new Map(
      (await State.findAll()).map((s) => [s.name, s.id])
    );

    // Step 3: Insert unique Cities
    for (const { stateName, cityName } of rows) {
      citySet.add(`${cityName}__${stateName}`);
    }

    const citiesToInsert = Array.from(citySet).map((key) => {
      const [cityName, stateName] = key.split("__");
      return {
        name: cityName,
        stateId: stateMap.get(stateName),
      };
    });
    const insertedCities = await City.bulkCreate(citiesToInsert, {
      ignoreDuplicates: true,
    });

    const cityMap = new Map();
    const citiesFromDb = await City.findAll();
    for (const city of citiesFromDb) {
      cityMap.set(`${city.name}__${city.stateId}`, city.id);
    }

    // Step 4: Insert unique Districts
    for (const { stateName, cityName, districtName } of rows) {
      const stateId = stateMap.get(stateName);
      const cityId = cityMap.get(`${cityName}__${stateId}`);
      if (cityId) {
        districtSet.add(`${districtName}__${cityId}__${stateId}`);
      }
    }

    const districtsToInsert = Array.from(districtSet).map((key) => {
      const [districtName, cityIdStr, stateIdStr] = key.split("__");
      return {
        name: districtName,
        cityId: Number(cityIdStr),
        stateId: Number(stateIdStr),
      };
    });

    const insertedDistricts = await District.bulkCreate(districtsToInsert, {
      ignoreDuplicates: true,
    });

    console.log(
      `States: Attempted = ${statesToInsert.length}, Inserted = ${
        insertedStates.length
      }, Skipped = ${statesToInsert.length - insertedStates.length}`
    );
    console.log(
      `Cities: Attempted = ${citiesToInsert.length}, Inserted = ${
        insertedCities.length
      }, Skipped = ${citiesToInsert.length - insertedCities.length}`
    );
    console.log(
      `Districts: Attempted = ${districtsToInsert.length}, Inserted = ${
        insertedDistricts.length
      }, Skipped = ${districtsToInsert.length - insertedDistricts.length}`
    );

    console.log("Location data imported successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error importing locations:", error);
    process.exit(1);
  }
};

importLocations();
