import Joi from "joi";

export const onboardTraderSchema = Joi.object({
  fullName: Joi.string().max(255).optional(),
  firstName: Joi.string().max(255).required(),
  lastName: Joi.string().max(255).required(),
  businessName: Joi.string().max(255).required(),
  businessAddress: Joi.string().max(255).optional().allow(null, ""),
  mobileNumber: Joi.string().max(15).required(),
  whatsappNumber: Joi.string().max(255).max(15).allow(null, ""),
  email: Joi.string().max(255).email().allow(null, ""),

  state: Joi.string().max(255).required(),
  district: Joi.string().max(255).required(),
  cityOrVillage: Joi.string().max(255).required(),
  taluka: Joi.string().max(255).optional().allow(null, ""),
  pinCode: Joi.string().max(255).max(10).required(),
  digiPin: Joi.string().max(255).optional().allow(null, ""),
  geoLocation: Joi.string().max(255).optional().allow(null, ""),
  languagePreference: Joi.string().max(255).optional().allow(null, ""),

  companyRegisteredVendor: Joi.boolean().optional(),
  mainCompany: Joi.string().max(255).allow(null, ""),

  numberOfEmployees: Joi.string().max(255).required(),
  ownPotatoFarming: Joi.boolean().optional(),
  acres: Joi.number().allow(null).optional(),
  yearlyPurchaseVolumeTons: Joi.number().required(),
  mainProcurementRegion: Joi.string().required(),
  geographicalMarketCovered: Joi.string().optional().allow(null, ""),

  contractFarming: Joi.boolean().optional().allow(null),
  spotBuying: Joi.boolean().optional().allow(null),
  seedsSales: Joi.boolean().optional().allow(null),
  ownColdStorage: Joi.boolean().optional().allow(null),
  yearsInTrading: Joi.string().max(255).required(),
  averageDailySalesKatta: Joi.number().required(),
  salesOwnPotatoes: Joi.boolean().optional().allow(null),
  onlineAuctionInterest: Joi.boolean().optional().allow(null),
  bankLoanFacility: Joi.boolean().optional().allow(null),
  coldStorageAccess: Joi.boolean().optional().allow(null),
  acceptsOnlinePayments: Joi.boolean().optional().allow(null),
  subVariety: Joi.array().items(Joi.string().max(255)).optional(),
  // panNumber: Joi.string().length(10).required(),
  // gstNumber: Joi.string().max(30).allow(null, ""),
  // fssaiNumber: Joi.string().max(50).allow(null, ""),

  userId: Joi.number().required(),

  // arrays of objects
  traderInterests: Joi.array()
    .items(
      Joi.object({
        interest: Joi.string().max(255).required(),
      })
    )
    .min(1)
    .required(),

  traderTypes: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().max(255).required(),
      })
    )
    .min(1)
    .required(),

  traderVarieties: Joi.array()
    .items(
      Joi.object({
        variety: Joi.string().max(255).required(),
      })
    )
    .min(1)
    .required(),

  cropsTraded: Joi.array()
    .items(
      Joi.object({
        cropName: Joi.string().max(255).required(),
      })
    )
    .min(1)
    .required(),

  marketCoverages: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(255).required(),
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
    mandiName: Joi.string().max(100).required(),
    state: Joi.string().max(100).required(),
    district: Joi.string().max(255).required(),
    cityOrVillage: Joi.string().max(100).required(),
    shopNumber: Joi.string().max(50).optional().allow(null, ""),
    mandiLicenceNo: Joi.string().max(255).required(),
  }).required(),

  traderDocuments: Joi.object({
    panCardUrl: Joi.string().max(255).uri().optional().allow(null, ""),
    businessCardUrl: Joi.string().max(255).uri().optional().allow(null, ""),
    tradeLicenseUrl: Joi.string().max(255).uri().optional().allow(null, ""),
    recentInvoiceUrl: Joi.string().max(255).uri().optional().allow(null, ""),
  }).optional(),
});

export const updateTraderSchema = Joi.object({
  fullName: Joi.string().max(255).optional().allow(null, ""),
  firstName: Joi.string().max(255).optional().allow(null, ""),
  lastName: Joi.string().max(255).optional().allow(null, ""),
  businessName: Joi.string().max(255).optional().allow(null, ""),
  businessAddress: Joi.string().max(255).optional().allow(null, ""),
  mobileNumber: Joi.string().max(15).optional().allow(null, ""),
  whatsappNumber: Joi.string().max(255).max(15).allow(null, ""),
  email: Joi.string().max(255).email().allow(null, ""),

  state: Joi.string().max(255).optional().allow(null, ""),
  district: Joi.string().max(255).optional().allow(null, ""),
  taluka: Joi.string().max(255).optional().allow(null, ""),
  cityOrVillage: Joi.string().max(255).optional().allow(null, ""),
  pinCode: Joi.string().max(255).max(10).optional().allow(null, ""),
  digiPin: Joi.string().max(255).optional().allow(null, ""),
  geoLocation: Joi.string().max(255).optional().allow(null, ""),
  languagePreference: Joi.string().max(255).optional().allow(null, ""),

  companyRegisteredVendor: Joi.boolean().optional().allow(null),
  mainCompany: Joi.string().max(255).allow(null, ""),

  numberOfEmployees: Joi.string().max(255).optional().allow(null, ""),
  ownPotatoFarming: Joi.boolean().optional().allow(null),
  acres: Joi.number().optional().allow(null),
  yearlyPurchaseVolumeTons: Joi.number().optional().allow(null),
  mainProcurementRegion: Joi.string().optional().allow(null, ""),
  geographicalMarketCovered: Joi.string().optional().allow(null, ""),

  contractFarming: Joi.boolean().optional().allow(null),
  spotBuying: Joi.boolean().optional().allow(null),
  seedsSales: Joi.boolean().optional().allow(null),
  ownColdStorage: Joi.boolean().optional().allow(null),
  yearsInTrading: Joi.string().max(255).optional().allow(null, ""),
  averageDailySalesKatta: Joi.number().optional().allow(null),
  salesOwnPotatoes: Joi.boolean().optional().allow(null),
  onlineAuctionInterest: Joi.boolean().optional().allow(null),
  bankLoanFacility: Joi.boolean().optional().allow(null),
  coldStorageAccess: Joi.boolean().optional().allow(null),
  acceptsOnlinePayments: Joi.boolean().optional().allow(null),
  subVariety: Joi.array().items(Joi.string().max(255)).optional(),
  // panNumber: Joi.string().length(10).optional(),
  // gstNumber: Joi.string().max(30).allow(null, ""),
  // fssaiNumber: Joi.string().max(50).allow(null, ""),

  // arrays of objects
  traderInterests: Joi.array()
    .items(
      Joi.object({
        interest: Joi.string().max(255).required(),
      })
    )
    .optional(),

  traderTypes: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().max(255).required(),
      })
    )
    .optional(),

  traderVarieties: Joi.array()
    .items(
      Joi.object({
        variety: Joi.string().max(255).required(),
      })
    )
    .optional(),

  cropsTraded: Joi.array()
    .items(
      Joi.object({
        cropName: Joi.string().max(255).required(),
      })
    )
    .optional(),

  marketCoverages: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(255).required(),
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
    mandiName: Joi.string().max(100).optional().allow(null, ""),
    state: Joi.string().max(100).optional().allow(null, ""),
    district: Joi.string().max(255).optional().allow(null, ""),
    cityOrVillage: Joi.string().max(100).optional().allow(null, ""),
    shopNumber: Joi.string().max(50).optional().allow(null, ""),
    mandiLicenceNo: Joi.string().max(255).optional().allow(null, ""),
  }).optional(),

  traderDocuments: Joi.object({
    panCardUrl: Joi.string().max(255).uri().optional().allow(null, ""),
    businessCardUrl: Joi.string().max(255).uri().optional().allow(null, ""),
    tradeLicenseUrl: Joi.string().max(255).uri().optional().allow(null, ""),
    recentInvoiceUrl: Joi.string().max(255).uri().optional().allow(null, ""),
  }).optional(),
});
