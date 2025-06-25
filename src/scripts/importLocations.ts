import fs from "fs";
import path from "path";
import csv from "csv-parser";
import sequelize from "../database/models/db";
import State from "../database/models/state";
import District from "../database/models/district";
import City from "../database/models/city";

const filePath = path.resolve(process.cwd(), "data/states_and_districts.csv");

const cleanStateName = (rawName: string) =>
  rawName
    .replace(/\(State\)/gi, "")
    .replace(/State/gi, "")
    .trim();

const importStatesAndDistricts = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connection established");

    console.log("Clearing existing state and district data...");

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

    console.log("Old state and district data cleared.");

    const rows: { stateName: string; districtName: string }[] = [];
    const stateSet = new Set<string>();
    const districtSet = new Set<string>();

    // Step 1: Read CSV
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          const rawState = row.StateName?.trim() || "";
          const stateName = cleanStateName(rawState);
          const districtName = row.DistrictName?.trim();

          if (stateName && districtName) {
            rows.push({ stateName, districtName });
            stateSet.add(stateName);
          }
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

    // Step 3: Insert unique Districts
    for (const { stateName, districtName } of rows) {
      const stateId = stateMap.get(stateName);
      if (stateId) {
        districtSet.add(`${districtName}__${stateId}`);
      }
    }

    const districtsToInsert = Array.from(districtSet).map((key) => {
      const [districtName, stateIdStr] = key.split("__");
      return {
        name: districtName,
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
      `Districts: Attempted = ${districtsToInsert.length}, Inserted = ${
        insertedDistricts.length
      }, Skipped = ${districtsToInsert.length - insertedDistricts.length}`
    );

    console.log("State & District data imported successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

importStatesAndDistricts();
