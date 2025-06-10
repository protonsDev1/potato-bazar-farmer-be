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
    // Authenticate DB connection
    await sequelize.authenticate();
    console.log("DB connection established");

    const stateMap = new Map();
    const cityMap = new Map();
    const districtMap = new Map();

    const rows: any[] = [];

    // Read CSV rows
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", resolve)
        .on("error", reject);
    });

    // start transaction
    const transaction = await sequelize.transaction();

    try {
      for (const row of rows) {
        const stateName = row.State.trim();
        const cityName = row.City.trim();
        const districtName = row.District.trim();

        // Insert State
        let stateId = stateMap.get(stateName);
        if (!stateId) {
          const [state] = await State.findOrCreate({
            where: { name: stateName },
            transaction,
          });
          stateMap.set(stateName, state.id);
          stateId = state.id;
        }

        // Insert City
        const cityKey = `${cityName}_${stateId}`;
        let cityId = cityMap.get(cityKey);
        if (!cityId) {
          const [city] = await City.findOrCreate({
            where: { name: cityName, stateId },
            transaction,
          });
          cityMap.set(cityKey, city.id);
          cityId = city.id;
        }

        // Insert District
        const districtKey = `${districtName}_${cityId}`;
        if (!districtMap.has(districtKey)) {
          const [district] = await District.findOrCreate({
            where: { name: districtName, cityId },
            transaction,
          });
          districtMap.set(districtKey, district.id);
        }
      }

      await transaction.commit();
      console.log("Location data imported successfully!");
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

    process.exit(0);
  } catch (error) {
    console.error("Error importing locations:", error);
    process.exit(1);
  }
};

importLocations();
