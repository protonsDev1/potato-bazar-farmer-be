import Joi from "joi";

export const onboardTraderSchema = Joi.object({
  fullName: Joi.string().trim().max(255).optional(),
  firstName: Joi.string().trim().max(255).required(),
  lastName: Joi.string().trim().max(255).required(),
  businessName: Joi.string().max(255).required(),
  businessAddress: Joi.string().max(255).optional().allow(null, ""),
  mobileNumber: Joi.string().max(15).required(),
  whatsappNumber: Joi.string().max(15).allow(null, ""),
  email: Joi.string().max(255).email().allow(null, ""),

  state: Joi.string().max(255).required(),
  district: Joi.string().max(255).required(),
  cityOrVillage: Joi.string().max(255).required(),
  taluka: Joi.string().max(255).optional().allow(null, ""),
  pinCode: Joi.string().max(10).required(),
  digiPin: Joi.string().max(255).optional().allow(null, ""),
  geoLocation: Joi.string().max(255).optional().allow(null, ""),
  languagePreference: Joi.string().max(255).optional().allow(null, ""),

  companyRegisteredVendor: Joi.boolean().optional(),
  mainCompany: Joi.string().max(255).allow(null, ""),

  numberOfEmployees: Joi.string().max(255).required(),
  annualTurnover: Joi.string().max(255).optional().allow(null, ""),
  ownPotatoFarming: Joi.boolean().optional(),
  acres: Joi.number().min(0).max(1000000000).allow(null).optional(),
  yearlyPurchaseVolumeTons: Joi.number().min(0).max(1000000000).required(),
  geographicalMarketCovered: Joi.string().optional().allow(null, ""),

  contractFarming: Joi.boolean().optional().allow(null),
  spotBuying: Joi.boolean().optional().allow(null),
  seedsSales: Joi.boolean().optional().allow(null),
  ownColdStorage: Joi.boolean().optional().allow(null),
  yearsInTrading: Joi.string().max(255).required(),
  averageDailySalesKatta: Joi.number().min(0).max(1000000000).required(),
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

  procurementRegions: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(255).required(),
      })
    )
    .optional(),

  marketCoverageStates: Joi.array().items(Joi.string().max(255)).optional(),
  procurementRegionStates: Joi.array().items(Joi.string().max(255)).optional(),

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
  })
    .optional()
    .allow(null),

  exporterDetails: Joi.object({
    regions: Joi.array().items(Joi.string().max(255)).optional(),
    isCustomRegion: Joi.boolean().optional().allow(null),
    potatoVarieties: Joi.array().items(Joi.string().max(255)).optional(),
    isCustomPotatoVariety: Joi.boolean().optional().allow(null),
    quantityPerYear: Joi.string().max(255).optional().allow(null, ""),
  })
    .optional()
    .allow(null),

  traderDocuments: Joi.object({
    panCardUrl: Joi.string().max(255).uri().optional().allow(null, ""),
    gstUrl: Joi.string().max(255).uri().optional().allow(null, ""),
    fssairl: Joi.string().max(255).uri().optional().allow(null, ""),
    businessCardUrl: Joi.string().max(255).uri().optional().allow(null, ""),
    tradeLicenseUrl: Joi.string().max(255).uri().optional().allow(null, ""),
    recentInvoiceUrl: Joi.string().max(255).uri().optional().allow(null, ""),
  }).optional(),
});

export const updateTraderSchema = Joi.object({
  fullName: Joi.string().trim().max(255).optional().allow(null, ""),
  firstName: Joi.string().trim().max(255).optional().allow(null, ""),
  lastName: Joi.string().trim().max(255).optional().allow(null, ""),
  businessName: Joi.string().max(255).optional().allow(null, ""),
  businessAddress: Joi.string().max(255).optional().allow(null, ""),
  mobileNumber: Joi.string().max(15).optional().allow(null, ""),
  whatsappNumber: Joi.string().max(15).allow(null, ""),
  email: Joi.string().max(255).email().allow(null, ""),

  state: Joi.string().max(255).optional().allow(null, ""),
  district: Joi.string().max(255).optional().allow(null, ""),
  taluka: Joi.string().max(255).optional().allow(null, ""),
  cityOrVillage: Joi.string().max(255).optional().allow(null, ""),
  pinCode: Joi.string().max(10).optional().allow(null, ""),
  digiPin: Joi.string().max(255).optional().allow(null, ""),
  geoLocation: Joi.string().max(255).optional().allow(null, ""),
  languagePreference: Joi.string().max(255).optional().allow(null, ""),

  companyRegisteredVendor: Joi.boolean().optional().allow(null),
  mainCompany: Joi.string().max(255).allow(null, ""),

  numberOfEmployees: Joi.string().max(255).optional().allow(null, ""),
  annualTurnover: Joi.string().max(255).optional().allow(null, ""),
  ownPotatoFarming: Joi.boolean().optional().allow(null),
  acres: Joi.number().min(0).max(1000000000).optional().allow(null),
  yearlyPurchaseVolumeTons: Joi.number()
    .min(0)
    .max(1000000000)
    .optional()
    .allow(null),
  geographicalMarketCovered: Joi.string().optional().allow(null, ""),

  contractFarming: Joi.boolean().optional().allow(null),
  spotBuying: Joi.boolean().optional().allow(null),
  seedsSales: Joi.boolean().optional().allow(null),
  ownColdStorage: Joi.boolean().optional().allow(null),
  yearsInTrading: Joi.string().max(255).optional().allow(null, ""),
  averageDailySalesKatta: Joi.number()
    .min(0)
    .max(1000000000)
    .optional()
    .allow(null),
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

  procurementRegions: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(255).required(),
      })
    )
    .optional(),

  marketCoverageStates: Joi.array().items(Joi.string().max(255)).optional(),
  procurementRegionStates: Joi.array().items(Joi.string().max(255)).optional(),

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
  })
    .optional()
    .allow(null),

  exporterDetails: Joi.object({
    regions: Joi.array().items(Joi.string().max(255)).optional(),
    isCustomRegion: Joi.boolean().optional().allow(null),
    potatoVarieties: Joi.array().items(Joi.string().max(255)).optional(),
    isCustomPotatoVariety: Joi.boolean().optional().allow(null),
    quantityPerYear: Joi.string().max(255).optional().allow(null, ""),
  })
    .optional()
    .allow(null),

  traderDocuments: Joi.object({
    panCardUrl: Joi.string().max(255).uri().optional().allow(null, ""),
    gstUrl: Joi.string().max(255).uri().optional().allow(null, ""),
    fssairl: Joi.string().max(255).uri().optional().allow(null, ""),
    businessCardUrl: Joi.string().max(255).uri().optional().allow(null, ""),
    tradeLicenseUrl: Joi.string().max(255).uri().optional().allow(null, ""),
    recentInvoiceUrl: Joi.string().max(255).uri().optional().allow(null, ""),
  }).optional(),
});
