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
  digiPin: Joi.string().optional().allow(null, ""),
  geoLocation: Joi.string().optional().allow(null, ""),
  languagePreference: Joi.string().required(),

  companyRegisteredVendor: Joi.boolean().optional(),
  mainCompany: Joi.string().allow(null, ""),

  numberOfEmployees: Joi.string().required(),
  ownPotatoFarming: Joi.boolean().optional(),
  acres: Joi.number().allow(null).optional(),
  yearlyPurchaseVolumeTons: Joi.number().required(),
  mainProcurementRegion: Joi.string().required(),
  geographicalMarketCovered: Joi.string().required(),

  contractFarming: Joi.boolean().optional().allow(null),
  spotBuying: Joi.boolean().optional().allow(null),
  seedsSales: Joi.boolean().optional().allow(null),
  ownColdStorage: Joi.boolean().optional().allow(null),
  yearsInTrading: Joi.string().required(),
  averageDailySalesKatta: Joi.number().required(),
  salesOwnPotatoes: Joi.boolean().optional().allow(null),
  onlineAuctionInterest: Joi.boolean().optional().allow(null),
  bankLoanFacility: Joi.boolean().optional().allow(null),
  coldStorageAccess: Joi.boolean().optional().allow(null),
  acceptsOnlinePayments: Joi.boolean().optional().allow(null),

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

  marketCoverages: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
      })
    )
    .optional(),

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
    shopNumber: Joi.string().optional().allow(null,""),
  }).required(),

  traderDocuments: Joi.object({
    panCardUrl: Joi.string().uri().optional().allow(null, ""),
    businessCardUrl: Joi.string().uri().optional().allow(null, ""),
    tradeLicenseUrl: Joi.string().uri().optional().allow(null, ""),
    recentInvoiceUrl: Joi.string().uri().optional().allow(null, ""),
  }).optional(),
});

export const updateTraderSchema = Joi.object({
  fullName: Joi.string().optional().allow(null,""),
  businessName: Joi.string().optional().allow(null,""),
  mobileNumber: Joi.string().max(15).optional().allow(null,""),
  whatsappNumber: Joi.string().max(15).allow(null, ""),
  email: Joi.string().email().allow(null, ""),

  state: Joi.string().optional().allow(null, ""),
  district: Joi.string().optional().allow(null, ""),
  cityOrVillage: Joi.string().optional().allow(null, ""),
  pinCode: Joi.string().max(10).optional().allow(null, ""),
  digiPin: Joi.string().optional().allow(null, ""),
  geoLocation: Joi.string().optional().allow(null, ""),
  languagePreference: Joi.string().optional().allow(null, ""),

  companyRegisteredVendor: Joi.boolean().optional().allow(null),
  mainCompany: Joi.string().allow(null, ""),

  numberOfEmployees: Joi.string().optional().allow(null, ""),
  ownPotatoFarming: Joi.boolean().optional().allow(null),
  acres: Joi.number().allow(null).optional().allow(null),
  yearlyPurchaseVolumeTons: Joi.number().optional().allow(null),
  mainProcurementRegion: Joi.string().optional().allow(null, ""),
  geographicalMarketCovered: Joi.string().optional().allow(null, ""),

  contractFarming: Joi.boolean().optional().allow(null),
  spotBuying: Joi.boolean().optional().allow(null),
  seedsSales: Joi.boolean().optional().allow(null),
  ownColdStorage: Joi.boolean().optional().allow(null),
  yearsInTrading: Joi.string().optional().allow(null,""),
  averageDailySalesKatta: Joi.number().optional().allow(null),
  salesOwnPotatoes: Joi.boolean().optional().allow(null),
  onlineAuctionInterest: Joi.boolean().optional().allow(null),
  bankLoanFacility: Joi.boolean().optional().allow(null),
  coldStorageAccess: Joi.boolean().optional().allow(null),
  acceptsOnlinePayments: Joi.boolean().optional().allow(null),

  // panNumber: Joi.string().length(10).optional(),
  // gstNumber: Joi.string().max(30).allow(null, ""),
  // fssaiNumber: Joi.string().max(50).allow(null, ""),

  // arrays of objects
  traderInterests: Joi.array()
    .items(
      Joi.object({
        interest: Joi.string().required(),
      })
    )
    .optional(),

  traderTypes: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().required(),
      })
    )
    .optional(),

  traderVarieties: Joi.array()
    .items(
      Joi.object({
        variety: Joi.string().required(),
      })
    )
    .optional(),

  cropsTraded: Joi.array()
    .items(
      Joi.object({
        cropName: Joi.string().required(),
      })
    )
    .optional(),

  marketCoverages: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
      })
    )
    .optional(),

  // bankDetails: Joi.object({
  //   bankName: Joi.string().required(),
  //   accountHolderName: Joi.string().required(),
  //   accountNumber: Joi.string().required(),
  //   ifscCode: Joi.string().required(),
  //   branch: Joi.string().required(),
  // }).required(),

  mandiDetails: Joi.object({
    mandiName: Joi.string().optional().allow(null, ""),
    state: Joi.string().optional().allow(null, ""),
    cityOrVillage: Joi.string().optional().allow(null, ""),
    shopNumber: Joi.string().optional().allow(null, ""),
  }).optional(),

  traderDocuments: Joi.object({
    panCardUrl: Joi.string().uri().optional().allow(null, ""),
    businessCardUrl: Joi.string().uri().optional().allow(null, ""),
    tradeLicenseUrl: Joi.string().uri().optional().allow(null, ""),
    recentInvoiceUrl: Joi.string().uri().optional().allow(null, ""),
  }).optional(),
});
