import ChamberCapacity from "../database/models/chamberCapacity";
import ColdStorage from "../database/models/coldStorage";
import sequelize from '../database/models/db';
import ElevatorAndStuffing from "../database/models/elevatorAndStuffing";
import OperationalChallenge from "../database/models/operationalChallenge";
import Shed from "../database/models/shed";
import StorageType from "../database/models/storageType";
import UsageType from "../database/models/usageType";

export async function onboardColdStorage(payload: any) {
  try {
    console.log("payload===>>", payload);

    return await sequelize.transaction(async (t) => {
      const coldStorage = await ColdStorage.create({
        name: payload.name,
        mobileNumber: payload.mobileNumber,
        optionalNumber: payload.optionalNumber,
        village: payload.village,
        district: payload.district,
        geoLocation: payload.geoLocation,
        hasGstCertificate: payload.hasGstCertificate,
        gstOrCertificateNumber: payload.gstOrCertificateNumber,
        totalCapacityMt: payload.totalCapacityMt,
        builtYear: payload.builtYear,
        constructionType: payload.constructionType,
        roofType: payload.roofType,
        numberOfChambers: payload.numberOfChambers,
        floorsPerChamber: payload.floorsPerChamber,
        chamberWiseCapacityMt: payload.chamberWiseCapacityMt,
        numberOfSheds: payload.numberOfSheds,
        shedSize: payload.shedSize,
        antiChamberSizeCapacity: payload.antiChamberSizeCapacity,
        totalArea: payload.totalArea,
        hasAirCutter: payload.hasAirCutter,
        hasInsectTrap: payload.hasInsectTrap,
        gradingBookingAvailable: payload.gradingBookingAvailable,
        gradingMachineMake: payload.gradingMachineMake,
        gradingMachineTph: payload.gradingMachineTph,
        dryingFloorCapacityKatta: payload.dryingFloorCapacityKatta,
        bookingMode: payload.bookingMode,
        coldStorageType: payload.coldStorageType,
        co2Controller: payload.co2Controller,
        humidityController: payload.humidityController,
        temperatureController: payload.temperatureController,
        refrigerationType: payload.refrigerationType,
        refrigerationMake: payload.refrigerationMake,
        machineCount: payload.machineCount,
        machineCapacity: payload.machineCapacity,
        machineMake: payload.machineMake,
        hasAmmoniaDetector: payload.hasAmmoniaDetector,
        hasRemoteMonitoring: payload.hasRemoteMonitoring,
        hasWebCamera: payload.hasWebCamera,
        hasGuestStay: payload.hasGuestStay,
        hasGuestMeals: payload.hasGuestMeals,
        weighbridgeCapacityLength: payload.weighbridgeCapacityLength,
        hasLorryShades: payload.hasLorryShades,
        lorryShadeCapacity: payload.lorryShadeCapacity,
        accessibility: payload.accessibility,
        hasLabourForGrading: payload.hasLabourForGrading,
        potatoDisposalMethod: payload.potatoDisposalMethod,
        solarPowerCapacityKw: payload.solarPowerCapacityKw,
        backupPowerCapacityKw: payload.backupPowerCapacityKw,
        uniqueFeatures: payload.uniqueFeatures,
        tradeMode: payload.tradeMode,
        isContractFarming: payload.isContractFarming,
        contractFarmingDetails: payload.contractFarmingDetails,
        transportProvided: payload.transportProvided,
        willingOnlineAuction: payload.willingOnlineAuction,
        additionalComments: payload.additionalComments,
        userId: payload.userId,
        onBoardedBy: payload.onBoardedBy,
        state: payload.state
      }, { transaction: t });

      if (Array.isArray(payload.storageTypes)) {
        for (const storageType of payload.storageTypes) {
          await StorageType.create({
            coldStorageId: coldStorage.id,
            //@ts-ignore
            storageType: storageType.storageType,
          }, { transaction: t });
        }
      }

      if (Array.isArray(payload.usageTypes)) {
        for (const usage of payload.usageTypes) {
          await UsageType.create({
            coldStorageId: coldStorage.id,
                        //@ts-ignore
                        type: usage.type,
          }, { transaction: t });
        }
      }

      if (Array.isArray(payload.operationalChallenges)) {
        for (const challenge of payload.operationalChallenges) {
          await OperationalChallenge.create({
            coldStorageId: coldStorage.id,
                        //@ts-ignore
                        challenge: challenge.challenge,
          }, { transaction: t });
        }
      }

      if (Array.isArray(payload.elevatorsAndStuffing)) {
        for (const elevator of payload.elevatorsAndStuffing) {
          await ElevatorAndStuffing.create({
            coldStorageId: coldStorage.id,
                        //@ts-ignore
                        name:elevator.name

          }, { transaction: t });
        }
      }

      if (Array.isArray(payload.chamberCapacities)) {
        for (const chamber of payload.chamberCapacities) {
          await ChamberCapacity.create({
            coldStorageId: coldStorage.id,
                        //@ts-ignore
                        chamberNumber: chamber.chamberNumber,
                        capacityMt: chamber.capacityMt,
          }, { transaction: t });
        }
      }

      if (Array.isArray(payload.sheds)) {
        for (const shed of payload.sheds) {
          await Shed.create({
            coldStorageId: coldStorage.id,
                        //@ts-ignore
                        sizeSqMtr: shed.sizeSqMtr,
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

export const retrieveColdStorageProfile = async (coldStorageId) => {
  try {
    const coldStoragePersonalInfo = await ColdStorage.findOne({
      where: { id: coldStorageId },
    });

    const chamberCapacity = await ChamberCapacity.findAll({
      attributes: ["chamberNumber", "capacityMt"],
      where: { coldStorageId },
    });

    const elevatorAndStuffing = await ElevatorAndStuffing.findAll({
      attributes: ["name"],
      where: { coldStorageId },
    });

    const operationalChallenge = await OperationalChallenge.findAll({
      attributes: ["challenge"],
      where: { coldStorageId },
    });

    const shed = await Shed.findAll({
      attributes: ["sizeSqMtr"],
      where: { coldStorageId },
    });

    const storageType = await StorageType.findAll({
      attributes: ["storageType"],
      where: { coldStorageId },
    });

    const usageType = await UsageType.findAll({
      attributes: ["type"],
      where: { coldStorageId },
    });

    return {
      coldStoragePersonalInfo,
      chamberCapacity,
      elevatorAndStuffing,
      operationalChallenge,
      shed,
      storageType,
      usageType,
    };
  } catch (err) {
    console.error("Error in retrieving cold storage profile", err);
    throw err;
  }
};