import { literal, Model, ModelStatic, Op, Sequelize } from "sequelize";
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
import User, { REGISTRATION_STATUS, USER_ROLES } from "../database/models/user";
import AgentOnboardedUser, {
  USER_TYPE,
} from "../database/models/agentOnboardedUsers";
import { convertISTDateRangeToUTC, formatDate } from "../utils/dateFormat";
import { getRegistrationTypes, getUserRole } from "./userServices";
import ProcurementRegion from "../database/models/trader/procurementRegions";
import ExporterDetail from "../database/models/trader/exporterDetail";

export async function onboardTrader(payload) {
  try {
    return await sequelize.transaction(async (t) => {
      const trader = await Trader.create(
        {
          firstName: payload.firstName,
          lastName: payload.lastName,
          fullName: payload.fullName
            ? payload.fullName
            : `${payload.firstName || ""} ${payload.lastName || ""}`.trim(),
          businessName: payload.businessName,
          businessAddress: payload.businessAddress,
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
          annualTurnover: payload.annualTurnover,
          ownPotatoFarming: payload.ownPotatoFarming,
          acres: payload.acres,
          yearlyPurchaseVolumeTons: payload.yearlyPurchaseVolumeTons,
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
          marketCoverageStates: payload.marketCoverageStates,
          procurementRegionStates: payload.procurementRegionStates,
          userId: payload.userId,
          onBoardedBy: payload.onBoardedBy,
          subVariety: payload.subVariety,
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

      if (payload.procurementRegions) {
        for (const { name } of payload.procurementRegions) {
          await ProcurementRegion.create(
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

      if (payload.exporterDetails) {
        await ExporterDetail.create(
          { traderId: trader.id, ...payload.exporterDetails },
          { transaction: t }
        );
      }

      if (payload.traderDocuments) {
        await TraderDocument.create(
          { traderId: trader.id, ...payload.traderDocuments },
          { transaction: t }
        );
      }

      const user = await getUserRole(payload.onBoardedBy);

      if (user.role === USER_ROLES.AGENT)
        await AgentOnboardedUser.create(
          {
            userId: payload.userId,
            agentId: payload.onBoardedBy,
            userType: USER_TYPE.TRADER,
            userName: payload.fullName,
            village: payload.cityOrVillage,
            district: payload.district,
            state: payload.state,
            statusOfRegistration: REGISTRATION_STATUS.PENDING,
            entityId: trader.id,
          },
          { transaction: t }
        );

      return trader;
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function updateTraderService(traderId, payload) {
  return await sequelize.transaction(async (t) => {
    const isTraderExist = await Trader.findByPk(traderId, {
      transaction: t,
    });

    if (!isTraderExist) {
      throw new Error("Trader not found");
    }
    const updatableFields = [
      "firstName",
      "lastName",
      "fullName",
      "businessName",
      "businessAddress",
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
      "annualTurnover",
      "ownPotatoFarming",
      "acres",
      "yearlyPurchaseVolumeTons",
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
      "subVariety",
      "marketCoverageStates",
      "procurementRegionStates",
    ];

    const updateData: Record<string, any> = {};

    for (const key of updatableFields) {
      if (key in payload) updateData[key] = payload[key];
    }

    if (isTraderExist.status === REGISTRATION_STATUS.REJECTED) {
      updateData.status = REGISTRATION_STATUS.PENDING;
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
      procurementRegions: ProcurementRegion,
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

    if (payload.exporterDetails) {
      await safeUpsert(ExporterDetail, traderId, payload.exporterDetails, t);
    }

    if (payload.traderDocuments) {
      await safeUpsert(TraderDocument, traderId, payload.traderDocuments, t);
    }

    await AgentOnboardedUser.update(
      {
        userName: trader.fullName,
        village: trader.cityOrVillage,
        district: trader.district,
        state: trader.state,
        statusOfRegistration: trader.status,
      },
      {
        where: {
          userId: trader.userId,
          userType: USER_TYPE.TRADER,
        },
        transaction: t,
      }
    );

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
      exporterDetails,
      traderDocuments,
      interests,
      marketCoverages,
      procurementRegions,
      types,
      varieties,
      cropsTraded,
    ] = await Promise.all([
      Trader.findOne({
        where: { id: traderId },
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
      ExporterDetail.findOne({ where: { traderId } }),
      TraderDocument.findOne({ where: { traderId } }),
      TraderInterest.findAll({
        attributes: ["interest"],
        where: { traderId },
      }),
      MarketCoverage.findAll({
        attributes: ["name"],
        where: { traderId },
      }),
      ProcurementRegion.findAll({
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
      exporterDetails,
      traderDocuments,
      interests,
      marketCoverages,
      procurementRegions,
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
  search?: string,
  sortBy?: string
) => {
  try {
    const offset = (page - 1) * limit;
    const whereCondition: any = {};

    const {
      agentId,
      state,
      district,
      cityOrVillage,
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

    let order: any[] = [["updatedAt", "DESC"]];

    if (sortBy) {
      switch (sortBy.toLowerCase()) {
        case "name_asc":
          order = [["fullName", "ASC"]];
          break;
        case "name_desc":
          order = [["fullName", "DESC"]];
          break;
        case "acres_asc":
          order = [["acres", "ASC"]];
          break;
        case "acres_desc":
          order = [[literal('"acres" DESC NULLS LAST')]];
          break;
        case "created_asc":
          order = [["createdAt", "ASC"]];
          break;
        case "created_desc":
          order = [["createdAt", "DESC"]];
          break;
      }
    }

    const { count, rows }: any = await Trader.findAndCountAll({
      where: whereCondition,
      attributes: [
        "id",
        "firstName",
        "lastName",
        "fullName",
        "businessName",
        "businessAddress",
        "email",
        "mobileNumber",
        "state",
        "district",
        "cityOrVillage",
        "taluka",
        "pinCode",
        "digiPin",
        "geoLocation",
        "acres",
        "createdAt",
        "updatedAt",
        "onBoardedBy",
        "status",
        "subVariety",
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
          attributes: ["id", "name", "email", "role", "mobile"],
          where: Object.keys(onBoardedByUserWhere).length
            ? onBoardedByUserWhere
            : undefined,
          required: Object.keys(onBoardedByUserWhere).length > 0,
        },
      ],
      limit,
      offset,
      order,
      distinct: true,
    });

    const data = rows.map((trader) => ({
      id: trader.id,
      firstName: trader.firstName,
      lastName: trader.lastName,
      fullName: trader.fullName,
      businessName: trader.businessName,
      businessAddress: trader.businessAddress,
      mobileNumber: trader.mobileNumber,
      email: trader.email,
      cityOrVillage: trader.cityOrVillage,
      district: trader.district,
      state: trader.state,
      pinCode: trader.pinCode,
      digiPin: trader.digiPin,
      geoLocation: trader.geoLocation,
      acres: trader.acres,
      onboardingDate: trader.createdAt.toISOString().split("T")[0],
      user: trader.user,
      onBoardedBy: trader.onBoardedByUser,
      status: trader.status,
      subVariety: trader.subVariety,
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

export const deleteTraderById = async (traderId: number) => {
  const trader = await Trader.findByPk(traderId);

  if (!trader) {
    return { success: false, status: 404, message: "Trader not found" };
  }

  const agentOnboardedTrader = await AgentOnboardedUser.findOne({
    where: { userId: trader.userId, userType: USER_TYPE.TRADER },
  });

  await Trader.destroy({ where: { id: traderId } });

  if (agentOnboardedTrader) {
    await AgentOnboardedUser.destroy({
      where: { id: agentOnboardedTrader.id },
    });
  }

  return { success: true, data: trader };
};

export const getAllTraders = async (filters, search) => {
  const whereCondition: any = {};

  const {
    agentId,
    state,
    district,
    cityOrVillage,
    registrationDate,
    onboardedByUser,
  } = filters;

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

  const traders = await Trader.findAll({
    where: whereCondition,
    include: [
      { model: User, as: "user", attributes: ["name", "mobile"] },
      {
        model: User,
        as: "onBoardedByUser",
        attributes: ["name", "mobile"],
        where: Object.keys(onBoardedByUserWhere).length
          ? onBoardedByUserWhere
          : undefined,
        required: Object.keys(onBoardedByUserWhere).length > 0,
      },
    ],
    order: [["updatedAt", "DESC"]],
  });

  return traders;
};

export const createTraderWorksheetColumns = (worksheet) => {
  worksheet.columns = [
    { header: "Trader ID", key: "id", width: 10 },
    { header: "First Name", key: "firstName", width: 20 },
    { header: "Last Name", key: "lastName", width: 20 },
    { header: "Full Name", key: "fullName", width: 25 },
    { header: "Business Name", key: "businessName", width: 30 },
    { header: "Business Address", key: "businessAddress", width: 30 },
    { header: "Mobile", key: "mobileNumber", width: 20 },
    { header: "Email", key: "email", width: 25 },
    { header: "State", key: "state", width: 20 },
    { header: "District", key: "district", width: 20 },
    { header: "City/Village", key: "cityOrVillage", width: 20 },
    { header: "Taluka", key: "taluka", width: 20 },
    { header: "PIN", key: "pinCode", width: 15 },
    { header: "DIGI PIN", key: "digiPin", width: 20 },
    { header: "Registration Date", key: "registrationDate", width: 20 },
    { header: "Onboarded By", key: "onBoardedBy", width: 20 },
    { header: "Status", key: "status", width: 10 },
    { header: "Sub Varieties", key: "subVariety", width: 20 },
    { header: "Language", key: "languagePreference", width: 20 },
    { header: "Employees", key: "numberOfEmployees", width: 20 },
    { header: "Annual Turnover", key: "annualTurnover", width: 20 },
    { header: "Own Potato Farming", key: "ownPotatoFarming", width: 20 },
    { header: "Contract Farming", key: "contractFarming", width: 20 },
    { header: "Spot Buying", key: "spotBuying", width: 20 },
    { header: "Seeds Sales", key: "seedsSales", width: 20 },
    { header: "Own Cold Storage", key: "ownColdStorage", width: 20 },
    {
      header: "Yearly Volume (Tons)",
      key: "yearlyPurchaseVolumeTons",
      width: 25,
    },
    {
      header: "Geographical Market",
      key: "geographicalMarketCovered",
      width: 30,
    },
    { header: "Years in Trading", key: "yearsInTrading", width: 20 },
    { header: "Daily Sales (Katta)", key: "averageDailySalesKatta", width: 25 },
    { header: "Market Types", key: "traderTypes", width: 50 },
    { header: "Trader Varieties", key: "traderVarieties", width: 50 },
    { header: "Crops Traded", key: "cropsTraded", width: 50 },
    { header: "Trader Interests", key: "traderInterests", width: 50 },
    { header: "Procurement Regions", key: "procurementRegions", width: 50 },
    {
      header: "Procurement Region States",
      key: "procurementRegionStates",
      width: 50,
    },
    { header: "Market Coverage", key: "marketCoverages", width: 50 },
    {
      header: "Market Coverage States",
      key: "marketCoverageStates",
      width: 50,
    },
    { header: "Mandi Details", key: "mandiDetail", width: 80 },
    { header: "Exporter Details", key: "exporterDetail", width: 80 },
  ];

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
};

export const addTradersToWorksheet = async (traders, worksheet) => {
  for (const trader of traders) {
    const traderId = trader.id;

    const [
      traderTypes,
      traderVarieties,
      cropsTraded,
      traderInterests,
      marketCoverages,
      procurementRegions,
      mandiDetail,
      exporterDetail,
    ] = await Promise.all([
      TraderType.findAll({ where: { traderId }, attributes: ["type"] }),
      TraderVariety.findAll({ where: { traderId }, attributes: ["variety"] }),
      CropTraded.findAll({ where: { traderId }, attributes: ["cropName"] }),
      TraderInterest.findAll({ where: { traderId }, attributes: ["interest"] }),
      MarketCoverage.findAll({ where: { traderId }, attributes: ["name"] }),
      ProcurementRegion.findAll({ where: { traderId }, attributes: ["name"] }),
      MandiDetail.findOne({
        where: { traderId },
        attributes: ["mandiName", "shopNumber", "mandiLicenceNo"],
      }),
      ExporterDetail.findOne({
        where: { traderId },
        attributes: ["regions", "potatoVarieties", "quantityPerYear"],
      }),
    ]);

    worksheet.addRow({
      id: trader.id,
      firstName: trader.firstName,
      lastName: trader.lastName,
      fullName: trader.fullName,
      businessName: trader.businessName,
      businessAddress: trader.businessAddress,
      mobileNumber: trader.mobileNumber,
      email: trader.email || "",
      state: trader.state,
      district: trader.district,
      cityOrVillage: trader.cityOrVillage,
      taluka: trader.taluka,
      pinCode: trader.pinCode,
      digiPin: trader.digiPin || "",
      registrationDate: formatDate(trader.createdAt),
      onBoardedBy: trader.onBoardedByUser?.name || "",
      status: trader.status,
      subVariety: trader.subVariety,
      languagePreference: trader.languagePreference || "",
      numberOfEmployees: trader.numberOfEmployees || "",
      annualTurnover: trader.annualTurnover || "",
      ownPotatoFarming: trader.ownPotatoFarming ? "Yes" : "No",
      contractFarming: trader.contractFarming ? "Yes" : "No",
      spotBuying: trader.spotBuying ? "Yes" : "No",
      seedsSales: trader.seedsSales ? "Yes" : "No",
      ownColdStorage: trader.ownColdStorage ? "Yes" : "No",
      yearlyPurchaseVolumeTons: trader.yearlyPurchaseVolumeTons || "",
      geographicalMarketCovered: trader.geographicalMarketCovered || "",
      yearsInTrading: trader.yearsInTrading || "",
      averageDailySalesKatta: trader.averageDailySalesKatta || "",
      traderTypes: traderTypes.map((t) => t.type).join(", "),
      traderVarieties: traderVarieties.map((v) => v.variety).join(", "),
      cropsTraded: cropsTraded.map((c) => c.cropName).join(", "),
      traderInterests: traderInterests.map((i) => i.interest).join(", "),
      procurementRegions: procurementRegions.map((m) => m.name).join(", "),
      procurementRegionStates: trader.procurementRegionStates || "",
      marketCoverages: marketCoverages.map((m) => m.name).join(", "),
      marketCoverageStates: trader.marketCoverageStates || "",
      mandiDetail: mandiDetail
        ? `Mandi: ${mandiDetail.mandiName}, Shop: ${mandiDetail.shopNumber}, Licence: ${mandiDetail.mandiLicenceNo}`
        : "",
      exporterDetail: exporterDetail
        ? `Regions: ${exporterDetail.regions}, Potato Varieties: ${exporterDetail.potatoVarieties}, Average export quantity per year: ${exporterDetail.quantityPerYear}`
        : "",
    });
  }
};

export const getTraderProfileCompletion = async (userId: number) => {
  const trader = await Trader.findOne({ where: { userId } });
  if (!trader) {
    return {
      hasTraderProfile: false,
      completion: 0,
      message: "User has no trader profile",
    };
  }

  // Required fields in Trader table
  const requiredTraderFields = [
    "firstName",
    "lastName",
    "mobileNumber",
    "businessAddress",
    "businessName",
    "cityOrVillage",
    "district",
    "state",
    "pinCode",
    "yearlyPurchaseVolumeTons",
    "numberOfEmployees",
    "yearsInTrading",
    "averageDailySalesKatta",
    "companyRegisteredVendor",
    "mainCompany",
    "annualTurnover",
    "ownPotatoFarming",
    "acres",
    "geographicalMarketCovered",
    "contractFarming",
    "spotBuying",
    "seedsSales",
    "ownColdStorage",
    "onlineAuctionInterest",
    "acceptsOnlinePayments",
    "panNumber",
    "gstNumber",
    "fssaiNumber",
  ];

  // Associated required models
  const associatedModels: {
    key: string;
    model: ModelStatic<Model<any, any>>;
  }[] = [
    { key: "traderVarieties", model: TraderVariety },
    { key: "cropsTraded", model: CropTraded },
    { key: "traderInterests", model: TraderInterest },
    { key: "traderTypes", model: TraderType },
    { key: "marketCoverages", model: MarketCoverage },
    { key: "procurementRegions", model: ProcurementRegion },
    { key: "bankDetails", model: BankDetail },
    { key: "mandiDetails", model: MandiDetail },
    { key: "exporterDetails", model: ExporterDetail },
    { key: "traderDocuments", model: TraderDocument },
  ];

  let totalRequiredFields =
    requiredTraderFields.length + associatedModels.length;
  let filledFields = 0;

  // Trader table fields
  for (const field of requiredTraderFields) {
    const value = (trader as any)[field];
    if (value !== undefined && value !== null && value !== "") {
      filledFields++;
    }
  }

  // Associated models (check record presence)
  for (const { model } of associatedModels) {
    const count = await model.count({ where: { traderId: trader.id } });
    if (count > 0) filledFields++;
  }

  const traderTypes = await TraderType.findAll({
    where: { traderId: trader.id },
  });

  const typeNames = traderTypes.map((t) => t.type);

  // If Exporter type, include ExporterDetail fields
  if (
    typeNames.includes("Exporter") ||
    typeNames.includes("Exporter (निर्यातक/નિકાસકાર/ਨਿਰਯਾਤਕ)")
  ) {
    const exporterDetail = await ExporterDetail.findOne({
      where: { traderId: trader.id },
    });

    const requiredExporterFields = [
      "regions",
      "potatoVarieties",
      "quantityPerYear",
    ];

    totalRequiredFields += requiredExporterFields.length;

    if (exporterDetail) {
      for (const field of requiredExporterFields) {
        const value = (exporterDetail as any)[field];
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          (!Array.isArray(value) || value.length > 0)
        ) {
          filledFields++;
        }
      }
    }
  }

  // If Mandi Agent type, include MandiDetail fields
  if (
    typeNames.includes("Mandi Agent") ||
    typeNames.includes("Mandi Agent (मंडी एजेंट/માંડી એજન્ટ/ਮੰਡੀ ਏਜੰਟ)")
  ) {
    const mandiDetail = await MandiDetail.findOne({
      where: { traderId: trader.id },
    });

    const requiredMandiFields = [
      "state",
      "cityOrVillage",
      "district",
      "mandiName",
      "shopNumber",
      "mandiLicenceNo",
    ];

    totalRequiredFields += requiredMandiFields.length;

    if (mandiDetail) {
      for (const field of requiredMandiFields) {
        const value = (mandiDetail as any)[field];
        if (value !== undefined && value !== null && value !== "") {
          filledFields++;
        }
      }
    }
  }

  // Compute percentage
  const completion = totalRequiredFields
    ? Math.round((filledFields / totalRequiredFields) * 100)
    : 0;

  return {
    hasTraderProfile: true,
    completion,
    message: `Trader profile completion: ${completion}%`,
    details: {
      filledFields,
      totalRequiredFields,
    },
  };
};
