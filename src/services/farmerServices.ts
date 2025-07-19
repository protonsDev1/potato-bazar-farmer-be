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
import User from "../database/models/user";
import { convertISTDateRangeToUTC, formatDate } from "../utils/dateFormat";
import BrandPreferenceReason from "../database/models/brandPreferenceReason";
import SellingPrice from "../database/models/sellingPrice";
import SellingPlace from "../database/models/sellingPlace";
import OtherCropGrown from "../database/models/otherCropGrown";
import IrrigationMethod from "../database/models/irrigationMethod";
import PotatoType from "../database/models/potatoType";

interface Payload {
  name: string;
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
  potatoVarieties?: Array<{ variety: string; subVariety?: string }>;
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
          name: payload.name,
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

    const updateData = {};
    for (const key of updatableFields) {
      if (key in payload) updateData[key] = payload[key];
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
      attributes: ["variety", "subVariety"],
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
  search
) {
  try {
    const offset = (page - 1) * limit;
    const whereCondition: any = {};

    const {
      agentId,
      state,
      district,
      potatoVariety,
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
      whereCondition.id = {
        [Op.in]: literal(`(
          SELECT "farmerId"
          FROM "PotatoVarietyGrown"
         WHERE LOWER("variety") = LOWER('${potatoVariety}')
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

    if (search?.trim()) {
      const searchTerm = `%${search?.trim()}%`;
      whereCondition[Op.or] = [
        { id: isNaN(Number(search)) ? -1 : Number(search) },
        { name: { [Op.iLike]: searchTerm } },
      ];
    }

    const { count, rows }: any = await Farmer.findAndCountAll({
      where: whereCondition,
      attributes: [
        "id",
        "gender",
        "name",
        "age",
        "state",
        "village",
        "taluka",
        "district",
        "createdAt",
        "onBoardedBy",
      ],
      include: [
        {
          model: PotatoVarietyGrown,
          as: "PotatoVarietyGrown",
          attributes: ["id", "variety", "subVariety"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "mobile"],
        },
        {
          model: LandDetail,
          as: "LandDetails",
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
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    const data = rows.map((item) => ({
      id: item.id,
      gender: item.gender,
      name: item.name,
      age: item.age,
      village: item.village,
      taluka: item.taluka,
      state: item.state,
      district: item.district,
      registrationDate: formatDate(item.createdAt),
      onBoardedBy: item.onBoardedBy,
      PotatoVarietyGrown: item.PotatoVarietyGrown,
      users: item.user,
      LandDetails: item.LandDetails,
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
