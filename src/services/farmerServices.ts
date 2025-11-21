import { Worksheet } from "exceljs";

import sequelize from "../database/models/db"; // sequelize instance
import Farmer from "../database/models/farmer";
import LandDetail from "../database/models/landDetails";
import IrrigationSource from "../database/models/irrigationSource";
import PotatoVarietyGrown from "../database/models/potatoVarietyGrown";
import FarmEquipment from "../database/models/farmEquipment";
import TechnologyUsed from "../database/models/technologyUsed";
import SellingChannel from "../database/models/sellingChannel";
import SellingChallenge from "../database/models/sellingChallenge";
import MajorSellingChallenge from "../database/models/majorSellingChallenge";
import PriceDiscoveryMethod from "../database/models/priceDiscoveryMethod";

import { literal, Model, ModelStatic, Op, Sequelize } from "sequelize";
import User, {
  REGISTRATION_STATUS,
  USER_REGISTRATION_TYPES,
  USER_ROLES,
} from "../database/models/user";
import { convertISTDateRangeToUTC, formatDate } from "../utils/dateFormat";
import BrandPreferenceReason from "../database/models/brandPreferenceReason";
import SellingPrice from "../database/models/sellingPrice";
import SellingPlace from "../database/models/sellingPlace";
import OtherCropGrown from "../database/models/otherCropGrown";
import IrrigationMethod from "../database/models/irrigationMethod";
import PotatoType from "../database/models/potatoType";
import AgentOnboardedUser, {
  USER_TYPE,
} from "../database/models/agentOnboardedUsers";
import SeedBrandName from "../database/models/seedBrandName";
import { getRegistrationTypes, getUserRole } from "./userServices";
import { onboardFarmerSchema } from "../validation/farmerValidation";

interface Payload {
  name: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  optionalNumber?: string;
  caste?: string;
  subCaste?: string;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  geoLocation?: string;
  pinCode?: string;
  digiPin?: string;
  whatsappNumber?: string;
  isAadhaarCard?: boolean;
  aadhaarNumber?: string;
  isBankAccount?: boolean;

  landDetails?: Array<Record<string, any>>;
  irrigationSources?: Array<{ method: string }>;
  irrigationMethods?: Array<{ method: string }>;
  potatoVarieties?: Array<{
    isCustom?: boolean;
    variety: string;
    subVariety?: string;
  }>;
  farmEquipment?: Array<{ machine: string; brand?: string; model?: string }>;
  technologyUsed?: Array<{ name: string }>;
  sellingChannels?: Array<{ name: string }>;
  sellingChallenges?: Array<{ name: string }>;
  majorSellingChallenges?: Array<{ name: string }>;
  priceDiscoveryMethods?: Array<{ method: string }>;
  brandPreferenceReasons?: Array<{ reason: string }>;
  sellingPrices?: Array<{ price: string }>;
  sellingPlaces?: Array<{ place: string }>;
  potatoTypes?: Array<{ type: string }>;
  otherCropsGrown?: Array<{
    cropName: string;
    sowingMonth: string;
    harvestingMonth: string;
  }>;
  seedBrandName?: Array<{ name: string; isCustom?: boolean }>;

  onBoardedBy?: number;
  userId?: number;
}

export async function onboardFarmer(payload: Payload) {
  try {
    return await sequelize.transaction(async (t) => {
      const existingFarmer = await Farmer.findOne({
        where: { userId: payload.userId },
        transaction: t,
      });

      if (existingFarmer) {
        throw new Error("Farmer already registered for this user.");
      }

      const farmer = await Farmer.create(
        {
          firstName: payload.firstName,
          lastName: payload.lastName,
          name: payload.name
            ? payload.name
            : `${payload.firstName || ""} ${payload.lastName || ""}`.trim(),
          age: payload.age,
          gender: payload.gender,
          optionalNumber: payload.optionalNumber,
          caste: payload.caste,
          subCaste: payload.subCaste,
          village: payload.village,
          taluka: payload.taluka,
          district: payload.district,
          state: payload.state,
          geoLocation: payload.geoLocation,
          pinCode: payload.pinCode,
          digiPin: payload.digiPin,
          whatsappNumber: payload.whatsappNumber,
          isAadhaarCard: payload.isAadhaarCard,
          aadhaarNumber: payload.aadhaarNumber,
          isBankAccount: payload.isBankAccount,
          onBoardedBy: payload.onBoardedBy,
          userId: payload.userId,
        },
        { transaction: t }
      );

      const userData = await User.findOne({
        where: { id: payload.userId },
        transaction: t,
      });

      let updatedTypes = userData.userType || [];

      if (!updatedTypes.includes(USER_REGISTRATION_TYPES.FARMER)) {
        updatedTypes.push(USER_REGISTRATION_TYPES.FARMER);
      }

      await User.update(
        {
          name: payload.name,
          firstName: payload.firstName,
          lastName: payload.lastName,
          state: payload.state,
          district: payload.district,
          pinCode: payload.pinCode,
          cityOrVillage: payload.village,
          isUserOnBoardedOnMobile: true,
          userType: updatedTypes,
        },
        { where: { id: payload.userId }, transaction: t }
      );

      if (payload.landDetails) {
        for (const landDetail of payload.landDetails) {
          await LandDetail.create(
            {
              farmerId: farmer.id,
              ...landDetail,
            },
            { transaction: t }
          );
        }
      }

      if (payload.irrigationSources) {
        for (const irrigation of payload.irrigationSources) {
          await IrrigationSource.create(
            { farmerId: farmer.id, method: irrigation.method },
            { transaction: t }
          );
        }
      }

      if (payload.irrigationMethods) {
        for (const irrigation of payload.irrigationMethods) {
          await IrrigationMethod.create(
            { farmerId: farmer.id, method: irrigation.method },
            { transaction: t }
          );
        }
      }

      if (payload.potatoVarieties) {
        for (const variety of payload.potatoVarieties) {
          await PotatoVarietyGrown.create(
            {
              farmerId: farmer.id,
              variety: variety.variety,
              subVariety: variety.subVariety,
              isCustom: variety?.isCustom,
            },
            { transaction: t }
          );
        }
      }

      if (payload.farmEquipment) {
        for (const equipment of payload.farmEquipment) {
          await FarmEquipment.create(
            {
              farmerId: farmer.id,
              machine: equipment.machine,
              brand: equipment.brand,
              model: equipment.model,
            },
            { transaction: t }
          );
        }
      }

      if (payload.technologyUsed) {
        for (const tech of payload.technologyUsed) {
          await TechnologyUsed.create(
            { farmerId: farmer.id, name: tech.name },
            { transaction: t }
          );
        }
      }

      if (payload.sellingChannels) {
        for (const channel of payload.sellingChannels) {
          await SellingChannel.create(
            { farmerId: farmer.id, name: channel.name },
            { transaction: t }
          );
        }
      }

      if (payload.sellingChallenges) {
        for (const challenge of payload.sellingChallenges) {
          await SellingChallenge.create(
            { farmerId: farmer.id, name: challenge.name },
            { transaction: t }
          );
        }
      }

      if (payload.majorSellingChallenges) {
        for (const majorChallenge of payload.majorSellingChallenges) {
          await MajorSellingChallenge.create(
            { farmerId: farmer.id, name: majorChallenge.name },
            { transaction: t }
          );
        }
      }

      if (payload.brandPreferenceReasons) {
        for (const brandPreference of payload.brandPreferenceReasons) {
          await BrandPreferenceReason.create(
            { farmerId: farmer.id, reason: brandPreference.reason },
            { transaction: t }
          );
        }
      }

      if (payload.sellingPrices) {
        for (const sellingPrice of payload.sellingPrices) {
          await SellingPrice.create(
            { farmerId: farmer.id, price: sellingPrice.price },
            { transaction: t }
          );
        }
      }

      if (payload.sellingPlaces) {
        for (const sellingPlace of payload.sellingPlaces) {
          await SellingPlace.create(
            { farmerId: farmer.id, place: sellingPlace.place },
            { transaction: t }
          );
        }
      }

      if (payload.potatoTypes) {
        for (const potatoType of payload.potatoTypes) {
          await PotatoType.create(
            { farmerId: farmer.id, type: potatoType.type },
            { transaction: t }
          );
        }
      }

      if (payload.otherCropsGrown) {
        for (const crop of payload.otherCropsGrown) {
          await OtherCropGrown.create(
            {
              farmerId: farmer.id,
              cropName: crop.cropName,
              sowingMonth: crop.sowingMonth,
              harvestingMonth: crop.harvestingMonth,
            },
            { transaction: t }
          );
        }
      }

      if (payload.priceDiscoveryMethods) {
        for (const method of payload.priceDiscoveryMethods) {
          await PriceDiscoveryMethod.create(
            { farmerId: farmer.id, method: method.method },
            { transaction: t }
          );
        }
      }

      if (payload.seedBrandName) {
        for (const seedBrand of payload.seedBrandName) {
          await SeedBrandName.create(
            {
              farmerId: farmer.id,
              name: seedBrand.name,
              isCustom: seedBrand?.isCustom,
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
            userType: USER_TYPE.FARMER,
            userName: payload.name,
            village: payload.village,
            district: payload.district,
            state: payload.state,
            statusOfRegistration: REGISTRATION_STATUS.PENDING,
            entityId: farmer.id,
          },
          { transaction: t }
        );

      return farmer;
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const updateFarmerDetails = async (
  farmerId: number,
  payload: Payload
) => {
  return await sequelize.transaction(async (t) => {
    const farmer = await Farmer.findByPk(farmerId, { transaction: t });
    if (!farmer) throw new Error("Farmer not found");

    const updatableFields = [
      "firstName",
      "lastName",
      "name",
      "age",
      "gender",
      "optionalNumber",
      "caste",
      "subCaste",
      "village",
      "taluka",
      "district",
      "state",
      "geoLocation",
      "pinCode",
      "digiPin",
      "whatsappNumber",
      "isAadhaarCard",
      "aadhaarNumber",
      "isBankAccount",
    ];

    const updateData: Record<string, any> = {};

    for (const key of updatableFields) {
      if (key in payload) updateData[key] = payload[key];
    }

    if (farmer.status === REGISTRATION_STATUS.REJECTED) {
      updateData.status = REGISTRATION_STATUS.PENDING;
    }

    await Farmer.update(updateData, {
      where: { id: farmerId },
      transaction: t,
    });

    const relationMap: Record<string, ModelStatic<Model>> = {
      landDetails: LandDetail,
      irrigationSources: IrrigationSource,
      irrigationMethods: IrrigationMethod,
      potatoVarieties: PotatoVarietyGrown,
      farmEquipment: FarmEquipment,
      technologyUsed: TechnologyUsed,
      sellingChannels: SellingChannel,
      sellingChallenges: SellingChallenge,
      majorSellingChallenges: MajorSellingChallenge,
      brandPreferenceReasons: BrandPreferenceReason,
      sellingPrices: SellingPrice,
      sellingPlaces: SellingPlace,
      potatoTypes: PotatoType,
      otherCropsGrown: OtherCropGrown,
      priceDiscoveryMethods: PriceDiscoveryMethod,
      seedBrandName: SeedBrandName,
    };

    for (const [key, Model] of Object.entries(relationMap)) {
      if (payload[key]) {
        // Delete existing only if new data is sent
        await Model.destroy({ where: { farmerId }, transaction: t });

        const newRecords = payload[key].map((item) => ({
          farmerId,
          ...item,
        }));

        if (newRecords.length) {
          await Model.bulkCreate(newRecords, { transaction: t });
        }
      }
    }

    const updatedFarmer = await Farmer.findByPk(farmerId, { transaction: t });

    await AgentOnboardedUser.update(
      {
        userName: updatedFarmer.name,
        village: updatedFarmer.village,
        district: updatedFarmer.district,
        state: updatedFarmer.state,
        statusOfRegistration: updatedFarmer.status,
      },
      {
        where: {
          userId: updatedFarmer.userId,
          userType: USER_TYPE.FARMER,
        },
        transaction: t,
      }
    );

    return updatedFarmer;
  });
};

export const retrieveFarmerProfile = async (
  farmerId: string,
  isWithin24Hours
) => {
  try {
    const farmerPersonalInfo = await Farmer.findOne({
      where: { id: farmerId },
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

    const landDetails = await LandDetail.findOne({
      where: { farmerId },
    });

    const irrigationSources = await IrrigationSource.findAll({
      attributes: ["method"],
      where: { farmerId },
    });

    const irrigationMethods = await IrrigationMethod.findAll({
      attributes: ["method"],
      where: { farmerId },
    });

    const farmEquipments = await FarmEquipment.findAll({
      attributes: ["machine", "brand", "model"],
      where: { farmerId },
    });

    const potatoVariety = await PotatoVarietyGrown.findAll({
      attributes: ["variety", "subVariety", "isCustom"],
      where: { farmerId },
    });

    const priceDiscoveryMethods = await PriceDiscoveryMethod.findAll({
      attributes: ["method"],
      where: { farmerId },
    });

    const majorSellingChallenge = await MajorSellingChallenge.findAll({
      attributes: ["name"],
      where: { farmerId },
    });

    const sellingChallenges = await SellingChallenge.findAll({
      attributes: ["name"],
      where: { farmerId },
    });

    const sellingChannels = await SellingChannel.findAll({
      attributes: ["name"],
      where: { farmerId },
    });

    const technologyUsed = await TechnologyUsed.findAll({
      attributes: ["name"],
      where: { farmerId },
    });

    const brandPreferenceReasons = await BrandPreferenceReason.findAll({
      attributes: ["reason"],
      where: { farmerId },
    });

    const sellingPrices = await SellingPrice.findAll({
      attributes: ["price"],
      where: { farmerId },
    });

    const sellingPlaces = await SellingPlace.findAll({
      attributes: ["place"],
      where: { farmerId },
    });

    const potatoTypes = await PotatoType.findAll({
      attributes: ["type"],
      where: { farmerId },
    });

    const otherCropsGrown = await OtherCropGrown.findAll({
      attributes: ["cropName", "sowingMonth", "harvestingMonth"],
      where: { farmerId },
    });

    const seedBrandName = await SeedBrandName.findAll({
      attributes: ["name"],
      where: { farmerId },
    });

    return {
      farmerPersonalInfo,
      landDetails,
      irrigationSources,
      irrigationMethods,
      farmEquipments,
      potatoVariety,
      priceDiscoveryMethods,
      majorSellingChallenge,
      sellingChallenges,
      sellingChannels,
      technologyUsed,
      brandPreferenceReasons,
      sellingPrices,
      sellingPlaces,
      potatoTypes,
      otherCropsGrown,
      seedBrandName,
      canAgentEdit: isWithin24Hours,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export async function getFarmerListByAdmin(
  page = 1,
  limit = 10,
  filters: any,
  search?: string,
  sortBy?: string
) {
  try {
    const offset = (page - 1) * limit;
    const whereCondition: any = {};

    const {
      agentId,
      state,
      district,
      potatoVariety,
      potatoSubVariety,
      taluka,
      ageRange,
      gender,
      landSizeRange,
      farmingType,
      soilType,
      sowingMonth,
      harvestMonth,
      irrigationSource,
      registrationDate,
      onboardedByUser,
      status,
    } = filters;

    if (status) {
      whereCondition.status = status;
    }

    if (agentId && agentId.toLowerCase() !== "all") {
      whereCondition.onBoardedBy = agentId;
    }

    if (state && state.toLowerCase() !== "all") {
      whereCondition.state = { [Op.iLike]: state };
    }

    if (district && district.toLowerCase() !== "all") {
      whereCondition.district = { [Op.iLike]: district };
    }

    if (taluka && taluka.toLowerCase() !== "all") {
      whereCondition.taluka = { [Op.iLike]: taluka };
    }

    if (gender && gender.toLowerCase() !== "all") {
      whereCondition.gender = { [Op.iLike]: gender };
    }

    if (potatoVariety && potatoVariety.toLowerCase() !== "all") {
      let condition = `LOWER("variety") = LOWER('${potatoVariety}')`;

      if (potatoSubVariety && potatoSubVariety.toLowerCase() !== "all") {
        condition += ` AND LOWER("subVariety") = LOWER('${potatoSubVariety}')`;
      }

      whereCondition.id = {
        [Op.in]: literal(`(
      SELECT "farmerId"
      FROM "PotatoVarietyGrown"
      WHERE ${condition}
    )`),
      };
    }

    if (ageRange && ageRange.length === 2) {
      const [min, max] = ageRange;
      if (min && max) {
        whereCondition.age = {
          [Op.between]: [Number(min), Number(max)],
        };
      }
    }

    const landDetailsWhere: any = {};

    if (soilType && soilType.toLowerCase() !== "all") {
      landDetailsWhere.soilType = { [Op.iLike]: soilType };
    }

    if (sowingMonth && sowingMonth.toLowerCase() !== "all") {
      landDetailsWhere.sowingMonth = { [Op.iLike]: sowingMonth };
    }
    if (harvestMonth && harvestMonth.toLowerCase() !== "all") {
      landDetailsWhere.harvestMonth = { [Op.iLike]: harvestMonth };
    }

    if (landSizeRange && landSizeRange.length === 2) {
      const [min, max] = landSizeRange;
      if (min && max) {
        landDetailsWhere.landOwnedAcres = {
          [Op.between]: [Number(min), Number(max)],
        };
      }
    }

    if (farmingType && farmingType.toLowerCase() !== "all") {
      const type = farmingType.toLowerCase();
      if (type === "own land") {
        landDetailsWhere.landOwnedAcres = {
          [Op.gt]: 0,
        };
      } else if (type === "lease") {
        landDetailsWhere.landLeasedAcres = {
          [Op.gt]: 0,
        };
      } else if (type === "both") {
        landDetailsWhere[Op.and] = [
          { landOwnedAcres: { [Op.gt]: 0 } },
          { landLeasedAcres: { [Op.gt]: 0 } },
        ];
      }
    }

    if (
      irrigationSource &&
      Array.isArray(irrigationSource) &&
      irrigationSource.length > 0
    ) {
      const validSources = irrigationSource
        .filter((s: string) => s && s.trim())
        .map((s: string) => s.toLowerCase());

      if (validSources.length > 0) {
        const formattedList = validSources.map((s) => `'${s}'`).join(",");

        whereCondition.id = {
          [Op.in]: Sequelize.literal(`(
        SELECT DISTINCT "farmerId"
        FROM "IrrigationSources"
        WHERE LOWER("method") IN (${formattedList})
      )`),
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
      const searchTerm = `%${search?.trim()}%`;

      const matchedUsers = await User.findAll({
        where: {
          mobile: { [Op.iLike]: searchTerm },
        },
        attributes: ["id"],
      });

      const matchedUserIds = matchedUsers.map((u) => u.id);

      whereCondition[Op.or] = [
        { id: isNaN(Number(search)) ? -1 : Number(search) },
        { name: { [Op.iLike]: searchTerm } },
        ...(matchedUserIds.length > 0
          ? [{ userId: { [Op.in]: matchedUserIds } }]
          : []),
      ];
    }

    let order: any = [["createdAt", "DESC"]];

    if (sortBy) {
      switch (sortBy.toLowerCase()) {
        case "name_asc":
          order = [["name", "ASC"]];
          break;
        case "name_desc":
          order = [["name", "DESC"]];
          break;
        case "created_asc":
          order = [["createdAt", "ASC"]];
          break;
        case "created_desc":
          order = [["createdAt", "DESC"]];
          break;
        case "land_owned_acres_asc":
          order = [
            [{ model: LandDetail, as: "LandDetail" }, "landOwnedAcres", "ASC"],
          ];
          break;
        case "land_owned_acres_desc":
          order = [
            [{ model: LandDetail, as: "LandDetail" }, "landOwnedAcres", "DESC"],
          ];
          break;
      }
    }

    const { count, rows }: any = await Farmer.findAndCountAll({
      where: whereCondition,
      attributes: [
        "id",
        "gender",
        "firstName",
        "lastName",
        "name",
        "age",
        "state",
        "village",
        "taluka",
        "district",
        "createdAt",
        "updatedAt",
        "onBoardedBy",
        "status",
      ],
      include: [
        {
          model: PotatoVarietyGrown,
          as: "PotatoVarietyGrown",
          attributes: ["id", "variety", "subVariety", "isCustom"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "mobile"],
        },
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
          model: LandDetail,
          as: "LandDetail",
          attributes: [
            "id",
            "landOwnedAcres",
            "landLeasedAcres",
            "soilType",
            "sowingMonth",
            "harvestMonth",
          ],
          where:
            Object.keys(landDetailsWhere).length > 0
              ? landDetailsWhere
              : undefined,
          required: Object.keys(landDetailsWhere).length > 0,
        },
        {
          model: IrrigationSource,
          as: "IrrigationSources",
          attributes: ["id", "method"],
        },
      ],
      limit,
      offset,
      order,
      distinct: true,
    });

    const data = rows.map((item) => ({
      id: item.id,
      gender: item.gender,
      name: item.name,
      firstName: item.firstName,
      lastName: item.lastName,
      age: item.age,
      village: item.village,
      taluka: item.taluka,
      state: item.state,
      district: item.district,
      registrationDate: formatDate(item.createdAt),
      onBoardedBy: item.onBoardedBy,
      status: item.status,
      onBoardedByUser: item.onBoardedByUser,
      PotatoVarietyGrown: item.PotatoVarietyGrown,
      users: item.user,
      LandDetails: item.LandDetail,
      IrrigationSources: item.IrrigationSources,
    }));

    return {
      data,
      page,
      totalPages: Math.ceil(count / limit),
      totalCount: count,
    };
  } catch (err) {
    console.error("Error in get farmer list:", err);
    throw err;
  }
}

export const deleteFarmerById = async (farmerId: number) => {
  const farmer = await Farmer.findByPk(farmerId);

  if (!farmer) {
    return { success: false, status: 404, message: "Farmer not found" };
  }

  const agentOnboardedFarmer = await AgentOnboardedUser.findOne({
    where: { userId: farmer.userId, userType: USER_TYPE.FARMER },
  });

  await Farmer.destroy({ where: { id: farmerId } });

  if (agentOnboardedFarmer) {
    await AgentOnboardedUser.destroy({
      where: { id: agentOnboardedFarmer.id },
    });
  }

  return { success: true, data: farmer };
};

export async function getAllFarmers(filters: any, search: string) {
  const whereCondition: any = {};
  const landDetailsWhere: any = {};

  const {
    agentId,
    state,
    district,
    potatoVariety,
    potatoSubVariety,
    taluka,
    ageRange,
    gender,
    landSizeRange,
    farmingType,
    soilType,
    sowingMonth,
    harvestMonth,
    irrigationSource,
    registrationDate,
    onboardedByUser,
  } = filters;

  if (agentId && agentId.toLowerCase() !== "all") {
    whereCondition.onBoardedBy = agentId;
  }

  if (state && state.toLowerCase() !== "all") {
    whereCondition.state = { [Op.iLike]: state };
  }

  if (district && district.toLowerCase() !== "all") {
    whereCondition.district = { [Op.iLike]: district };
  }

  if (taluka && taluka.toLowerCase() !== "all") {
    whereCondition.taluka = { [Op.iLike]: taluka };
  }

  if (gender && gender.toLowerCase() !== "all") {
    whereCondition.gender = { [Op.iLike]: gender };
  }

  if (potatoVariety && potatoVariety.toLowerCase() !== "all") {
    let condition = `LOWER("variety") = LOWER('${potatoVariety}')`;

    if (potatoSubVariety && potatoSubVariety.toLowerCase() !== "all") {
      condition += ` AND LOWER("subVariety") = LOWER('${potatoSubVariety}')`;
    }

    whereCondition.id = {
      [Op.in]: literal(`(
      SELECT "farmerId"
      FROM "PotatoVarietyGrown"
      WHERE ${condition}
    )`),
    };
  }

  if (ageRange && ageRange.length === 2) {
    const [min, max] = ageRange;
    if (min && max) {
      whereCondition.age = {
        [Op.between]: [Number(min), Number(max)],
      };
    }
  }

  if (soilType && soilType.toLowerCase() !== "all") {
    landDetailsWhere.soilType = { [Op.iLike]: soilType };
  }

  if (sowingMonth && sowingMonth.toLowerCase() !== "all") {
    landDetailsWhere.sowingMonth = { [Op.iLike]: sowingMonth };
  }

  if (harvestMonth && harvestMonth.toLowerCase() !== "all") {
    landDetailsWhere.harvestMonth = { [Op.iLike]: harvestMonth };
  }

  if (landSizeRange && landSizeRange.length === 2) {
    const [min, max] = landSizeRange;
    if (min && max) {
      landDetailsWhere.landOwnedAcres = {
        [Op.between]: [Number(min), Number(max)],
      };
    }
  }

  if (farmingType && farmingType.toLowerCase() !== "all") {
    const type = farmingType.toLowerCase();
    if (type === "own land") {
      landDetailsWhere.landOwnedAcres = { [Op.gt]: 0 };
    } else if (type === "lease") {
      landDetailsWhere.landLeasedAcres = { [Op.gt]: 0 };
    } else if (type === "both") {
      landDetailsWhere[Op.and] = [
        { landOwnedAcres: { [Op.gt]: 0 } },
        { landLeasedAcres: { [Op.gt]: 0 } },
      ];
    }
  }

  if (
    irrigationSource &&
    Array.isArray(irrigationSource) &&
    irrigationSource.length > 0
  ) {
    const validSources = irrigationSource
      .filter((s: string) => s && s.trim())
      .map((s: string) => s.toLowerCase());

    if (validSources.length > 0) {
      const formattedList = validSources.map((s) => `'${s}'`).join(",");

      whereCondition.id = {
        [Op.in]: Sequelize.literal(`(
          SELECT DISTINCT "farmerId"
          FROM "IrrigationSources"
          WHERE LOWER("method") IN (${formattedList})
        )`),
      };
    }
  }

  if (registrationDate && registrationDate.length === 2) {
    const [startDate, endDate] = registrationDate;
    if (startDate && endDate) {
      const { startUTC, endUTC } = convertISTDateRangeToUTC(startDate, endDate);
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
    ];
  }

  const farmers = await Farmer.findAll({
    where: whereCondition,
    include: [
      { model: User, as: "user", attributes: ["mobile"] },
      {
        model: User,
        as: "onBoardedByUser",
        attributes: ["name"],
        where: Object.keys(onBoardedByUserWhere).length
          ? onBoardedByUserWhere
          : undefined,
        required: Object.keys(onBoardedByUserWhere).length > 0,
      },
      {
        model: LandDetail,
        as: "LandDetail",
        attributes: [
          "id",
          "landOwnedAcres",
          "landLeasedAcres",
          "soilType",
          "sowingMonth",
          "harvestMonth",
        ],
        where:
          Object.keys(landDetailsWhere).length > 0
            ? landDetailsWhere
            : undefined,
        required: Object.keys(landDetailsWhere).length > 0,
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return farmers;
}

export const createFarmerWorksheetColumns = (worksheet: Worksheet) => {
  worksheet.columns = [
    { header: "Farmer ID", key: "id", width: 10 },
    { header: "First Name", key: "firstName", width: 20 },
    { header: "Last Name", key: "lastName", width: 20 },
    { header: "Name", key: "name", width: 20 },
    { header: "Gender", key: "gender", width: 10 },
    { header: "Age", key: "age", width: 10 },
    { header: "Mobile", key: "mobile", width: 15 },
    { header: "Optional Number", key: "optionalNumber", width: 20 },
    { header: "Whatsapp Number", key: "whatsappNumber", width: 20 },
    { header: "Caste", key: "caste", width: 15 },
    { header: "Sub Caste", key: "subCaste", width: 15 },
    { header: "State", key: "state", width: 15 },
    { header: "District", key: "district", width: 15 },
    { header: "Taluka", key: "taluka", width: 15 },
    { header: "Village", key: "village", width: 20 },
    { header: "Pin Code", key: "pinCode", width: 20 },
    { header: "DIGI Pin", key: "digiPin", width: 20 },
    { header: "Aadhar Number", key: "aadhaarNumber", width: 20 },
    { header: "Registration Date", key: "registrationDate", width: 20 },
    { header: "Onboarded By", key: "onBoardedBy", width: 20 },
    { header: "Status", key: "status", width: 10 },
    { header: "Land Owned (Acres)", key: "landOwned", width: 15 },
    { header: "Land Leased (Acres)", key: "landLeased", width: 15 },
    { header: "Sowing Month", key: "sowingMonth", width: 15 },
    { header: "Harvest Month", key: "harvestMonth", width: 15 },
    {
      header: "Total Land Under Cultivation",
      key: "totalLandUnderCultivation",
      width: 20,
    },
    {
      header: "Land For Potato Farming",
      key: "landForPotatoFarming",
      width: 20,
    },
    { header: "Soil Type", key: "soilType", width: 15 },
    { header: "Area Under Drip", key: "areaUnderDrip", width: 20 },
    {
      header: "Storage Capacity At Farm",
      key: "storageCapacityAtFarm",
      width: 25,
    },
    {
      header: "Irrigation Equipment Brand",
      key: "irrigationEquipmentBrand",
      width: 25,
    },
    { header: "Seed Procurement Type", key: "seedProcurementType", width: 20 },
    { header: "New Seed (%)", key: "newSeedPercent", width: 15 },
    { header: "Reused Seed (%)", key: "reusedSeedPercent", width: 15 },
    { header: "Seed Brand Name", key: "seedBrandName", width: 20 },
    { header: "Average Yield/Acre", key: "averageYieldPerAcre", width: 20 },
    { header: "Primary Sales Point", key: "primarySalesPoint", width: 20 },
    {
      header: "Distance to Nearest Mandi",
      key: "distanceToNearestMandi",
      width: 20,
    },
    {
      header: "Grading Machine at Farm",
      key: "isGradingMachineAtFarm",
      width: 20,
    },
    { header: "Shade at Farm Gate", key: "isShadeAtFarmGate", width: 20 },
    {
      header: "Is Under Contract Farming",
      key: "isUnderContractFarming",
      width: 20,
    },
    { header: "Contract Partner Name", key: "contractPartnerName", width: 20 },
    { header: "Reason for Trust", key: "reasonForTrust", width: 20 },
    { header: "Preference", key: "preference", width: 20 },
    {
      header: "Contract Farming (%)",
      key: "contractFarmingPercent",
      width: 20,
    },
    {
      header: "Sold in Spot Market (%)",
      key: "soldInSpotMarketPercent",
      width: 20,
    },
    {
      header: "Stored in Cold Storage (%)",
      key: "storedInColdStoragePercent",
      width: 25,
    },
    {
      header: "Interested in Digital Trading",
      key: "interestedInDigitalTrading",
      width: 25,
    },
    {
      header: "Uses WhatsApp for Business",
      key: "usesWhatsappForBusiness",
      width: 25,
    },

    { header: "Irrigation Sources", key: "irrigationSources", width: 40 },
    { header: "Irrigation Methods", key: "irrigationMethods", width: 40 },
    { header: "Farm Equipments", key: "farmEquipments", width: 40 },
    { header: "Potato Varieties", key: "potatoVarieties", width: 40 },
    { header: "Price Discovery Methods", key: "priceDiscovery", width: 40 },
    { header: "Selling Challenges", key: "sellingChallenges", width: 50 },
    {
      header: "Major Selling Challenge",
      key: "majorSellingChallenge",
      width: 40,
    },
    { header: "Selling Channels", key: "sellingChannels", width: 40 },
    { header: "Technology Used", key: "technologyUsed", width: 40 },
    { header: "Brand Preference Reasons", key: "brandPreferences", width: 40 },
    { header: "Selling Price", key: "sellingPrices", width: 40 },
    { header: "Selling Place", key: "sellingPlaces", width: 40 },
    { header: "Potato Types", key: "potatoTypes", width: 40 },
    { header: "Other Crops", key: "otherCrops", width: 50 },
  ];

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
};

export const addFarmersToWorksheet = async (
  farmers: any[],
  worksheet: Worksheet
) => {
  for (const farmer of farmers) {
    const farmerId = farmer.id;

    const [
      landDetail,
      irrigationSources,
      irrigationMethods,
      farmEquipments,
      potatoVarieties,
      priceDiscoveryMethods,
      sellingChallenges,
      majorSellingChallenges,
      sellingChannels,
      technologyUseds,
      brandPreferenceReasons,
      sellingPrices,
      sellingPlaces,
      potatoTypes,
      otherCropGrowns,
      seedBrandName,
    ] = await Promise.all([
      LandDetail.findOne({ where: { farmerId } }),
      IrrigationSource.findAll({ where: { farmerId }, attributes: ["method"] }),
      IrrigationMethod.findAll({ where: { farmerId }, attributes: ["method"] }),
      FarmEquipment.findAll({
        where: { farmerId },
        attributes: ["machine", "brand", "model"],
      }),
      PotatoVarietyGrown.findAll({
        where: { farmerId },
        attributes: ["variety", "subVariety", "isCustom"],
      }),
      PriceDiscoveryMethod.findAll({
        where: { farmerId },
        attributes: ["method"],
      }),
      SellingChallenge.findAll({ where: { farmerId }, attributes: ["name"] }),
      MajorSellingChallenge.findAll({
        where: { farmerId },
        attributes: ["name"],
      }),
      SellingChannel.findAll({ where: { farmerId }, attributes: ["name"] }),
      TechnologyUsed.findAll({ where: { farmerId }, attributes: ["name"] }),
      BrandPreferenceReason.findAll({
        where: { farmerId },
        attributes: ["reason"],
      }),
      SellingPrice.findAll({ where: { farmerId }, attributes: ["price"] }),
      SellingPlace.findAll({ where: { farmerId }, attributes: ["place"] }),
      PotatoType.findAll({ where: { farmerId }, attributes: ["type"] }),
      OtherCropGrown.findAll({
        where: { farmerId },
        attributes: ["cropName", "sowingMonth", "harvestingMonth"],
      }),
      SeedBrandName.findAll({ where: { farmerId }, attributes: ["name"] }),
    ]);

    worksheet.addRow({
      id: farmer.id,
      firstName: farmer.firstName,
      lastName: farmer.lastName,
      name: farmer.name,
      gender: farmer.gender,
      age: farmer.age,
      mobile: farmer.user?.mobile || "",
      optionalNumber: farmer.optionalNumber || "",
      whatsappNumber: farmer.whatsappNumber || "",
      caste: farmer.caste || "",
      subCaste: farmer.subCaste || "",
      state: farmer.state,
      district: farmer.district,
      taluka: farmer.taluka,
      village: farmer.village,
      pinCode: farmer.pinCode || "",
      digiPin: farmer.digiPin || "",
      aadhaarNumber: farmer.aadhaarNumber || "",
      registrationDate: formatDate(farmer.createdAt),
      onBoardedBy: farmer.onBoardedByUser?.name || "",
      status: farmer.status,
      // Land Details
      landOwned: landDetail?.landOwnedAcres || "",
      landLeased: landDetail?.landLeasedAcres || "",
      sowingMonth: landDetail?.sowingMonth || "",
      harvestMonth: landDetail?.harvestMonth || "",
      totalLandUnderCultivation: landDetail?.totalLandUnderCultivation || "",
      landForPotatoFarming: landDetail?.landForPotatoFarming || "",
      soilType: landDetail?.soilType || "",
      areaUnderDrip: landDetail?.areaUnderDrip ? "Yes" : "No",
      storageCapacityAtFarm: landDetail?.storageCapacityAtFarm ? "Yes" : "No",
      irrigationEquipmentBrand: landDetail?.irrigationEquipmentBrand || "",
      seedProcurementType: landDetail?.seedProcurementType || "",
      newSeedPercent: landDetail?.newSeedPercent || "",
      reusedSeedPercent: landDetail?.reusedSeedPercent || "",
      averageYieldPerAcre: landDetail?.averageYieldPerAcre || "",
      primarySalesPoint: landDetail?.primarySalesPoint || "",
      distanceToNearestMandi: landDetail?.distanceToNearestMandi || "",
      isGradingMachineAtFarm: landDetail?.isGradingMachineAtFarm || "",
      isShadeAtFarmGate: landDetail?.isShadeAtFarmGate ? "Yes" : "No",
      isUnderContractFarming: landDetail?.isUnderContractFarming ? "Yes" : "No",
      contractPartnerName: landDetail?.contractPartnerName || "",
      reasonForTrust: landDetail?.reasonForTrust || "",
      preference: landDetail?.preference || "",
      contractFarmingPercent: landDetail?.contractFarmingPercent || "",
      soldInSpotMarketPercent: landDetail?.soldInSpotMarketPercent || "",
      storedInColdStoragePercent: landDetail?.storedInColdStoragePercent || "",
      interestedInDigitalTrading: landDetail?.interestedInDigitalTrading
        ? "Yes"
        : "No",
      usesWhatsappForBusiness: landDetail?.usesWhatsappForBusiness
        ? "Yes"
        : "No",

      // Associations
      irrigationSources: irrigationSources.map((i) => i.method).join(", "),
      irrigationMethods: irrigationMethods.map((i) => i.method).join(", "),
      farmEquipments: farmEquipments
        .map((e) =>
          `${e.machine || ""} ${e.brand || ""} ${e.model || ""}`.trim()
        )
        .join(", "),
      potatoVarieties: potatoVarieties
        .map((v) => `${v.variety}${v.subVariety ? ` (${v.subVariety})` : ""}`)
        .join(", "),
      priceDiscovery: priceDiscoveryMethods.map((p) => p.method).join(", "),
      sellingChallenges: sellingChallenges.map((s) => s.name).join(", "),
      majorSellingChallenge: majorSellingChallenges
        .map((s) => s.name)
        .join(", "),
      sellingChannels: sellingChannels.map((s) => s.name).join(", "),
      technologyUsed: technologyUseds.map((t) => t.name).join(", "),
      brandPreferences: brandPreferenceReasons.map((b) => b.reason).join(", "),
      sellingPrices: sellingPrices.map((p) => p.price).join(", "),
      sellingPlaces: sellingPlaces.map((p) => p.place).join(", "),
      potatoTypes: potatoTypes.map((p) => p.type).join(", "),
      otherCrops: otherCropGrowns
        .map((c) => `${c.cropName} (${c.sowingMonth} - ${c.harvestingMonth})`)
        .join(", "),
      seedBrandName: seedBrandName.map((v) => v.name).join(", "),
    });
  }
};

export const getFarmerProfileCompletion = async (userId: number) => {
  const farmer = await Farmer.findOne({ where: { userId } });
  if (!farmer) {
    return {
      hasFarmerProfile: false,
      completion: 0,
      message: "User has no farmer profile",
    };
  }

  // Required fields in Farmer table
  const requiredFarmerFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "optionalNumber",
    "whatsappNumber",
    "village",
    "taluka",
    "district",
    "state",
    "pinCode",
    "digiPin",
    "geoLocation",
    "isAadhaarCard",
    "aadhaarNumber",
    "isBankAccount",
  ];

  // Required fields in LandDetail table
  const requiredLandFields = [
    "landOwnedAcres",
    "landLeasedAcres",
    "totalLandUnderCultivation",
    "landForPotatoFarming",
    "areaUnderDrip",
    "storageCapacityAtFarm",
    "irrigationEquipmentBrand",
    "irrigationEquipmentModel",
    "seedProcurementType",
    "newSeedPercent",
    "reusedSeedPercent",
    "soilType",
    "averageYieldPerAcre",
    "sowingMonth",
    "harvestMonth",
    "equipmentSource",
    "preference",
    "contractFarmingPercent",
    "soldInSpotMarketPercent",
    "storedInColdStoragePercent",
    "interestedInDigitalTrading",
    "usesWhatsappForBusiness",
    "suggestions",
  ];

  // Associated required models
  const associatedModels: {
    key: string;
    model: ModelStatic<Model<any, any>>;
  }[] = [
    { key: "irrigationSources", model: IrrigationSource },
    { key: "irrigationMethods", model: IrrigationMethod },
    { key: "potatoVarieties", model: PotatoVarietyGrown },
    { key: "farmEquipment", model: FarmEquipment },
    { key: "technologyUsed", model: TechnologyUsed },
    { key: "sellingPlaces", model: SellingPlace },
    { key: "sellingChannels", model: SellingChannel },
    { key: "sellingChallenges", model: SellingChallenge },
    { key: "majorSellingChallenges", model: MajorSellingChallenge },
    { key: "brandPreferenceReasons", model: BrandPreferenceReason },
    { key: "sellingPrices", model: SellingPrice },
    { key: "potatoTypes", model: PotatoType },
    { key: "otherCropsGrown", model: OtherCropGrown },
    { key: "priceDiscoveryMethods", model: PriceDiscoveryMethod },
    { key: "seedBrandName", model: SeedBrandName },
  ];

  let totalRequiredFields =
    requiredFarmerFields.length +
    requiredLandFields.length +
    associatedModels.length;
  let filledFields = 0;

  // Farmer table fields
  for (const field of requiredFarmerFields) {
    const value = (farmer as any)[field];
    if (value !== undefined && value !== null && value !== "") {
      filledFields++;
    }
  }

  // LandDetail table fields (single record per farmer)
  const landDetail = await LandDetail.findOne({
    where: { farmerId: farmer.id },
  });
  if (landDetail) {
    for (const field of requiredLandFields) {
      const value = (landDetail as any)[field];
      if (value !== undefined && value !== null && value !== "") {
        filledFields++;
      }
    }
  }

  // ssociated models (check record presence)
  for (const { model } of associatedModels) {
    const count = await model.count({ where: { farmerId: farmer.id } });
    if (count > 0) filledFields++;
  }

  // Compute percentage
  const completion = totalRequiredFields
    ? Math.round((filledFields / totalRequiredFields) * 100)
    : 0;

  return {
    hasFarmerProfile: true,
    completion,
    message: `Farmer profile completion: ${completion}%`,
    details: {
      filledFields,
      totalRequiredFields,
    },
  };
};
