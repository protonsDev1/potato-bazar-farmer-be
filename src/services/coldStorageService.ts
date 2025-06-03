import ChamberCapacity from "../database/models/chamberCapacity";
import ColdStorage from "../database/models/coldStorage";
import sequelize from '../database/models/db'; // sequelize instance
import ElevatorAndStuffing from "../database/models/elevatorAndStuffing";
import OperationalChallenge from "../database/models/operationalChallenge";
import Shed from "../database/models/shed";
import StorageType from "../database/models/storageType";
import UsageType from "../database/models/usageType";

export async function onboardColdStorage(payload: any) {
  try {
    console.log("payload===>>",payload)
    return await sequelize.transaction(async (t) => {
      const coldStorage = await ColdStorage.create({
        name: payload.name,
        //@ts-ignore
        type: payload.type,
        capacity: payload.capacity,
        address: payload.address,
        city: payload.city,
        district: payload.district,
        state: payload.state,
        phone: payload.phone,
        email: payload.email,
        contactPerson: payload.contactPerson,
        licenseNumber: payload.licenseNumber,
        yearOfEstablishment: payload.yearOfEstablishment,
        refrigerationType: payload.refrigerationType,
        powerBackup: payload.powerBackup,
        shedType: payload.shedType,
        numberOfChambers: payload.numberOfChambers,
        computerized: payload.computerized,
        userId: payload.userId,
        onBoardedBy: payload.onBoardedBy
      }, { transaction: t });

      if (payload.storageTypes) {
        for (const storageType of payload.storageTypes) {
          await StorageType.create({
            coldStorageId: coldStorage.id,
            //@ts-ignore
            type: storageType.type,
          }, { transaction: t });
        }
      }

      if (payload.usageTypes) {
        for (const usage of payload.usageTypes) {
          await UsageType.create({
            coldStorageId: coldStorage.id,
            //@ts-ignore
            usage: usage.usage,
          }, { transaction: t });
        }
      }

      if (payload.operationalChallenges) {
        for (const challenge of payload.operationalChallenges) {
          await OperationalChallenge.create({
            coldStorageId: coldStorage.id,
            //@ts-ignore
            name: challenge.name,
          }, { transaction: t });
        }
      }

      if (payload.elevatorsAndStuffing) {
        for (const elevator of payload.elevatorsAndStuffing) {
          await ElevatorAndStuffing.create({
            coldStorageId: coldStorage.id,
                        //@ts-ignore
            elevatorCount: elevator.elevatorCount,
            stuffingType: elevator.stuffingType,
          }, { transaction: t });
        }
      }

      if (payload.chamberCapacities) {
        for (const chamber of payload.chamberCapacities) {
          await ChamberCapacity.create({
            coldStorageId: coldStorage.id,
                        //@ts-ignore
            chamberName: chamber.chamberName,
            capacity: chamber.capacity,
          }, { transaction: t });
        }
      }

      if (payload.sheds) {
        for (const shed of payload.sheds) {
          await Shed.create({
            coldStorageId: coldStorage.id,
                        //@ts-ignore
            type: shed.type,
            capacity: shed.capacity,
          }, { transaction: t });
        }
      }

      return coldStorage;
    });
  } catch (err) {
    console.error("Error in onboarding cold storage:", err);
    throw err;
  }
}

export async function getColdStorage(page, limit){
  try {
    const offset = (page - 1) * limit;
    const response = await ColdStorage.findAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]]});
    return response;
  }
  catch (err) {
    console.error("Error in get cold storage list:", err);
    throw err;
  }
}
