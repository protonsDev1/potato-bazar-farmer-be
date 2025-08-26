import { literal, Model, ModelStatic, Op } from "sequelize";
import ChamberCapacity from "../database/models/chamberCapacity";
import ColdStorage from "../database/models/coldStorage";
import sequelize from "../database/models/db";
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
import User, { REGISTRATION_STATUS, USER_ROLES } from "../database/models/user";
import AgentOnboardedUser, {
  USER_TYPE,
} from "../database/models/agentOnboardedUsers";
import LikeColdStorage from "../database/models/likeColdStorage";
import { getUserRole } from "./userServices";

const STORAGE_SIZE_RANGES = {
  small: { min: 0, max: 999 },
  medium: { min: 1000, max: 5000 },
  large: { min: 5001, max: Number.MAX_SAFE_INTEGER },
};

export async function onboardColdStorage(payload: any) {
  try {
    console.log("payload===>>", payload);

    return await sequelize.transaction(async (t) => {
      const coldStorage = await ColdStorage.create(
        {
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
          state: payload.state,
        },
        { transaction: t }
      );

      if (Array.isArray(payload.storageTypes)) {
        for (const storageType of payload.storageTypes) {
          await StorageType.create(
            {
              coldStorageId: coldStorage.id,
              //@ts-ignore
              storageType: storageType.storageType,
            },
            { transaction: t }
          );
        }
      }

      if (Array.isArray(payload.usageTypes)) {
        for (const usage of payload.usageTypes) {
          await UsageType.create(
            {
              coldStorageId: coldStorage.id,
              //@ts-ignore
              type: usage.type,
              capacity: usage.capacity,
            },
            { transaction: t }
          );
        }
      }

      if (Array.isArray(payload.operationalChallenges)) {
        for (const challenge of payload.operationalChallenges) {
          await OperationalChallenge.create(
            {
              coldStorageId: coldStorage.id,
              //@ts-ignore
              challenge: challenge.challenge,
            },
            { transaction: t }
          );
        }
      }

      if (Array.isArray(payload.elevatorsAndStuffing)) {
        for (const elevator of payload.elevatorsAndStuffing) {
          await ElevatorAndStuffing.create(
            {
              coldStorageId: coldStorage.id,
              //@ts-ignore
              name: elevator.name,
            },
            { transaction: t }
          );
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
            `Expected ${payload.numberOfSheds} sheds, but got ${payload.sheds.length}`
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

      if (Array.isArray(payload.featureOfStorage)) {
        for (const storage of payload.featureOfStorage) {
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
          await MonitoringFacility.create(
            {
              coldStorageId: coldStorage.id,
              facility: facility.facility,
            },
            { transaction: t }
          );
        }
      }

      if (Array.isArray(payload.otherFacilities)) {
        for (const facility of payload.otherFacilities) {
          await OtherFacility.create(
            {
              coldStorageId: coldStorage.id,
              facility: facility.facility,
            },
            { transaction: t }
          );
        }
      }

      if (Array.isArray(payload.potatoDisposalSystems)) {
        for (const system of payload.potatoDisposalSystems) {
          await PotatoDisposalSystem.create(
            {
              coldStorageId: coldStorage.id,
              disposalSystem: system.disposalSystem,
            },
            { transaction: t }
          );
        }
      }

      if (Array.isArray(payload.powerFacilities)) {
        for (const facility of payload.powerFacilities) {
          await PowerFacility.create(
            {
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
          await RoofType.create(
            {
              coldStorageId: coldStorage.id,
              roofType: type.roofType,
            },
            { transaction: t }
          );
        }
      }

      if (Array.isArray(payload.seasonWiseBookingSystems)) {
        for (const system of payload.seasonWiseBookingSystems) {
          await SeasonWiseBookingSystem.create(
            {
              coldStorageId: coldStorage.id,
              season: system.season,
              quantityInKg: system.quantityInKg,
            },
            { transaction: t }
          );
        }
      }

      if (Array.isArray(payload.slabWiseDiscount)) {
        for (const discount of payload.slabWiseDiscount) {
          await SlabWiseDiscount.create(
            {
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
          await StorageBookingSystem.create(
            {
              coldStorageId: coldStorage.id,
              bookingSystem: system.bookingSystem,
            },
            { transaction: t }
          );
        }
      }

      const user = await getUserRole(payload.onBoardedBy);

      if (user.role === USER_ROLES.AGENT)
        await AgentOnboardedUser.create(
          {
            userId: payload.userId,
            agentId: payload.onBoardedBy,
            userType: USER_TYPE.COLD_STORAGE,
            userName: payload.ownerName,
            village: payload.village,
            district: payload.district,
            state: payload.state,
            statusOfRegistration: REGISTRATION_STATUS.PENDING,
          },
          { transaction: t }
        );

      return coldStorage;
    });
  } catch (err) {
    console.error("Error in onboarding cold storage:", err);
    throw err;
  }
}

export const updateColdStorageService = async (coldStorageId, payload) => {
  return await sequelize.transaction(async (t) => {
    const coldStorage = await ColdStorage.findByPk(coldStorageId, {
      transaction: t,
    });

    if (!coldStorage) {
      throw new Error("Cold storage not found");
    }

    const updateData: Record<string, any> = {};
    const editableFields = [
      "name",
      "ownerName",
      "mobileNumber",
      "optionalNumber",
      "whatsappNumber",
      "village",
      "district",
      "state",
      "taluka",
      "pinCode",
      "digiPin",
      "geoLocation",
      "hasGstCertificate",
      "gstOrCertificateNumber",
      "totalCapacityMt",
      "builtYear",
      "numberOfChambers",
      "numberOfSheds",
      "hasAirCutter",
      "hasInsectTrap",
      "gradingAreaAvailable",
      "gradingMachineAvailable",
      "gradingMachineTph",
      "manualGradingAreaAvailable",
      "numberOfKattas",
      "co2Controller",
      "humidityController",
      "temperatureController",
      "monitoringLogAvailable",
      "realTimeAlertSystem",
      "refrigerationType",
      "refrigerationMake",
      "machineCount",
      "machineCapacity",
      "weighBridge",
      "weighbridgeCapacityLength",
      "hasLorryShades",
      "lorryShadeCapacity",
      "numberOfTrucks",
      "hasLabourForGrading",
      "noOfLabourInPeakSeason",
      "uniqueFeatures",
      "isSlabWiseDiscount",
      "awardOrCertificate",
      "photos",
    ];

    for (const field of editableFields) {
      if (field in payload) {
        updateData[field] = payload[field];
      }
    }

    if (coldStorage.status === REGISTRATION_STATUS.REJECTED) {
      updateData.status = REGISTRATION_STATUS.PENDING;
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
        const records = payload[key].map((item) => ({
          coldStorageId,
          ...item,
        }));
        await Model.bulkCreate(records, { transaction: t });
      }
    }

    const updatedColdStorage = await ColdStorage.findByPk(coldStorageId, {
      transaction: t,
    });

    await AgentOnboardedUser.update(
      {
        userName: updatedColdStorage.ownerName,
        village: updatedColdStorage.village,
        district: updatedColdStorage.district,
        state: updatedColdStorage.state,
        statusOfRegistration: updatedColdStorage.status,
      },
      {
        where: {
          userId: updatedColdStorage.userId,
          userType: USER_TYPE.COLD_STORAGE,
        },
        transaction: t,
      }
    );

    return updatedColdStorage;
  });
};

export const retrieveColdStorageProfile = async (
  coldStorageId,
  isWithin24Hours
) => {
  try {
    const coldStoragePersonalInfo = await ColdStorage.findOne({
      where: { id: coldStorageId, isDeleted: false },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "role", "email", "mobile"],
        },
        {
          model: User,
          as: "onBoardedByUser",
          attributes: ["id", "name", "role", "email", "mobile"],
        },
      ],
    });

    const chamberCapacity = await ChamberCapacity.findAll({
      attributes: [
        "capacityMt",
        "noOfFloors",
        "sizePerChamberSqft",
        "description",
      ],
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
      attributes: ["sizeSqMtr", "shedType"],
      where: { coldStorageId },
    });

    const storageType = await StorageType.findAll({
      attributes: ["storageType"],
      where: { coldStorageId },
    });

    const usageType = await UsageType.findAll({
      attributes: ["type", "capacity"],
      where: { coldStorageId },
    });

    const dryingFacilityDetail = await DryingFacilityDetail.findAll({
      attributes: ["facility"],
      where: { coldStorageId },
    });

    const featureOfStorage = await FeatureOfStorage.findAll({
      attributes: ["feature"],
      where: { coldStorageId },
    });

    const monitoringFacilities = await MonitoringFacility.findAll({
      attributes: ["facility"],
      where: { coldStorageId },
    });

    const otherFacilities = await OtherFacility.findAll({
      attributes: ["facility"],
      where: { coldStorageId },
    });

    const potatoDisposalSystems = await PotatoDisposalSystem.findAll({
      attributes: ["disposalSystem"],
      where: { coldStorageId },
    });

    const powerFacilities = await PowerFacility.findAll({
      attributes: ["facility", "capacityInKw", "backupInHrs", "make"],
      where: { coldStorageId },
    });

    const constructionTypes = await ConstructionType.findAll({
      attributes: ["constructionType"],
      where: { coldStorageId },
    });

    const coldStorageTypes = await ColdStorageType.findAll({
      attributes: ["coldStorageType"],
      where: { coldStorageId },
    });

    const roofTypes = await RoofType.findAll({
      attributes: ["roofType"],
      where: { coldStorageId },
    });

    const storageBookingSystems = await StorageBookingSystem.findAll({
      attributes: ["bookingSystem"],
      where: { coldStorageId },
    });

    const seasonWiseBookingSystems = await SeasonWiseBookingSystem.findAll({
      attributes: ["season", "quantityInKg"],
      where: { coldStorageId },
    });

    const slabWiseDiscount = await SlabWiseDiscount.findAll({
      attributes: ["quantityInMt", "discount"],
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
      dryingFacilityDetail,
      featureOfStorage,
      monitoringFacilities,
      otherFacilities,
      potatoDisposalSystems,
      powerFacilities,
      constructionTypes,
      coldStorageTypes,
      roofTypes,
      storageBookingSystems,
      seasonWiseBookingSystems,
      slabWiseDiscount,
      canAgentEdit: isWithin24Hours,
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
  search,
  userId,
  sortBy?: string
) {
  try {
    const offset = (page - 1) * limit;
    const whereCondition: any = {};

    const {
      state,
      district,
      verified,
      agentId,
      storageType,
      storageSize,
      capacityRange,
      registrationDate,
      onboardedByUser,
    } = filters;

    whereCondition.isDeleted = false;

    // if (userId) {
    //   whereCondition.onBoardedBy = {
    //     [Op.ne]: userId,
    //   };
    // }

    if (verified && verified.toString() === "true") {
      whereCondition.status = REGISTRATION_STATUS.APPROVED;
    }

    if (agentId && agentId.toLowerCase() !== "all") {
      whereCondition.onBoardedBy = agentId;
    }

    if (state && state.toLowerCase() !== "all") {
      whereCondition.state = { [Op.iLike]: state };
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

    let onBoardedByUserWhere: any = {};

    if (onboardedByUser && onboardedByUser.toLowerCase() !== "all") {
      if (onboardedByUser === "self") {
        onBoardedByUserWhere.role = "user";
      } else if (onboardedByUser === "agent") {
        onBoardedByUserWhere.role = "agent";
      } else if (onboardedByUser === "admin") {
        onBoardedByUserWhere.role = "admin";
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

    let order: any[] = [["updatedAt", "DESC"]];

    if (sortBy) {
      switch (sortBy) {
        case "verified":
          order = [
            [
              literal(
                `CASE WHEN status = '${REGISTRATION_STATUS.APPROVED}' THEN 0 ELSE 1 END`
              ),
              "ASC",
            ],
            ["updatedAt", "DESC"],
          ];
          break;
        case "name_asc":
          order = [["name", "ASC"]];
          break;
        case "name_desc":
          order = [["name", "DESC"]];
          break;
        case "capacity_high":
          order = [["totalCapacityMt", "DESC"]];
          break;
        case "capacity_low":
          order = [["totalCapacityMt", "ASC"]];
          break;
        case "created_asc":
          order = [["createdAt", "ASC"]];
          break;
        case "created_desc":
          order = [["createdAt", "DESC"]];
          break;
        default:
          order = [["updatedAt", "DESC"]];
          break;
      }
    }

    const { count, rows }: any = await ColdStorage.findAndCountAll({
      attributes: [
        "id",
        "name",
        "ownerName",
        "mobileNumber",
        "state",
        "district",
        "totalCapacityMt",
        "createdAt",
        "updatedAt",
        "onBoardedBy",
        "status",
      ],
      where: whereCondition,
      include: [
        {
          model: User,
          as: "onBoardedByUser",
          attributes: ["id", "name", "role", "email", "mobile"],
          where: Object.keys(onBoardedByUserWhere).length
            ? onBoardedByUserWhere
            : undefined,
          required: Object.keys(onBoardedByUserWhere).length > 0,
        },
        {
          model: StorageType,
          as: "storageTypes",
          attributes: ["id", "storageType"],
        },
      ],
      distinct: true,
      limit,
      offset,
      order,
    });

    const likedColdStorageRecords = await LikeColdStorage.findAll({
      where: {
        userId,
        coldStorageId: { [Op.in]: rows.map((item) => item.id) },
      },
      attributes: ["coldStorageId"],
    });

    const likedIds = new Set(
      likedColdStorageRecords.map((r) => r.coldStorageId)
    );

    const data = rows.map((item) => ({
      id: item.id,
      coldStorageName: item.name,
      ownerName: item.ownerName,
      mobileNumber: item.mobileNumber,
      state: item.state,
      district: item.district,
      totalCapacityMt: item.totalCapacityMt,
      registrationDate: formatDate(item.createdAt),
      onBoardedByUser: item.onBoardedByUser,
      storageTypes: item.storageTypes,
      onBoardedBy: item.onBoardedBy,
      status: item.status,
      isLiked: likedIds.has(item.id),
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
}

export const softDeleteColdStorageById = async (coldStorageId: number) => {
  const coldStorage = await ColdStorage.findByPk(coldStorageId);

  if (!coldStorage || coldStorage.isDeleted) {
    return { success: false, status: 404, message: "Cold Storage not found" };
  }

  const agentOnboardedCs = await AgentOnboardedUser.findOne({
    where: { userId: coldStorage.userId, userType: USER_TYPE.COLD_STORAGE },
  });

  coldStorage.isDeleted = true;
  agentOnboardedCs.isDeleted = true;

  await coldStorage.save();
  await agentOnboardedCs.save();

  return { success: true, data: coldStorage };
};

export async function getAllColdStorages(filters: any, search: string) {
  try {
    const whereCondition: any = {};

    const {
      state,
      district,
      agentId,
      storageType,
      storageSize,
      capacityRange,
      registrationDate,
      onboardedByUser,
    } = filters;

    whereCondition.isDeleted = false;

    if (agentId && agentId.toLowerCase() !== "all") {
      whereCondition.onBoardedBy = agentId;
    }

    if (state && state.toLowerCase() !== "all") {
      whereCondition.state = { [Op.iLike]: state };
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

    let onBoardedByUserWhere: any = {};

    if (onboardedByUser && onboardedByUser.toLowerCase() !== "all") {
      if (onboardedByUser === "self") {
        onBoardedByUserWhere.role = "user";
      } else if (onboardedByUser === "agent") {
        onBoardedByUserWhere.role = "agent";
      } else if (onboardedByUser === "admin") {
        onBoardedByUserWhere.role = "admin";
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

    const coldStorages = await ColdStorage.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "onBoardedByUser",
          attributes: ["name"],
          where: Object.keys(onBoardedByUserWhere).length
            ? onBoardedByUserWhere
            : undefined,
          required: Object.keys(onBoardedByUserWhere).length > 0,
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    return coldStorages;
  } catch (err) {
    console.error("Error in retrieving cold storage:", err);
    throw err;
  }
}

export const createColdStorageWorksheetColumns = (worksheet) => {
  worksheet.columns = [
    { header: "Cold Storage ID", key: "id", width: 10 },
    { header: "Cold Storage Name", key: "name", width: 30 },
    { header: "Owner Name", key: "ownerName", width: 25 },
    { header: "Mobile Number", key: "mobileNumber", width: 20 },
    { header: "State", key: "state", width: 20 },
    { header: "District", key: "district", width: 20 },
    { header: "Taluka", key: "taluka", width: 15 },
    { header: "Village", key: "village", width: 20 },
    { header: "Pin Code", key: "pinCode", width: 20 },
    { header: "DIGI Pin", key: "digiPin", width: 20 },
    { header: "GST Number", key: "gstOrCertificateNumber", width: 20 },
    { header: "Registration Date", key: "registrationDate", width: 20 },
    { header: "Onboarded By", key: "onBoardedBy", width: 20 },
    { header: "Status", key: "status", width: 10 },
    { header: "Total Capacity (MT)", key: "totalCapacityMt", width: 20 },
    { header: "Built Year", key: "builtYear", width: 20 },
    { header: "Cold Storage Type", key: "coldStorageType", width: 20 },
    { header: "Construction Types", key: "constructionTypes", width: 30 },
    { header: "Roof Types", key: "roofTypes", width: 30 },
    { header: "Chamber Capacity", key: "chamberCapacities", width: 80 },
    { header: "Shed Size", key: "sheds", width: 50 },
    { header: "Elevator and Stuffing", key: "elevatorAndStuffings", width: 40 },
    {
      header: "Operational Challenges",
      key: "operationalChallenges",
      width: 50,
    },
    { header: "Storage Types", key: "storageTypes", width: 30 },
    { header: "Usage Types", key: "usageTypes", width: 50 },
    { header: "Drying Facility", key: "dryingFacilityDetails", width: 50 },
    { header: "Features", key: "featureOfStorages", width: 50 },
    { header: "Monitoring Facilities", key: "monitoringFacilities", width: 50 },
    { header: "Other Facilities", key: "otherFacilities", width: 50 },
    { header: "Potato Disposal", key: "potatoDisposalSystems", width: 50 },
    { header: "Power Facilities", key: "powerFacilities", width: 80 },
    { header: "Booking Systems", key: "storageBookingSystems", width: 30 },
    {
      header: "Season Wise Booking",
      key: "seasonWiseBookingSystems",
      width: 50,
    },
    { header: "Slab Wise Discount", key: "slabWiseDiscounts", width: 50 },
    { header: "Unique Features", key: "uniqueFeatures", width: 40 },
  ];
};

export const addColdStoragesToWorksheet = async (coldStorages, worksheet) => {
  for (const storage of coldStorages) {
    const coldStorageId = storage.id;

    const [
      chamberCapacities,
      elevatorAndStuffings,
      operationalChallenges,
      sheds,
      storageTypes,
      usageTypes,
      dryingFacilityDetails,
      featureOfStorages,
      monitoringFacilities,
      otherFacilities,
      potatoDisposalSystems,
      powerFacilities,
      constructionTypes,
      coldStorageTypes,
      roofTypes,
      storageBookingSystems,
      seasonWiseBookingSystems,
      slabWiseDiscounts,
    ] = await Promise.all([
      ChamberCapacity.findAll({ where: { coldStorageId } }),
      ElevatorAndStuffing.findAll({ where: { coldStorageId } }),
      OperationalChallenge.findAll({ where: { coldStorageId } }),
      Shed.findAll({ where: { coldStorageId } }),
      StorageType.findAll({ where: { coldStorageId } }),
      UsageType.findAll({ where: { coldStorageId } }),
      DryingFacilityDetail.findAll({ where: { coldStorageId } }),
      FeatureOfStorage.findAll({ where: { coldStorageId } }),
      MonitoringFacility.findAll({ where: { coldStorageId } }),
      OtherFacility.findAll({ where: { coldStorageId } }),
      PotatoDisposalSystem.findAll({ where: { coldStorageId } }),
      PowerFacility.findAll({ where: { coldStorageId } }),
      ConstructionType.findAll({ where: { coldStorageId } }),
      ColdStorageType.findAll({ where: { coldStorageId } }),
      RoofType.findAll({ where: { coldStorageId } }),
      StorageBookingSystem.findAll({ where: { coldStorageId } }),
      SeasonWiseBookingSystem.findAll({ where: { coldStorageId } }),
      SlabWiseDiscount.findAll({ where: { coldStorageId } }),
    ]);

    worksheet.addRow({
      id: storage.id,
      name: storage.name || "",
      ownerName: storage.ownerName || "",
      mobileNumber: storage.mobileNumber || "",
      state: storage.state || "",
      district: storage.district || "",
      taluka: storage.taluka || "",
      village: storage.village || "",
      pinCode: storage.pinCode || "",
      digiPin: storage.digiPin || "",
      gstOrCertificateNumber: storage.gstOrCertificateNumber || "",
      registrationDate: formatDate(storage.createdAt),
      onBoardedBy: storage.onBoardedByUser?.name || "",
      status: storage.status,
      totalCapacityMt: storage.totalCapacityMt || "",
      builtYear: storage.builtYear || "",
      coldStorageType:
        coldStorageTypes.map((c) => c.coldStorageType).join(", ") || "",
      constructionTypes:
        constructionTypes.map((c) => c.constructionType).join(", ") || "",
      roofTypes: roofTypes.map((r) => r.roofType).join(", ") || "",
      chamberCapacities:
        chamberCapacities
          .map(
            (c) =>
              `Capacity: ${c.capacityMt}MT, Floors: ${c.noOfFloors}, Size: ${c.sizePerChamberSqft}sqft, Desc: ${c.description}`
          )
          .join(" | ") || "",
      sheds:
        sheds
          .map((s) => `Size: ${s.sizeSqMtr}, Type: ${s.shedType || "N/A"}`)
          .join(" | ") || "",
      elevatorAndStuffings:
        elevatorAndStuffings.map((e) => e.name).join(", ") || "",
      operationalChallenges:
        operationalChallenges.map((c) => c.challenge).join(", ") || "",
      storageTypes: storageTypes.map((s) => s.storageType).join(", ") || "",
      usageTypes:
        usageTypes.map((u) => `${u.type}: ${u.capacity}MT`).join(" | ") || "",
      dryingFacilityDetails:
        dryingFacilityDetails.map((d) => d.facility).join(", ") || "",
      featureOfStorages:
        featureOfStorages.map((f) => f.feature).join(", ") || "",
      monitoringFacilities:
        monitoringFacilities.map((m) => m.facility).join(", ") || "",
      otherFacilities: otherFacilities.map((o) => o.facility).join(", ") || "",
      potatoDisposalSystems:
        potatoDisposalSystems.map((p) => p.disposalSystem).join(", ") || "",
      powerFacilities:
        powerFacilities
          .map(
            (p) =>
              `${p.facility} (Capacity: ${p.capacityInKw || "-"}kW, Backup: ${
                p.backupInHrs || "-"
              }hrs, Make: ${p.make || "-"})`
          )
          .join(" | ") || "",
      storageBookingSystems:
        storageBookingSystems.map((s) => s.bookingSystem).join(", ") || "",
      seasonWiseBookingSystems:
        seasonWiseBookingSystems
          .map((s) => `${s.season}: ${s.quantityInKg}kg`)
          .join(" | ") || "",
      slabWiseDiscounts:
        slabWiseDiscounts
          .map((s) => `${s.quantityInMt}MT = ${s.discount}%`)
          .join(" | ") || "",
      uniqueFeatures: storage.uniqueFeatures || "",
    });
  }
};

export const likeOrDislikeService = async (userId, coldStorageId) => {
  const isValidColdStorage = await ColdStorage.findByPk(coldStorageId);

  if (!isValidColdStorage)
    return {
      success: false,
      error: "Cold Storage not found!",
    };

  const isExistingColdStorageLiked = await LikeColdStorage.findOne({
    where: { userId, coldStorageId },
  });

  if (isExistingColdStorageLiked) {
    await LikeColdStorage.destroy({ where: { userId, coldStorageId } });
    return { success: true, data: "Cold Storage disliked successfully!" };
  } else {
    await LikeColdStorage.create({ userId, coldStorageId });
    return { success: true, data: "Cold Storage liked successfully!" };
  }
};
