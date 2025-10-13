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
import { getRegistrationTypes, getUserRole } from "./userServices";
import RealTimeAlertSystem from "../database/models/realTimeAlertSystem";
import MonitoringLogger from "../database/models/monitoringLogger";
import DryingMethod from "../database/models/dryingMethod";
import SubAdminPermission from "../database/models/subAdminPermission";
import { PERMISSIONS } from "../utils/constants/permissions";
import ColdStorageView from "../database/models/coldStorageView";

export async function onboardColdStorage(payload: any) {
  try {
    return await sequelize.transaction(async (t) => {
      const coldStorage = await ColdStorage.create(
        {
          name: payload.name,
          firstName: payload.firstName,
          lastName: payload.lastName,
          ownerName: payload.ownerName
            ? payload.ownerName
            : `${payload.firstName || ""} ${payload.lastName || ""}`.trim(),
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
          machineCapacityArray: payload.machineCapacityArray,
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
          gradingCharges: payload.gradingCharges,
          otherCharges: payload.otherCharges,
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
              capacityInBags: chamber.capacityInBags,
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

      if (Array.isArray(payload.dryingMethods)) {
        for (const dryingMethod of payload.dryingMethods) {
          await DryingMethod.create(
            {
              coldStorageId: coldStorage.id,
              method: dryingMethod.method,
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

      if (Array.isArray(payload.realTimeAlertSystemType)) {
        for (const alertSystem of payload.realTimeAlertSystemType) {
          await RealTimeAlertSystem.create(
            {
              coldStorageId: coldStorage.id,
              type: alertSystem.type,
            },
            { transaction: t }
          );
        }
      }

      if (Array.isArray(payload.monitoringLoggers)) {
        for (const loggertype of payload.monitoringLoggers) {
          await MonitoringLogger.create(
            {
              coldStorageId: coldStorage.id,
              type: loggertype.type,
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
            entityId: coldStorage.id,
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
      "firstName",
      "lastName",
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
      "machineCapacityArray",
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
      "gradingCharges",
      "otherCharges",
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
      dryingMethods: DryingMethod,
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
      realTimeAlertSystemType: RealTimeAlertSystem,
      monitoringLoggers: MonitoringLogger,
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
  isWithin24Hours,
  userId,
  role
) => {
  try {
    const coldStoragePersonalInfo = await ColdStorage.findOne({
      where: { id: coldStorageId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "role", "email", "mobile", "pbVerified"],
        },
        {
          model: User,
          as: "onBoardedByUser",
          attributes: ["id", "name", "role", "email", "mobile"],
        },
      ],
    });

    const [
      chamberCapacity,
      elevatorAndStuffing,
      operationalChallenge,
      shed,
      storageType,
      usageType,
      dryingFacilityDetail,
      dryingMethods,
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
      realTimeAlertSystem,
      monitoringLogger,
    ] = await Promise.all([
      ChamberCapacity.findAll({
        attributes: [
          "capacityMt",
          "noOfFloors",
          "capacityInBags",
          "description",
        ],
        where: { coldStorageId },
      }),
      ElevatorAndStuffing.findAll({
        attributes: ["name"],
        where: { coldStorageId },
      }),
      OperationalChallenge.findAll({
        attributes: ["challenge"],
        where: { coldStorageId },
      }),
      Shed.findAll({
        attributes: ["sizeSqMtr", "shedType"],
        where: { coldStorageId },
      }),
      StorageType.findAll({
        attributes: ["storageType"],
        where: { coldStorageId },
      }),
      UsageType.findAll({
        attributes: ["type", "capacity"],
        where: { coldStorageId },
      }),
      DryingFacilityDetail.findAll({
        attributes: ["facility"],
        where: { coldStorageId },
      }),
      DryingMethod.findAll({
        attributes: ["method"],
        where: { coldStorageId },
      }),
      FeatureOfStorage.findAll({
        attributes: ["feature"],
        where: { coldStorageId },
      }),
      MonitoringFacility.findAll({
        attributes: ["facility"],
        where: { coldStorageId },
      }),
      OtherFacility.findAll({
        attributes: ["facility"],
        where: { coldStorageId },
      }),
      PotatoDisposalSystem.findAll({
        attributes: ["disposalSystem"],
        where: { coldStorageId },
      }),
      PowerFacility.findAll({
        attributes: ["facility", "capacityInKw", "backupInHrs", "make"],
        where: { coldStorageId },
      }),
      ConstructionType.findAll({
        attributes: ["constructionType"],
        where: { coldStorageId },
      }),
      ColdStorageType.findAll({
        attributes: ["coldStorageType"],
        where: { coldStorageId },
      }),
      RoofType.findAll({ attributes: ["roofType"], where: { coldStorageId } }),
      StorageBookingSystem.findAll({
        attributes: ["bookingSystem"],
        where: { coldStorageId },
      }),
      SeasonWiseBookingSystem.findAll({
        attributes: ["season", "quantityInKg"],
        where: { coldStorageId },
      }),
      SlabWiseDiscount.findAll({
        attributes: ["quantityInMt", "discount"],
        where: { coldStorageId },
      }),
      RealTimeAlertSystem.findAll({
        attributes: ["type"],
        where: { coldStorageId },
      }),
      MonitoringLogger.findAll({
        attributes: ["type"],
        where: { coldStorageId },
      }),
    ]);

    if (role === USER_ROLES.USER) {
      await ColdStorageView.findOrCreate({
        where: { userId, coldStorageId },
        defaults: { userId, coldStorageId },
      });
    }

    const [viewCount, likeCount, likedRecord] = await Promise.all([
      ColdStorageView.count({
        where: { coldStorageId },
      }),
      LikeColdStorage.count({
        where: { coldStorageId },
      }),
      LikeColdStorage.findOne({
        where: { coldStorageId, userId },
      }),
    ]);

    return {
      coldStoragePersonalInfo,
      chamberCapacity,
      elevatorAndStuffing,
      operationalChallenge,
      shed,
      storageType,
      usageType,
      dryingFacilityDetail,
      dryingMethods,
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
      realTimeAlertSystem,
      monitoringLogger,
      canAgentEdit: isWithin24Hours,
      isLiked: !!likedRecord,
      likeCount,
      viewCount,
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
  sortBy?: string,
  listingType?: string
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
      capacityRange,
      registrationDate,
      onboardedByUser,
      status,
      pbVerified,
    } = filters;

    // if (userId) {
    //   whereCondition.onBoardedBy = {
    //     [Op.ne]: userId,
    //   };
    // }

    // Self listing
    if (listingType === "self") {
      whereCondition.userId = userId;
    }

    const userInclude: any = {
      model: User,
      as: "user",
      attributes: ["id", "name", "hasStartedUsingMobile", "pbVerified"],
    };

    // Other user's available cold storages
    if (listingType === "others") {
      whereCondition.userId = { [Op.ne]: userId };
      whereCondition.isAvailable = true;
      userInclude.where = { hasStartedUsingMobile: true };
      userInclude.required = true;
    }

    // Mobile admin listing
    if (listingType === "mobileAdmin") {
      userInclude.where = { hasStartedUsingMobile: true };
      userInclude.required = true; // ensures inner join
    }

    if (pbVerified && pbVerified.toLowerCase() !== "all") {
      const pbVerifiedBool = pbVerified === "true";
      userInclude.where = {
        ...userInclude.where,
        pbVerified: pbVerifiedBool,
      };
      userInclude.required = true;
    }

    if (status) {
      whereCondition.status = status;
    }

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
        "firstName",
        "lastName",
        "ownerName",
        "mobileNumber",
        "state",
        "district",
        "totalCapacityMt",
        "createdAt",
        "updatedAt",
        "onBoardedBy",
        "status",
        "isAvailable",
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
        userInclude,
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

    const data = await Promise.all(
      rows.map(async (item) => {
        const [viewCount, likeCount, likedRecord] = await Promise.all([
          ColdStorageView.count({
            where: { coldStorageId: item.id },
          }),
          LikeColdStorage.count({
            where: { coldStorageId: item.id },
          }),
          LikeColdStorage.findOne({
            where: { coldStorageId: item.id, userId },
          }),
        ]);

        return {
          id: item.id,
          coldStorageName: item.name,
          firstName: item.firstName,
          lastName: item.lastName,
          ownerName: item.ownerName,
          mobileNumber: item.mobileNumber,
          state: item.state,
          district: item.district,
          totalCapacityMt: item.totalCapacityMt,
          registrationDate: formatDate(item.createdAt),
          user: item.user,
          onBoardedByUser: item.onBoardedByUser,
          storageTypes: item.storageTypes,
          onBoardedBy: item.onBoardedBy,
          status: item.status,
          isAvailable: item.isAvailable,
          isLiked: !!likedRecord,
          likeCount,
          viewCount,
        };
      })
    );

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

export const deleteColdStorageById = async (coldStorageId: number) => {
  const coldStorage = await ColdStorage.findByPk(coldStorageId);

  if (!coldStorage) {
    return { success: false, status: 404, message: "Cold Storage not found" };
  }

  const agentOnboardedCs = await AgentOnboardedUser.findOne({
    where: { userId: coldStorage.userId, userType: USER_TYPE.COLD_STORAGE },
  });

  await ColdStorage.destroy({ where: { id: coldStorageId } });

  if (agentOnboardedCs) {
    await AgentOnboardedUser.destroy({ where: { id: agentOnboardedCs.id } });
  }

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
      capacityRange,
      registrationDate,
      onboardedByUser,
    } = filters;

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
    { header: "Owner's first Name", key: "firstName", width: 20 },
    { header: "Owner's last Name", key: "lastName", width: 20 },
    { header: "Owner's full Name", key: "ownerName", width: 25 },
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
    { header: "No. of Chambers", key: "numberOfChambers", width: 10 },
    { header: "Chamber Capacity", key: "chamberCapacities", width: 80 },
    { header: "No. of Sheds", key: "numberOfSheds", width: 10 },
    { header: "Shed Size", key: "sheds", width: 50 },
    { header: "Elevator and Stuffing", key: "elevatorAndStuffings", width: 40 },
    {
      header: "Operational Challenges",
      key: "operationalChallenges",
      width: 50,
    },
    { header: "Storage Types", key: "storageTypes", width: 30 },
    { header: "Has Air Cutter", key: "hasAirCutter", width: 30 },
    { header: "Has Insect Trap", key: "hasInsectTrap", width: 30 },
    {
      header: "Is Grading Area Available",
      key: "gradingAreaAvailable",
      width: 30,
    },
    {
      header: "Is Grading Machine Available",
      key: "gradingMachineAvailable",
      width: 30,
    },
    { header: "Grading Machine TPH", key: "gradingMachineTph", width: 30 },
    {
      header: "Is Manual Grading Area Available",
      key: "manualGradingAreaAvailable",
      width: 30,
    },
    { header: "Number of Kattas", key: "numberOfKattas", width: 20 },
    { header: "Grading Charges", key: "gradingCharges", width: 20 },
    { header: "Other Charges", key: "otherCharges", width: 20 },
    { header: "CO2 Controller", key: "co2Controller", width: 20 },
    { header: "Humidity Controller", key: "humidityController", width: 20 },
    {
      header: "Temperature Controller",
      key: "temperatureController",
      width: 20,
    },
    { header: "Has Weigh Bridge", key: "weighBridge", width: 20 },
    {
      header: "Weigh Bridge Capacity",
      key: "weighbridgeCapacityLength",
      width: 20,
    },
    { header: "Has Lorry Shades", key: "hasLorryShades", width: 20 },
    { header: "Lorry Shade Capacity", key: "lorryShadeCapacity", width: 20 },
    { header: "Has Labour for Grading", key: "hasLabourForGrading", width: 20 },
    {
      header: "No of Labour in Peak Season",
      key: "noOfLabourInPeakSeason",
      width: 20,
    },
    { header: "Usage Types", key: "usageTypes", width: 50 },
    { header: "Drying Facility", key: "dryingFacilityDetails", width: 50 },
    { header: "Drying Methods", key: "dryingMethods", width: 50 },
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
    {
      header: "Real Time Alert Systems",
      key: "realTimeAlertSystems",
      width: 30,
    },
    { header: "Referigeration Type", key: "refrigerationType", width: 30 },
    { header: "Referigeration Make", key: "referigerationMake", width: 30 },
    {
      header: "No. of Unit in Referigeration System",
      key: "machineCount",
      width: 30,
    },
    { header: "Machine Capacities", key: "machineCapacityArray", width: 40 },
    { header: "Monitoring Loggers", key: "monitoringLoggers", width: 30 },
  ];

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
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
      dryingMethods,
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
      realTimeAlertSystems,
      monitoringLoggers,
    ] = await Promise.all([
      ChamberCapacity.findAll({ where: { coldStorageId } }),
      ElevatorAndStuffing.findAll({ where: { coldStorageId } }),
      OperationalChallenge.findAll({ where: { coldStorageId } }),
      Shed.findAll({ where: { coldStorageId } }),
      StorageType.findAll({ where: { coldStorageId } }),
      UsageType.findAll({ where: { coldStorageId } }),
      DryingFacilityDetail.findAll({ where: { coldStorageId } }),
      DryingMethod.findAll({ where: { coldStorageId } }),
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
      RealTimeAlertSystem.findAll({ where: { coldStorageId } }),
      MonitoringLogger.findAll({ where: { coldStorageId } }),
    ]);

    worksheet.addRow({
      id: storage.id,
      name: storage.name || "",
      firstName: storage.firstName || "",
      lastName: storage.lastName || "",
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
      numberOfChambers: storage.numberOfChambers || "",
      chamberCapacities:
        chamberCapacities
          .map(
            (c) =>
              `Capacity: ${c.capacityMt}MT, Floors: ${c.noOfFloors}, Size: ${c.capacityInBags}sqft, Desc: ${c.description}`
          )
          .join(" | ") || "",
      numberOfSheds: storage.numberOfSheds || "",
      sheds:
        sheds
          .map((s) => `Size: ${s.sizeSqMtr}, Type: ${s.shedType || "N/A"}`)
          .join(" | ") || "",
      elevatorAndStuffings:
        elevatorAndStuffings.map((e) => e.name).join(", ") || "",
      operationalChallenges:
        operationalChallenges.map((c) => c.challenge).join(", ") || "",
      storageTypes: storageTypes.map((s) => s.storageType).join(", ") || "",
      hasAirCutter: storage.hasAirCutter ? "Yes" : "No",
      hasInsectTrap: storage.hasInsectTrap ? "Yes" : "No",
      gradingAreaAvailable: storage.gradingAreaAvailable ? "Yes" : "No",
      gradingMachineAvailable: storage.gradingMachineAvailable ? "Yes" : "No",
      gradingMachineTph: storage.gradingMachineTph || "",
      manualGradingAreaAvailable: storage.manualGradingAreaAvailable
        ? "Yes"
        : "No",
      numberOfKattas: storage.numberOfKattas || "",
      co2Controller: storage.co2Controller || "",
      humidityController: storage.humidityController || "",
      temperatureController: storage.temperatureController || "",
      weighBridge: storage.weighBridge ? "Yes" : "No",
      weighbridgeCapacityLength: storage.weighbridgeCapacityLength || "",
      hasLorryShades: storage.hasLorryShades ? "Yes" : "No",
      lorryShadeCapacity: storage.lorryShadeCapacity || "",
      hasLabourForGrading: storage.hasLabourForGrading ? "Yes" : "No",
      noOfLabourInPeakSeason: storage.noOfLabourInPeakSeason || "",
      usageTypes:
        usageTypes.map((u) => `${u.type}: ${u.capacity}MT`).join(" | ") || "",
      dryingFacilityDetails:
        dryingFacilityDetails.map((d) => d.facility).join(", ") || "",
      dryingMethods: dryingMethods.map((d) => d.method).join(", ") || "",
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
      realTimeAlertSystems:
        realTimeAlertSystems.map((r) => r.type).join(", ") || "",
      monitoringLoggers: monitoringLoggers.map((m) => m.type).join(", ") || "",
      uniqueFeatures: storage.uniqueFeatures || "",
      gradingCharges: storage.gradingCharges || "",
      otherCharges: storage.otherCharges || "",
      refrigerationType: storage.refrigerationType || "",
      refrigerationMake: storage.refrigerationMake || "",
      machineCount: storage.machineCount || "",
      machineCapacityArray: storage.machineCapacityArray || "",
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

export const canUpdateColdStorage = async (user, coldStorage: ColdStorage) => {
  // Owner
  if (coldStorage.userId === user.id) return true;

  // Super Admin
  if (user.role === USER_ROLES.SUPER_ADMIN) return true;

  // Sub Admin with permission
  if (user.role === USER_ROLES.SUB_ADMIN) {
    const exists = await SubAdminPermission.findOne({
      where: { userId: user.id, permission: PERMISSIONS.COLD_STORAGE },
    });
    return !!exists;
  }

  return false;
};

export const getColdStorageProfileCompletion = async (userId: number) => {
  const coldStorages = await ColdStorage.findAll({ where: { userId } });

  if (!coldStorages || coldStorages.length === 0) {
    return {
      hasColdStorageProfile: false,
      completion: 0,
      message: "User has no Cold Storage profile",
      details: [],
    };
  }

  // Required fields in ColdStorage table
  const requiredColdStorageFields = [
    "name",
    "firstName",
    "lastName",
    "mobileNumber",
    "whatsappNumber",
    "village",
    "district",
    "state",
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
    "machineCapacityArray",
    "weighBridge",
    "weighbridgeCapacityLength",
    "hasLorryShades",
    "lorryShadeCapacity",
    "hasLabourForGrading",
    "noOfLabourInPeakSeason",
    "uniqueFeatures",
    "isSlabWiseDiscount",
    "gradingCharges",
    "otherCharges",
    "coldStorageType",
    "dryingFloorCapacityKatta",
    "awardOrCertificate",
    "photos",
  ];

  // Associated required models
  const associatedModels: {
    key: string;
    model: ModelStatic<Model<any, any>>;
  }[] = [
    { key: "storageTypes", model: StorageType },
    { key: "usageTypes", model: UsageType },
    { key: "operationalChallenges", model: OperationalChallenge },
    { key: "elevatorsAndStuffing", model: ElevatorAndStuffing },
    { key: "chamberCapacities", model: ChamberCapacity },
    { key: "sheds", model: Shed },
    { key: "coldStorageTypes", model: ColdStorageType },
    { key: "dryingFacilityDetails", model: DryingFacilityDetail },
    { key: "dryingMethods", model: DryingMethod },
    { key: "constructionTypes", model: ConstructionType },
    { key: "featureOfStorage", model: FeatureOfStorage },
    { key: "monitoringFacilities", model: MonitoringFacility },
    { key: "otherFacilities", model: OtherFacility },
    { key: "potatoDisposalSystems", model: PotatoDisposalSystem },
    { key: "powerFacilities", model: PowerFacility },
    { key: "roofTypes", model: RoofType },
    { key: "seasonWiseBookingSystems", model: SeasonWiseBookingSystem },
    { key: "slabWiseDiscount", model: SlabWiseDiscount },
    { key: "storageBookingSystems", model: StorageBookingSystem },
    { key: "realTimeAlertSystemType", model: RealTimeAlertSystem },
    { key: "monitoringLoggers", model: MonitoringLogger },
  ];

  const completionResults = [];

  for (const coldStorage of coldStorages) {
    let totalRequiredFields =
      requiredColdStorageFields.length + associatedModels.length;
    let filledFields = 0;

    // Cold Storage table fields
    for (const field of requiredColdStorageFields) {
      const value = (coldStorage as any)[field];
      if (value !== undefined && value !== null && value !== "") {
        filledFields++;
      }
    }

    // Associated models
    for (const { model } of associatedModels) {
      const count = await model.count({
        where: { coldStorageId: coldStorage.id },
      });
      if (count > 0) filledFields++;
    }

    const completion = totalRequiredFields
      ? Math.round((filledFields / totalRequiredFields) * 100)
      : 0;

    completionResults.push({
      coldStorageId: coldStorage.id,
      name: coldStorage.name,
      completion,
      filledFields,
      totalRequiredFields,
    });
  }

  return {
    hasColdStorageProfile: true,
    message: "Cold Storage profile completion details",
    details: completionResults,
  };
};
