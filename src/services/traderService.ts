import { Model, ModelStatic, Op, Sequelize } from "sequelize";
import sequelize from "../database/models/db";

import BankDetail from "../database/models/trader/bankDetail";
import CropTraded from "../database/models/trader/cropTraded";
import MandiDetail from "../database/models/trader/mandiDetail";
import MarketCoverage from "../database/models/trader/marketCoverage";
import Trader from "../database/models/trader/trader";
import TraderDocument from "../database/models/trader/traderDocument";
import TraderInterest from "../database/models/trader/traderInterest";
import TraderType from "../database/models/trader/traderType";
import TraderVariety from "../database/models/trader/traderVariety";
import User from "../database/models/user";
import { convertISTDateRangeToUTC } from "../utils/dateFormat";
import AgentOnboardedUser, {
  USER_TYPE,
} from "../database/models/agentOnboardedUsers";

export async function onboardTrader(payload) {
  try {
    return await sequelize.transaction(async (t) => {
      const trader = await Trader.create(
        {
          fullName: payload.fullName,
          businessName: payload.businessName,
          mobileNumber: payload.mobileNumber,
          whatsappNumber: payload.whatsappNumber,
          email: payload.email,
          state: payload.state,
          district: payload.district,
          cityOrVillage: payload.cityOrVillage,
          taluka: payload.taluka,
          pinCode: payload.pinCode,
          digiPin: payload.digiPin,
          geoLocation: payload.geoLocation,
          languagePreference: payload.languagePreference,
          companyRegisteredVendor: payload.companyRegisteredVendor,
          mainCompany: payload.mainCompany,
          numberOfEmployees: payload.numberOfEmployees,
          ownPotatoFarming: payload.ownPotatoFarming,
          acres: payload.acres,
          yearlyPurchaseVolumeTons: payload.yearlyPurchaseVolumeTons,
          mainProcurementRegion: payload.mainProcurementRegion,
          geographicalMarketCovered: payload.geographicalMarketCovered,
          contractFarming: payload.contractFarming,
          spotBuying: payload.spotBuying,
          seedsSales: payload.seedsSales,
          ownColdStorage: payload.ownColdStorage,
          yearsInTrading: payload.yearsInTrading,
          averageDailySalesKatta: payload.averageDailySalesKatta,
          salesOwnPotatoes: payload.salesOwnPotatoes,
          onlineAuctionInterest: payload.onlineAuctionInterest,
          bankLoanFacility: payload.bankLoanFacility,
          coldStorageAccess: payload.coldStorageAccess,
          acceptsOnlinePayments: payload.acceptsOnlinePayments,
          panNumber: payload.panNumber,
          gstNumber: payload.gstNumber,
          fssaiNumber: payload.fssaiNumber,
          userId: payload.userId,
          onBoardedBy: payload.onBoardedBy,
        },
        { transaction: t }
      );

      if (payload.traderInterests) {
        for (const { interest } of payload.traderInterests) {
          await TraderInterest.create(
            { traderId: trader.id, interest },
            { transaction: t }
          );
        }
      }

      if (payload.traderTypes) {
        for (const { type } of payload.traderTypes) {
          await TraderType.create(
            { traderId: trader.id, type },
            { transaction: t }
          );
        }
      }

      if (payload.traderVarieties) {
        for (const { variety } of payload.traderVarieties) {
          await TraderVariety.create(
            { traderId: trader.id, variety },
            { transaction: t }
          );
        }
      }

      if (payload.cropsTraded) {
        for (const { cropName } of payload.cropsTraded) {
          await CropTraded.create(
            { traderId: trader.id, cropName },
            { transaction: t }
          );
        }
      }

      if (payload.marketCoverages) {
        for (const { name } of payload.marketCoverages) {
          await MarketCoverage.create(
            { traderId: trader.id, name },
            { transaction: t }
          );
        }
      }

      if (payload.bankDetails) {
        await BankDetail.create(
          { traderId: trader.id, ...payload.bankDetails },
          { transaction: t }
        );
      }

      if (payload.mandiDetails) {
        await MandiDetail.create(
          { traderId: trader.id, ...payload.mandiDetails },
          { transaction: t }
        );
      }

      if (payload.traderDocuments) {
        await TraderDocument.create(
          { traderId: trader.id, ...payload.traderDocuments },
          { transaction: t }
        );
      }

      await AgentOnboardedUser.create({
        userId: payload.userId,
        agentId: payload.onBoardedBy,
        userType: USER_TYPE.TRADER,
        userName: payload.fullName,
        village: payload.cityOrVillage,
        district: payload.district,
        state: payload.state,
        statusOfRegistration: "complete",
      });

      return trader;
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function updateTraderService(traderId, payload) {
  return await sequelize.transaction(async (t) => {
    const updatableFields = [
      "fullName",
      "businessName",
      "mobileNumber",
      "whatsappNumber",
      "email",
      "state",
      "district",
      "taluka",
      "cityOrVillage",
      "pinCode",
      "digiPin",
      "geoLocation",
      "languagePreference",
      "companyRegisteredVendor",
      "mainCompany",
      "numberOfEmployees",
      "ownPotatoFarming",
      "acres",
      "yearlyPurchaseVolumeTons",
      "mainProcurementRegion",
      "geographicalMarketCovered",
      "contractFarming",
      "spotBuying",
      "seedsSales",
      "ownColdStorage",
      "yearsInTrading",
      "averageDailySalesKatta",
      "salesOwnPotatoes",
      "onlineAuctionInterest",
      "bankLoanFacility",
      "coldStorageAccess",
      "acceptsOnlinePayments",
    ];

    const updateData = {};
    for (const key of updatableFields) {
      if (key in payload) updateData[key] = payload[key];
    }

    await Trader.update(updateData, {
      where: { id: traderId },
      transaction: t,
    });

    const trader = await Trader.findByPk(traderId, { transaction: t });

    const relationMap: Record<string, ModelStatic<Model>> = {
      traderInterests: TraderInterest,
      traderTypes: TraderType,
      traderVarieties: TraderVariety,
      cropsTraded: CropTraded,
      marketCoverages: MarketCoverage,
    };

    for (const [key, Model] of Object.entries(relationMap)) {
      if (payload[key]) {
        await Model.destroy({ where: { traderId }, transaction: t });
        const records = payload[key].map((item) => ({
          traderId,
          ...item,
        }));
        await Model.bulkCreate(records, { transaction: t });
      }
    }

    if (payload.bankDetails) {
      await safeUpsert(BankDetail, traderId, payload.bankDetails, t);
    }

    if (payload.mandiDetails) {
      await safeUpsert(MandiDetail, traderId, payload.mandiDetails, t);
    }

    if (payload.traderDocuments) {
      await safeUpsert(TraderDocument, traderId, payload.traderDocuments, t);
    }

    return trader;
  });
}

export const retrieveTraderProfile = async (
  traderId: string,
  isWithin24Hours
) => {
  try {
    const [
      personalInfo,
      bankDetails,
      mandiDetails,
      traderDocuments,
      interests,
      marketCoverages,
      types,
      varieties,
      cropsTraded,
    ] = await Promise.all([
      Trader.findOne({
        where: { id: traderId, isDeleted: false },
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
      }),
      BankDetail.findOne({ where: { traderId } }),
      MandiDetail.findOne({ where: { traderId } }),
      TraderDocument.findOne({ where: { traderId } }),
      TraderInterest.findAll({
        attributes: ["interest"],
        where: { traderId },
      }),
      MarketCoverage.findAll({
        attributes: ["name"],
        where: { traderId },
      }),
      TraderType.findAll({
        attributes: ["type"],
        where: { traderId },
      }),
      TraderVariety.findAll({
        attributes: ["variety"],
        where: { traderId },
      }),
      CropTraded.findAll({
        attributes: ["cropName"],
        where: { traderId },
      }),
    ]);

    return {
      personalInfo,
      bankDetails,
      mandiDetails,
      traderDocuments,
      interests,
      marketCoverages,
      types,
      varieties,
      cropsTraded,
      canAgentEdit: isWithin24Hours,
    };
  } catch (err) {
    console.error("Error in retrieveTraderProfile:", err);
    throw err;
  }
};

const safeUpsert = async (model, traderId, data, transaction) => {
  const existing = await model.findOne({ where: { traderId }, transaction });
  if (existing) {
    return model.update(data, { where: { traderId }, transaction });
  } else {
    return model.create({ traderId, ...data }, { transaction });
  }
};

export const getTraderListByAdmin = async (
  page = 1,
  limit = 10,
  filters,
  search?: string
) => {
  try {
    const offset = (page - 1) * limit;
    const whereCondition: any = {};

    whereCondition.isDeleted = false;

    const { agentId, state, district, cityOrVillage, registrationDate } =
      filters;

    if (agentId && agentId.toLowerCase() !== "all") {
      whereCondition.onBoardedBy = agentId;
    }

    if (district && district.toLowerCase() !== "all") {
      whereCondition.district = { [Op.iLike]: district };
    }

    if (state && state.toLowerCase() !== "all") {
      whereCondition.state = { [Op.iLike]: state };
    }

    if (cityOrVillage && cityOrVillage.toLowerCase() !== "all") {
      whereCondition.cityOrVillage = { [Op.iLike]: cityOrVillage };
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
        { fullName: { [Op.iLike]: searchTerm } },
        { mobileNumber: { [Op.iLike]: searchTerm } },
        { email: { [Op.iLike]: searchTerm } },
        Sequelize.where(Sequelize.col("onBoardedByUser.name"), {
          [Op.iLike]: searchTerm,
        }),
      ];
    }

    const { count, rows }: any = await Trader.findAndCountAll({
      where: whereCondition,
      attributes: [
        "id",
        "fullName",
        "businessName",
        "email",
        "mobileNumber",
        "state",
        "district",
        "cityOrVillage",
        "taluka",
        "pinCode",
        "digiPin",
        "geoLocation",
        "createdAt",
        "onBoardedBy",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "mobile"],
        },
        {
          model: User,
          as: "onBoardedByUser",
          attributes: ["id", "name", "email", "mobile"],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    const data = rows.map((trader) => ({
      id: trader.id,
      fullName: trader.fullName,
      businessName: trader.businessName,
      mobileNumber: trader.mobileNumber,
      email: trader.email,
      cityOrVillage: trader.cityOrVillage,
      district: trader.district,
      state: trader.state,
      pinCode: trader.pinCode,
      digiPin: trader.digiPin,
      geoLocation: trader.geoLocation,
      onboardingDate: trader.createdAt.toISOString().split("T")[0],
      user: trader.user,
      onBoardedBy: trader.onBoardedByUser,
    }));

    return {
      traders: data,
      page,
      totalPages: Math.ceil(count / limit),
      totalCount: count,
    };
  } catch (err) {
    console.error("Error in get trader list:", err);
    throw err;
  }
};

export const softDeleteTraderById = async (traderId: number) => {
  const trader = await Trader.findByPk(traderId);

  if (!trader || trader.isDeleted) {
    return { success: false, status: 404, message: "Trader not found" };
  }

  trader.isDeleted = true;
  await trader.save();

  return { success: true, data: trader };
};
