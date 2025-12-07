import Joi from "joi";

export const onboardDirectorySchema = Joi.object({
  companyName: Joi.string().max(255).required(),
  logo: Joi.string().uri().optional().allow(null, ""),
  companyType: Joi.string().max(255).optional().allow(null, ""),
  companyTagline: Joi.string().max(255).optional().allow(null, ""),
  contactPersonName: Joi.string().max(255).optional().allow(null, ""),
  email: Joi.string().max(255).email().optional().allow(null, ""),
  phoneNumber: Joi.string().max(15).optional().allow(null, ""),
  whatsAppNumber: Joi.string().max(15).optional().allow(null, ""),
  address: Joi.string().max(255).optional().allow(null, ""),
  website: Joi.string().max(255).uri().optional().allow(null, ""),
  city: Joi.string().max(255).optional().allow(null, ""),
  state: Joi.string().max(255).optional().allow(null, ""),
  isGlobal: Joi.boolean().optional().default(false),
  pinCode: Joi.string().max(10).optional().allow(null, ""),
  location: Joi.string().max(255).optional().allow(null, ""),

  companyShortDescription: Joi.string().max(255).optional().allow(null, ""),
  companyProfile: Joi.string().optional().allow(null, ""),
  yearEstablished: Joi.string().max(10).optional().allow(null, ""),
  numberOfEmployees: Joi.string().max(255).optional().allow(null, ""),
  annualRevenue: Joi.string().max(255).optional().allow(null, ""),
  keyCapabilities: Joi.string().optional().allow(null, ""),
  industriesServed: Joi.array()
    .items(Joi.string().max(255))
    .optional()
    .allow(null),

  products: Joi.array().items(Joi.string().max(255)).optional().allow(null),
  productDescription: Joi.string().optional().allow(null, ""),
  applicationAreas: Joi.string().optional().allow(null, ""),
  tags: Joi.array().items(Joi.string().max(255)).optional().allow(null),

  subsidiaries: Joi.string().optional().allow(null, ""),
  technologyBrands: Joi.string().optional().allow(null, ""),
  associations: Joi.string().optional().allow(null, ""),
  strategicPartnerships: Joi.string().optional().allow(null, ""),
  certifications: Joi.string().optional().allow(null, ""),

  status: Joi.string().optional().allow(null, ""),
  isActive: Joi.boolean().optional(),

  userId: Joi.number().optional().allow(null, ""),
  onBoardedBy: Joi.number().optional().allow(null),

  socialMedia: Joi.object({
    linkedInUrl: Joi.string().uri().optional().allow(null, ""),
    facebookUrl: Joi.string().uri().optional().allow(null, ""),
    twitterUrl: Joi.string().uri().optional().allow(null, ""),
    youtubeUrl: Joi.string().uri().optional().allow(null, ""),
  }).optional(),

  media: Joi.object({
    images: Joi.array().items(Joi.string().uri()).optional(),
    videos: Joi.array().items(Joi.string().uri()).optional(),
    brochures: Joi.array().items(Joi.string().uri()).optional(),
    news: Joi.string().optional().allow(null, ""),
    events: Joi.string().optional().allow(null, ""),
  }).optional(),

  subCategoryIds: Joi.array()
    .items(Joi.number().integer().positive())
    .required(),
  planId: Joi.number().integer().positive().optional(),
  planStartDate: Joi.date().iso().optional().allow(null),
  planEndDate: Joi.date().iso().optional().allow(null),
});

export const updateDirectorySchema = Joi.object({
  companyName: Joi.string().max(255).optional().allow(null, ""),
  logo: Joi.string().uri().optional().allow(null, ""),
  companyType: Joi.string().max(255).optional().allow(null, ""),
  companyTagline: Joi.string().max(255).optional().allow(null, ""),
  contactPersonName: Joi.string().max(255).optional().allow(null, ""),
  email: Joi.string().max(255).email().optional().allow(null, ""),
  phoneNumber: Joi.string().max(15).optional().allow(null, ""),
  whatsAppNumber: Joi.string().max(15).optional().allow(null, ""),
  address: Joi.string().max(255).optional().allow(null, ""),
  website: Joi.string().max(255).uri().optional().allow(null, ""),
  city: Joi.string().max(255).optional().allow(null, ""),
  state: Joi.string().max(255).optional().allow(null, ""),
  isGlobal: Joi.boolean().optional(),
  pinCode: Joi.string().max(10).optional().allow(null, ""),
  location: Joi.string().max(255).optional().allow(null, ""),

  companyShortDescription: Joi.string().max(255).optional().allow(null, ""),
  companyProfile: Joi.string().optional().allow(null, ""),
  yearEstablished: Joi.string().max(10).optional().allow(null, ""),
  numberOfEmployees: Joi.string().max(255).optional().allow(null, ""),
  annualRevenue: Joi.string().max(255).optional().allow(null, ""),
  keyCapabilities: Joi.string().optional().allow(null, ""),
  industriesServed: Joi.array()
    .items(Joi.string().max(255))
    .optional()
    .allow(null),

  products: Joi.array().items(Joi.string().max(255)).optional().allow(null),
  productDescription: Joi.string().optional().allow(null, ""),
  applicationAreas: Joi.string().optional().allow(null, ""),
  tags: Joi.array().items(Joi.string().max(255)).optional().allow(null),

  subsidiaries: Joi.string().optional().allow(null, ""),
  technologyBrands: Joi.string().optional().allow(null, ""),
  associations: Joi.string().optional().allow(null, ""),
  strategicPartnerships: Joi.string().optional().allow(null, ""),
  certifications: Joi.string().optional().allow(null, ""),

  status: Joi.string().optional().allow(null, ""),
  isActive: Joi.boolean().optional(),

  socialMedia: Joi.object({
    linkedInUrl: Joi.string().uri().optional().allow(null, ""),
    facebookUrl: Joi.string().uri().optional().allow(null, ""),
    twitterUrl: Joi.string().uri().optional().allow(null, ""),
    youtubeUrl: Joi.string().uri().optional().allow(null, ""),
  }).optional(),

  media: Joi.object({
    images: Joi.array().items(Joi.string().uri()).optional(),
    videos: Joi.array().items(Joi.string().uri()).optional(),
    brochures: Joi.array().items(Joi.string().uri()).optional(),
    news: Joi.string().optional().allow(null, ""),
    events: Joi.string().optional().allow(null, ""),
  }).optional(),

  subCategoryIds: Joi.array()
    .items(Joi.number().integer().positive())
    .optional(),

  planId: Joi.number().integer().positive().optional(),
  planStartDate: Joi.date().iso().optional().allow(null),
  planEndDate: Joi.date().iso().optional().allow(null),
});

export const directoryCategorySchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.number().optional(),
  image: Joi.string().uri().optional(),
  isActive: Joi.boolean().optional(),
});

export const directorySubCategorySchema = Joi.object({
  name: Joi.string().required(),
  categoryId: Joi.number().required(),
  position: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

export const updateDirectoryStatusSchema = Joi.object({
  status: Joi.string().valid("approved", "rejected").required(),
  reason: Joi.when("status", {
    is: "rejected",
    then: Joi.string().trim().required(),
    otherwise: Joi.string().optional().allow(null, ""),
  }),
});
