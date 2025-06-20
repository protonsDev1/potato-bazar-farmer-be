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

import { literal, Op, Sequelize } from "sequelize";
import User from "../database/models/user";
import { convertISTDateRangeToUTC, formatDate } from "../utils/dateFormat";

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
  isAadhaarCard?: boolean;
  aadhaarNumber?: string;
  isBankAccount?: boolean;

  landDetails?: Array<Record<string, any>>;
  irrigationSources?: Array<{ method: string }>;
  potatoVarieties?: Array<{ variety: string; subVariety?: string }>;
  farmEquipment?: Array<{ machine: string; brand?: string; model?: string }>;
  technologyUsed?: Array<{ name: string }>;
  sellingChannels?: Array<{ name: string }>;
  sellingChallenges?: Array<{ name: string }>;
  majorSellingChallenges?: Array<{ name: string }>;
  priceDiscoveryMethods?: Array<{ method: string }>;

  onBoardedBy?: number;
  userId?: number;
}

export async function onboardFarmer(payload: Payload) {
  try {
    return await sequelize.transaction(async (t) => {
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

export const retrieveFarmerProfile = async (farmerId: string) => {
  try {
    const farmerPersonalInfo = await Farmer.findOne({
      where: { id: farmerId },
    });

    const landDetails = await LandDetail.findOne({
      where: { farmerId },
    });

    const irrigationDetails = await IrrigationSource.findAll({
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

    return {
      farmerPersonalInfo,
      landDetails,
      irrigationDetails,
      farmEquipments,
      potatoVariety,
      priceDiscoveryMethods,
      majorSellingChallenge,
      sellingChallenges,
      sellingChannels,
      technologyUsed,
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

    //      if(landSizeRange && landSizeRange.length===2)
    //     {
    //       const [min,max]=landSizeRange;
    //       if(min && max)
    //       {
    //            landDetailsWhere[Op.and] = landDetailsWhere[Op.and] || [];

    //   landDetailsWhere[Op.and].push(
    //   Sequelize.where(
    //     Sequelize.literal(
    //       `COALESCE("LandDetails"."landOwnedAcres", 0) + COALESCE("LandDetails"."landLeasedAcres", 0)`
    //     ),
    //     {
    //       [Op.between]: [min, max],
    //     }
    //   )
    // );
    //         };
    //       }

    if (farmingType && farmingType.toLowerCase() !== "all") {
      const type = farmingType.toLowerCase();
      if (type === "own land") {
        landDetailsWhere.landOwnedAcres = { [Op.not]: null };
      } else if (type === "lease") {
        landDetailsWhere.landLeasedAcres = { [Op.not]: null };
      } else if (type === "both") {
        landDetailsWhere[Op.and] = [
          { landOwnedAcres: { [Op.not]: null } },
          { landLeasedAcres: { [Op.not]: null } },
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
