import Joi from 'joi';


export const onboardFarmerSchema = Joi.object({
  name: Joi.string().required(),
  userId:Joi.number().required(),
  age: Joi.number().integer().min(1).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  optionalNumber: Joi.string().optional().allow(null, ''),
  caste: Joi.string().optional().allow(null, ''),
  subCaste: Joi.string().optional().allow(null, ''),
  village: Joi.string().optional().allow(null, ''),
  taluka: Joi.string().optional().allow(null, ''),
  district: Joi.string().optional().allow(null, ''),
  state: Joi.string().optional().allow(null, ''),
  getLocation: Joi.string().optional().allow(null, ''),
  isAadhaarCard: Joi.boolean().optional(),
  aadhaarNumber: Joi.string()
    .pattern(/^\d{12}$/)
    .when('isAadhaarCard', { is: true, then: Joi.required(), otherwise: Joi.optional().allow(null, '') }),
  isBankAccount: Joi.boolean().optional(),

  landDetails: Joi.array()
    .items(
      Joi.object({
        // define the fields inside landDetails as per your model (example below)
        landType: Joi.string().required(),
        landArea: Joi.number().required(),
        irrigationFacility: Joi.boolean().optional(),
      })
    )
    .optional(),

  irrigationSources: Joi.array()
    .items(
      Joi.object({
        method: Joi.string().required(),
      })
    )
    .optional(),

  potatoVarieties: Joi.array()
    .items(
      Joi.object({
        variety: Joi.string().required(),
        subVariety: Joi.string().optional().allow(null, ''),
      })
    )
    .optional(),

  farmEquipment: Joi.array()
    .items(
      Joi.object({
        machine: Joi.string().required(),
        brand: Joi.string().optional().allow(null, ''),
        model: Joi.string().optional().allow(null, ''),
      })
    )
    .optional(),

  technologyUsed: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
      })
    )
    .optional(),

  sellingChannels: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
      })
    )
    .optional(),

  sellingChallenges: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
      })
    )
    .optional(),

  majorSellingChallenges: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
      })
    )
    .optional(),

  priceDiscoveryMethods: Joi.array()
    .items(
      Joi.object({
        method: Joi.string().required(),
      })
    )
    .optional(),

  onBoardedBy: Joi.number().integer().optional(),
});

