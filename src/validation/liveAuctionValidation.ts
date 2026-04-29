import Joi from "joi";

export const createLiveAuctionSchema = Joi.object({
  // 🔹 Basic Info
  potatoType: Joi.string().required(),
  potatoVariety: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().required(),

  minReservePrice: Joi.number().min(0).optional(),
  qualityGrade: Joi.string().optional().allow(null, ""),

  // 🔹 Specifications
  packagingType: Joi.string().optional().allow(null, ""),
  delivery: Joi.string().optional().allow(null, ""),
  size: Joi.string().optional().allow(null, ""),
  sugarContent: Joi.string().optional().allow(null, ""),
  skinSet: Joi.string().optional().allow(null, ""),
  fleshColor: Joi.string().optional().allow(null, ""),

  // 🔹 Other Info
  shape: Joi.string().optional().allow(null, ""),
  skinColor: Joi.string().optional().allow(null, ""),
  tuberSize: Joi.string().optional().allow(null, ""),
  dryMatter: Joi.string().optional().allow(null, ""),
  healthCondition: Joi.string().optional().allow(null, ""),
  additionalComment: Joi.string().optional().allow(null, ""),
  storageTemperature: Joi.string().optional().allow(null, ""),
  brand: Joi.string().optional().allow(null, ""),
  generation: Joi.string().optional().allow(null, ""),
  treatmentStatus: Joi.string().optional().allow(null, ""),
  seedSourceType: Joi.string().optional().allow(null, ""),
  sproutingCondition: Joi.string().optional().allow(null, ""),
  physicalCondition: Joi.string().optional().allow(null, ""),
  roguingStatus: Joi.string().optional().allow(null, ""),
  productionMethod: Joi.string().optional().allow(null, ""),
  reason: Joi.string().optional().allow(null, ""),
  shapeType: Joi.string().optional().allow(null, ""),
  perTubeWeight: Joi.string().optional().allow(null),

  tpod: Joi.number().optional().allow(null),
  uc: Joi.number().optional().allow(null),

  productionDate: Joi.date().optional().allow(null),

  diseaseFreeCertified: Joi.boolean().optional(),
  soilAdherence: Joi.string().optional().allow(null, ""),
  firmness: Joi.string().optional().allow(null, ""),
  sproutingStatus: Joi.string().optional().allow(null, ""),
  organicCertified: Joi.boolean().optional(),

  harvestDate: Joi.date().optional().allow(null),
  deliveryWindow: Joi.number().optional().allow(null),
  deliveryType: Joi.string().optional().allow(null, ""),
  qualityResponsibilty: Joi.string().optional().allow(null, ""),

  state: Joi.string().optional().allow(null, ""),
  district: Joi.string().optional().allow(null, ""),
  locationOrCity: Joi.string().optional().allow(null, ""),
  pinCode: Joi.string().optional().allow(null, ""),

  paymentTimeLine: Joi.number().optional().allow(null),

  // 🔹 Media
  fullLotView: Joi.string().uri().optional().allow(null, ""),
  closeQualityView: Joi.string().uri().optional().allow(null, ""),
  randomSampleView: Joi.string().uri().optional().allow(null, ""),
  storageView: Joi.string().uri().optional().allow(null, ""),

  defectPhotos: Joi.array().items(Joi.string().uri()).optional(),
  lotOverviewVideos: Joi.array().items(Joi.string().uri()).optional(),

  attachment: Joi.string().uri().optional().allow(null, ""),

  // 🔹 Auction Schedule (IMPORTANT)
  auctionDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/) // YYYY-MM-DD
    .required()
    .messages({
      "string.pattern.base": "auctionDate must be in YYYY-MM-DD format",
    }),

  auctionTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/) // HH:mm or HH:mm:ss
    .required()
    .messages({
      "string.pattern.base": "auctionTime must be in HH:mm or HH:mm:ss format",
    }),
});

export const updateLiveAuctionSchema = Joi.object({
  // 🔹 Basic Info
  potatoType: Joi.string().optional().allow(null, ""),
  potatoVariety: Joi.string().optional().allow(null, ""),
  quantity: Joi.number().positive().optional(),
  unit: Joi.string().optional().allow(null, ""),

  minReservePrice: Joi.number().min(0).optional().allow(null),
  qualityGrade: Joi.string().optional().allow(null, ""),

  // 🔹 Specifications
  packagingType: Joi.string().optional().allow(null, ""),
  delivery: Joi.string().optional().allow(null, ""),
  size: Joi.string().optional().allow(null, ""),
  sugarContent: Joi.string().optional().allow(null, ""),
  skinSet: Joi.string().optional().allow(null, ""),
  fleshColor: Joi.string().optional().allow(null, ""),

  // 🔹 Other Info
  shape: Joi.string().optional().allow(null, ""),
  skinColor: Joi.string().optional().allow(null, ""),
  tuberSize: Joi.string().optional().allow(null, ""),
  dryMatter: Joi.string().optional().allow(null, ""),
  healthCondition: Joi.string().optional().allow(null, ""),
  additionalComment: Joi.string().optional().allow(null, ""),
  storageTemperature: Joi.string().optional().allow(null, ""),
  brand: Joi.string().optional().allow(null, ""),
  generation: Joi.string().optional().allow(null, ""),
  treatmentStatus: Joi.string().optional().allow(null, ""),
  seedSourceType: Joi.string().optional().allow(null, ""),
  sproutingCondition: Joi.string().optional().allow(null, ""),
  physicalCondition: Joi.string().optional().allow(null, ""),
  roguingStatus: Joi.string().optional().allow(null, ""),
  productionMethod: Joi.string().optional().allow(null, ""),
  reason: Joi.string().optional().allow(null, ""),
  shapeType: Joi.string().optional().allow(null, ""),
  perTubeWeight: Joi.string().optional().allow(null),

  tpod: Joi.number().optional().allow(null),
  uc: Joi.number().optional().allow(null),

  productionDate: Joi.date().optional().allow(null),

  diseaseFreeCertified: Joi.boolean().optional(),
  soilAdherence: Joi.string().optional().allow(null, ""),
  firmness: Joi.string().optional().allow(null, ""),
  sproutingStatus: Joi.string().optional().allow(null, ""),
  organicCertified: Joi.boolean().optional(),

  harvestDate: Joi.date().optional().allow(null),
  deliveryWindow: Joi.number().optional().allow(null),
  deliveryType: Joi.string().optional().allow(null, ""),
  qualityResponsibilty: Joi.string().optional().allow(null, ""),

  state: Joi.string().optional().allow(null, ""),
  district: Joi.string().optional().allow(null, ""),
  locationOrCity: Joi.string().optional().allow(null, ""),
  pinCode: Joi.string().optional().allow(null, ""),

  paymentTimeLine: Joi.number().optional().allow(null),

  // 🔹 Media
  fullLotView: Joi.string().uri().optional().allow(null, ""),
  closeQualityView: Joi.string().uri().optional().allow(null, ""),
  randomSampleView: Joi.string().uri().optional().allow(null, ""),
  storageView: Joi.string().uri().optional().allow(null, ""),

  defectPhotos: Joi.array().items(Joi.string().uri()).optional(),
  lotOverviewVideos: Joi.array().items(Joi.string().uri()).optional(),

  attachment: Joi.string().uri().optional().allow(null, ""),

  // 🔹 Auction Schedule
  auctionDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .messages({
      "string.pattern.base": "auctionDate must be in YYYY-MM-DD format",
    }),

  auctionTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    .optional()
    .messages({
      "string.pattern.base": "auctionTime must be in HH:mm or HH:mm:ss format",
    }),

  // 🔹 Schedule (optional separate fields if used)
  scheduleDate: Joi.string().optional().allow(null, ""),
  scheduleTime: Joi.string().optional().allow(null, ""),

  // 🔹 Contact
  contactPerson: Joi.string().optional().allow(null, ""),
  contactNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .allow(null, ""),

  inspectionAddress: Joi.string().optional().allow(null, ""),
});
