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
  geoLocation: Joi.string().optional(),
  digiPin: Joi.string().optional().allow(null, ''),
  whatsappNumber: Joi.string().optional().allow(null, ''),
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
        totalLandUnderCultivation: Joi.number().optional(),
        landForPotatoFarming: Joi.number().optional(),
        areaUnderDrip: Joi.number().optional(),
        storageCapacityAtFarm: Joi.number().optional(),
        irrigationEquipmentModel: Joi.string().optional(),
        irrigationEquipmentBrand: Joi.string().optional().allow(null, ''),
        seedProcurementType: Joi.string().valid('new', 'reused', 'both').optional(),
        newSeedPercent: Joi.number().min(0).max(100)
          .when('seedProcurementType', {
            is: 'both',
            then: Joi.required(),
            otherwise: Joi.forbidden()
          }),

        reusedSeedPercent: Joi.number().min(0).max(100)
          .when('seedProcurementType', {
            is: 'both',
            then: Joi.required(),
            otherwise: Joi.forbidden()
          }),
        seedBrandName: Joi.string().optional().allow(null, ''),
        soilType: Joi.string().optional().allow(null, ''),
        averageYieldPerAcre: Joi.number().optional(),
        sowingMonth: Joi.string().optional().allow(null, ''),
        harvestMonth: Joi.string().optional().allow(null, ''),
        sowingMethod: Joi.string().optional().allow(null, ''),
        storageFacilityAtFarm: Joi.boolean().optional(),
        equipmentSource: Joi.string().optional().allow(null, ''),
        primarySalesPoint: Joi.string().optional().allow(null, ''),
        distanceToNearestMandi: Joi.string().optional().allow(null, ''),
        isGradingMachineAtFarm: Joi.boolean().optional(),
        isShadeAtFarmGate: Joi.boolean().optional(),
        isUnderContractFarming: Joi.boolean().optional(),
        contractPercent: Joi.number().optional(),
        spotPercent: Joi.number().optional(),
        contractPartnerName: Joi.string().optional().allow(null, ''),
        reasonForTrust: Joi.string().optional().allow(null, ''),
        preference: Joi.string().optional().allow(null, ''),
        contractFarmingPercent: Joi.number().min(1).max(100).optional(),
        soldInSpotMarketPercent: Joi.number().min(0).max(100).optional(),
        storedInColdStoragePercent: Joi.number().min(0).max(100).optional(),
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


  irrigationMethods: Joi.array()
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

  brandPreferenceReasons: Joi.array()
    .items(
      Joi.object({
        reason: Joi.string().required(),
      })
    )
    .optional(),  

  sellingPrices: Joi.array()
    .items(
      Joi.object({
        price: Joi.string().required(),
      })
    )
    .optional(),  

  otherCropsGrown: Joi.array().items(
      Joi.object({
        cropName: Joi.string().required(),
        sowingMonth: Joi.string().required(),
        harvestingMonth: Joi.string().required(),
      })
    ).optional(),

  sellingPlaces: Joi.array()
    .items(
      Joi.object({
        place: Joi.string().required(),
      })
    )
    .optional(),  

  potatoTypes: Joi.array()
  .items(
    Joi.object({
      type: Joi.string().required(),
    })
  )
  .optional(),
});
