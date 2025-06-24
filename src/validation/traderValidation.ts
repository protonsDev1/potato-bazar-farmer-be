import Joi from "joi";

export const onboardTraderSchema = Joi.object({
  fullName: Joi.string().required(),
  businessName: Joi.string().required(),
  mobileNumber: Joi.string().max(15).required(),
  whatsappNumber: Joi.string().max(15).allow(null, ""),
  email: Joi.string().email().allow(null, ""),

  state: Joi.string().required(),
  district: Joi.string().required(),
  cityOrVillage: Joi.string().required(),
  pinCode: Joi.string().max(10).required(),
  languagePreference: Joi.string().required(),

  companyRegisteredVendor: Joi.boolean().optional(),
  mainCompany: Joi.string().allow(null, ""),

  numberOfEmployees: Joi.string().required(),
  ownPotatoFarming: Joi.boolean().optional(),
  acres: Joi.number().allow(null).optional(),
  yearlyPurchaseVolumeTons: Joi.number().required(),
  mainProcurementRegion: Joi.string().required(),
  geographicalMarketCovered: Joi.string().required(),

  contractFarming: Joi.boolean().optional(),
  spotBuying: Joi.boolean().optional(),
  seedsSales: Joi.boolean().optional(),
  ownColdStorage: Joi.boolean().optional(),
  yearsInTrading: Joi.string().required(),
  averageDailySalesKatta: Joi.number().required(),
  salesOwnPotatoes: Joi.boolean().optional(),
  onlineAuctionInterest: Joi.boolean().optional(),
  bankLoanFacility: Joi.boolean().optional(),
  coldStorageAccess: Joi.boolean().optional(),
  acceptsOnlinePayments: Joi.boolean().optional(),

  // panNumber: Joi.string().length(10).required(),
  // gstNumber: Joi.string().max(30).allow(null, ""),
  // fssaiNumber: Joi.string().max(50).allow(null, ""),

  userId: Joi.number().required(),

  // arrays of objects
  traderInterests: Joi.array()
    .items(
      Joi.object({
        interest: Joi.string().required(),
      })
    )
    .min(1)
    .required(),

  traderTypes: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().required(),
      })
    )
    .min(1)
    .required(),

  traderVarieties: Joi.array()
    .items(
      Joi.object({
        variety: Joi.string().required(),
      })
    )
    .min(1)
    .required(),

  cropsTraded: Joi.array()
    .items(
      Joi.object({
        cropName: Joi.string().required(),
      })
    )
    .min(1)
    .required(),

  // bankDetails: Joi.object({
  //   bankName: Joi.string().required(),
  //   accountHolderName: Joi.string().required(),
  //   accountNumber: Joi.string().required(),
  //   ifscCode: Joi.string().required(),
  //   branch: Joi.string().required(),
  // }).required(),

  mandiDetails: Joi.object({
    mandiName: Joi.string().required(),
    state: Joi.string().required(),
    cityOrVillage: Joi.string().required(),
    shopNumber: Joi.string().optional(),
  }).required(),

  traderDocuments: Joi.object({
    panCardUrl: Joi.string().uri().optional().allow(null, ""),
    businessCardUrl: Joi.string().uri().optional().allow(null, ""),
    tradeLicenseUrl: Joi.string().uri().optional().allow(null, ""),
    recentInvoiceUrl: Joi.string().uri().optional().allow(null, ""),
  }).optional(),
});
