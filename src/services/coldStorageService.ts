import { literal, Model, ModelStatic, Op } from "sequelize";
import ChamberCapacity from "../database/models/chamberCapacity";
import ColdStorage from "../database/models/coldStorage";
import sequelize from '../database/models/db';
import ElevatorAndStuffing from "../database/models/elevatorAndStuffing";
import OperationalChallenge from "../database/models/operationalChallenge";
import Shed from "../database/models/shed";
import StorageType from "../database/models/storageType";
import UsageType from "../database/models/usageType";
import { convertISTDateRangeToUTC, formatDate } from "../utils/dateFormat";
import DryingFacilityDetail from "../database/models/dryingFacilityDetail";
import FeatureOfStorage from "../database/models/featureOfStorage";
import MonitoringFacility from "../database/models/monitoringFacility";
import OtherFacility from "../database/models/otherFacility";
import PotatoDisposalSystem from "../database/models/potatoDisposalSystem";
import PowerFacility from "../database/models/powerFacility";
import ColdStorageType from "../database/models/coldStorageType";
import ConstructionType from "../database/models/constructionType";
import RoofType from "../database/models/roofType";
import SeasonWiseBookingSystem from "../database/models/seasonWiseStorageSystem";
import SlabWiseDiscount from "../database/models/slabWiseDiscount";
import StorageBookingSystem from "../database/models/storageBookingSystem";


const STORAGE_SIZE_RANGES = {
  small: { min: 0, max: 999 },
  medium: { min: 1000, max: 5000 },
  large: { min: 5001, max: Number.MAX_SAFE_INTEGER }, 
};

export async function onboardColdStorage(payload: any) {
  try {
    console.log("payload===>>", payload);

    return await sequelize.transaction(async (t) => {
      const coldStorage = await ColdStorage.create({
        name: payload.name,
        ownerName: payload.ownerName,
        mobileNumber: payload.mobileNumber,
        optionalNumber: payload.optionalNumber,
        whatsappNumber: payload.whatsappNumber,
        village: payload.village,
        district: payload.district,
        taluka: payload.taluka,
        pinCode: payload.pinCode,
        digiPin: payload.digiPin,
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
        gradingAreaAvailable: payload.gradingAreaAvailable,
        gradingAreaSqft: payload.gradingAreaSqft,
        gradingMachineMake: payload.gradingMachineMake,
        gradingMachineAvailable: payload.gradingMachineAvailable,
        gradingMachineTph: payload.gradingMachineTph,
        manualGradingAreaAvailable: payload.manualGradingAreaAvailable,
        numberOfKattas: payload.numberOfKattas,
        dryingFloorCapacityKatta: payload.dryingFloorCapacityKatta,
        bookingMode: payload.bookingMode,
        coldStorageType: payload.coldStorageType,
        co2Controller: payload.co2Controller,
        humidityController: payload.humidityController,
        temperatureController: payload.temperatureController,
        monitoringLogAvailable: payload.monitoringLogAvailable,
        realTimeAlertSystem: payload.realTimeAlertSystem,
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
        weighBridge: payload.weighBridge,
        weighbridgeCapacityLength: payload.weighbridgeCapacityLength,
        hasLorryShades: payload.hasLorryShades,
        lorryShadeCapacity: payload.lorryShadeCapacity,
        numberOfTrucks: payload.numberOfTrucks,
        accessibility: payload.accessibility,
        hasLabourForGrading: payload.hasLabourForGrading,
        noOfLabourInPeakSeason: payload.noOfLabourInPeakSeason,
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
        isSlabWiseDiscount: payload.isSlabWiseDiscount,
        awardOrCertificate: payload.awardOrCertificate,
        photos: payload.photos,
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
                        capacity: usage.capacity,
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
        if (payload.chamberCapacities.length !== payload.numberOfChambers) {
          throw new Error(
            `Expected ${payload.numberOfChambers} chambers, but got ${payload.chamberCapacities.length}`
          );
        }

        for (const chamber of payload.chamberCapacities) {
          await ChamberCapacity.create(
            {
              coldStorageId: coldStorage.id,
              //@ts-ignore
              capacityMt: chamber.capacityMt,
              noOfFloors: chamber?.noOfFloors,
              sizePerChamberSqft: chamber.sizePerChamberSqft,
              description: chamber?.description,
            },
            { transaction: t }
          );
        }
      }

      if (Array.isArray(payload.sheds)) {
        if (payload.sheds.length !== payload.numberOfSheds) {
          throw new Error(
            `Expected ${payload.numberOfSheds} chambers, but got ${payload.sheds.length}`
          );
        }

        for (const shed of payload.sheds) {
          await Shed.create(
            {
              coldStorageId: coldStorage.id,
              //@ts-ignore
              shedType: shed?.shedType,
              sizeSqMtr: shed.sizeSqMtr,
            },
            { transaction: t }
          );
        }
      }

      if (Array.isArray(payload.coldStorageTypes)) {
        for (const type of payload.coldStorageTypes) {
          await ColdStorageType.create(
            {
              coldStorageId: coldStorage.id,
              coldStorageType: type.coldStorageType,
            },
            { transaction: t }
          );
        }
      }

      if (Array.isArray(payload.dryingFacilityDetails)) {
        for (const dryingFacility of payload.dryingFacilityDetails) {
          await DryingFacilityDetail.create(
            {
              coldStorageId: coldStorage.id,
              facility: dryingFacility.facility,
            },
            { transaction: t }
          );
        }
      }

      if (Array.isArray(payload.constructionTypes)) {
        for (const type of payload.constructionTypes) {
          await ConstructionType.create(
            {
              coldStorageId: coldStorage.id,
              constructionType: type.constructionType,
            },
            { transaction: t }
          );
        }
      }

      if (Array.isArray(payload.featuresOfStorage)) {
        for (const storage of payload.featuresOfStorage) {
          await FeatureOfStorage.create(
            {
              coldStorageId: coldStorage.id,
              feature: storage.feature,
            },
            { transaction: t }
          );
        }
      }

      if (Array.isArray(payload.monitoringFacilities)) {
        for (const facility of payload.monitoringFacilities) {
          await MonitoringFacility.create({
            coldStorageId: coldStorage.id,
            facility: facility.facility,
          },
          { transaction: t }
        );
        }
      }

      if (Array.isArray(payload.otherFacilities)) {
        for (const facility of payload.otherFacilities) {
          await OtherFacility.create({
            coldStorageId: coldStorage.id,
            facility: facility.facility,
          },
          { transaction: t }
        );
        }
      }

      if (Array.isArray(payload.potatoDisposalSystems)) {
        for (const system of payload.potatoDisposalSystems) {
          await PotatoDisposalSystem.create({
            coldStorageId: coldStorage.id,
            disposalSystem: system.disposalSystem,
          },
          { transaction: t }
        );
        }
      }

      if (Array.isArray(payload.powerFacilities)) {
        for (const facility of payload.powerFacilities) {
          await PowerFacility.create({
            coldStorageId: coldStorage.id,
            facility: facility.facility,
            capacityInKw: facility?.capacityInKw,
            backupInHrs: facility?.backupInHrs,
            make: facility?.make,
          },
          { transaction: t }
        );
        }
      }

      if (Array.isArray(payload.roofTypes)) {
        for (const type of payload.roofTypes) {
          await RoofType.create({
            coldStorageId: coldStorage.id,
            roofType: type.roofType,
          },
          { transaction: t }
        );
        }
      }

      if (Array.isArray(payload.seasonWiseStorageSystems)) {
        for (const system of payload.seasonWiseStorageSystems) {
          await SeasonWiseBookingSystem.create({
            coldStorageId: coldStorage.id,
            season: system.season,
            quantityInKg: system.quantityInKg,
          },
          { transaction: t }
        );
        }
      }

      if (Array.isArray(payload.slabwiseDiscounts)) {
        for (const discount of payload.slabwiseDiscounts) {
          await SlabWiseDiscount.create({
            coldStorageId: coldStorage.id,
            quantityInMt: discount.quantityInMt,
            discount: discount.discount,
          },
          { transaction: t }
        );
        }
      }

      if (Array.isArray(payload.storageBookingSystems)) {
        for (const system of payload.storageBookingSystems) {
          await StorageBookingSystem.create({
            coldStorageId: coldStorage.id,
            bookingSystem: system.bookingSystem,
          },
          { transaction: t }
        );
        }
      }

      return coldStorage;
    });
  } catch (err) {
    console.error("Error in onboarding cold storage:", err);
    throw err;
  }
}

export const updateColdStorageService = async (coldStorageId, payload) => {
  return await sequelize.transaction(async (t) => {
    const updateData = {};
    const editableFields = [
      "name", "ownerName", "mobileNumber", "optionalNumber", "whatsappNumber", "village", "district", "state",
      "taluka", "pinCode", "digiPin", "geoLocation", "hasGstCertificate", "gstOrCertificateNumber", "totalCapacityMt",
      "builtYear", "numberOfChambers", "numberOfSheds", "hasAirCutter", "hasInsectTrap", "gradingAreaAvailable",
      "gradingMachineAvailable", "gradingMachineTph", "manualGradingAreaAvailable", "numberOfKattas", "co2Controller",
      "humidityController", "temperatureController", "monitoringLogAvailable", "realTimeAlertSystem",
      "refrigerationType", "refrigerationMake", "machineCount", "machineCapacity", "weighBridge",
      "weighbridgeCapacityLength", "hasLorryShades", "lorryShadeCapacity", "numberOfTrucks", "hasLabourForGrading",
      "noOfLabourInPeakSeason", "uniqueFeatures", "isSlabWiseDiscount", "awardOrCertificate", "photos"
    ];

    for (const field of editableFields) {
      if (field in payload) {
        updateData[field] = payload[field];
      }
    }

    await ColdStorage.update(updateData, {
      where: { id: coldStorageId },
      transaction: t,
    });

    const relationMap: Record<string, ModelStatic<Model>> = {
      storageTypes: StorageType,
      usageTypes: UsageType,
      operationalChallenges: OperationalChallenge,
      elevatorsAndStuffing: ElevatorAndStuffing,
      chamberCapacities: ChamberCapacity,
      sheds: Shed,
      coldStorageTypes: ColdStorageType,
      dryingFacilityDetails: DryingFacilityDetail,
      constructionTypes: ConstructionType,
      featuresOfStorage: FeatureOfStorage,
      monitoringFacilities: MonitoringFacility,
      otherFacilities: OtherFacility,
      potatoDisposalSystems: PotatoDisposalSystem,
      powerFacilities: PowerFacility,
      roofTypes: RoofType,
      storageBookingSystems: StorageBookingSystem,
      seasonWiseBookingSystems: SeasonWiseBookingSystem,
      slabWiseDiscount: SlabWiseDiscount,
    };

    for (const [key, Model] of Object.entries(relationMap)) {
      if (payload[key]) {
        await Model.destroy({ where: { coldStorageId }, transaction: t });
        const records = payload[key].map((item) => ({ coldStorageId, ...item }));
        await Model.bulkCreate(records, { transaction: t });
      }
    }

    return await ColdStorage.findByPk(coldStorageId, { transaction: t });
  });
};


export const retrieveColdStorageProfile = async (coldStorageId,isWithin24Hours) => {
  try {
    const coldStoragePersonalInfo = await ColdStorage.findOne({
      where: { id: coldStorageId },
    });

    const chamberCapacity = await ChamberCapacity.findAll({
      attributes: [ "capacityMt"],
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
      canAgentEdit: isWithin24Hours
    };
  } catch (err) {
    console.error("Error in retrieving cold storage profile", err);
    throw err;
  }
};

export async function getColdStorage(
  page: number = 1,
  limit: number = 10,
  filters,
  search
) {
  try {
    const offset = (page - 1) * limit;
    const whereCondition: any = {};

    const {
      district,
      agentId,
      storageType,
      storageSize,
      capacityRange,
      registrationDate,
    } = filters;

    if (agentId && agentId.toLowerCase() !== "all") {
      whereCondition.onBoardedBy = agentId;
    }

    if (district) {
      whereCondition.district = { [Op.iLike]: district };
    }

    const normalizedType = (storageType || "").toLowerCase();
    if (storageType && normalizedType !== "all") {
      whereCondition.id = {
        [Op.in]: literal(`(
      SELECT "coldStorageId"
      FROM "storageTypes"
       WHERE LOWER("storageType") = LOWER('${storageType}')
    )`),
      };
    }

    if (capacityRange && capacityRange.length === 2) {
      const [min, max] = capacityRange;
      if (min && max) {
        whereCondition.totalCapacityMt = {
          [Op.between]: [Number(min), Number(max)],
        };
      }
    }

    if (storageSize && storageSize !== "all") {
      const sizeRange = STORAGE_SIZE_RANGES[storageSize.toLowerCase()];
      if (sizeRange) {
        whereCondition[Op.and] = [
          literal(
            `CAST("shedSize" AS INTEGER) BETWEEN ${sizeRange.min} AND ${sizeRange.max}`
          ),
        ];
      }
    }

    if (registrationDate && registrationDate.length === 2) {
      const [startDate, endDate] = registrationDate;

      if (startDate && endDate) {
        const { startUTC, endUTC } = convertISTDateRangeToUTC(
          startDate,
          endDate
        );
        whereCondition.createdAt = {
          [Op.between]: [new Date(startUTC), new Date(endUTC)],
        };
      }
    }

     if (search?.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereCondition[Op.or] = [
        { id: isNaN(Number(search)) ? -1 : Number(search) },
        { name: { [Op.iLike]: searchTerm } },
        { mobileNumber: { [Op.iLike]: searchTerm } },
      ];
    }

    const { count, rows }: any = await ColdStorage.findAndCountAll({
      attributes: [
        "id",
        "name",
        "ownerName",
        "mobileNumber",
        "district",
        "totalCapacityMt",
        "createdAt",
        "onBoardedBy",
        "shedSize",
      ],
      where: whereCondition,
      include: [
        {
          model: StorageType,
          as: "storageTypes",
          attributes: ["id", "storageType"],
        },
      ],
      distinct: true,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const data = rows.map((item) => ({
      id: item.id,
      coldStorageName: item.name,
      ownerName: item.ownerName,
      mobileNumber: item.mobileNumber,
      district: item.district,
      totalCapacityMt: item.totalCapacityMt,
      registrationDate: formatDate(item.createdAt),
      storageTypes: item.storageTypes,
      storageSize: item.shedSize,
      onBoardedBy: item.onBoardedBy,
    }));

    return {
      data,
      currentPage: page,
      perPage: limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    };
  } catch (err) {
    console.error("Error in retrieving cold storage:", err);
    throw err;
  }
};
