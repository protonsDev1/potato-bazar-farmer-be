import Joi from 'joi';

export const onboardFarmerSchema = Joi.object({
  name: Joi.string().required(),
  userId: Joi.number().required(),
  age: Joi.number().integer().min(1).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  optionalNumber: Joi.string().optional().allow(null, ''),
  caste: Joi.string().optional().allow(null, ''),
  subCaste: Joi.string().optional().allow(null, ''),
  village: Joi.string().optional().allow(null, ''),
  taluka: Joi.string().optional().allow(null, ''),
  district: Joi.string().optional().allow(null, ''),
  state: Joi.string().optional().allow(null, ''),
  getLocation: Joi.string().optional(),
  isAadhaarCard: Joi.boolean().optional(),
  aadhaarNumber: Joi.string()
    .pattern(/^\d{12}$/)
    .when('isAadhaarCard', { is: true, then: Joi.required(), otherwise: Joi.optional().allow(null, '') }),
  isBankAccount: Joi.boolean().optional(),

  landDetails: Joi.array()
    .items(
      Joi.object({
        landOwnedAcres: Joi.number().required(),
        landLeasedAcres: Joi.number().required(),
        potatoCultivationAcres: Joi.number().optional(),
        irrigationEquipmentBrand: Joi.string().optional().allow(null, ''),
        soilType: Joi.string().optional().allow(null, ''),
        averageYieldPerAcre: Joi.number().optional(),
        sowingMonth: Joi.string().optional().allow(null, ''),
        sowingMethod: Joi.string().optional().allow(null, ''),
        storageFacilityAtFarm: Joi.boolean().optional(),
        primarySalesPoint: Joi.string().optional().allow(null, ''),
        distanceToNearestMandi: Joi.string().optional().allow(null, ''),
        isGradingMachineAtFarm: Joi.boolean().optional(),
        isShadeAtFarmGate: Joi.boolean().optional(),
        isUnderContractFarming: Joi.boolean().optional(),
        contractPercent: Joi.number().optional(),
        spotPercent: Joi.number().optional(),
        contractPartnerName: Joi.string().optional().allow(null, ''),
        newSeedsPurchasedAnnually: Joi.boolean().optional(),
        reusedSeedsPercent: Joi.number().optional(),
        trustedSeedCompany: Joi.string().optional().allow(null, ''),
        reasonForTrust: Joi.string().optional().allow(null, ''),
        preference: Joi.string().optional().allow(null, ''),
        contractFarmingPercent: Joi.number().optional(),
        soldInSpotMarketPercent: Joi.number().optional(),
        interestedInDigitalTrading: Joi.boolean().optional(),
        usesWhatsappForBusiness: Joi.boolean().optional(),
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

  // onBoardedBy: Joi.string().uuid().optional(),
  onBoardedBy: Joi.number().optional(),
});
