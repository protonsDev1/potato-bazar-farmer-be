import Joi from "joi";

export const onboardFarmerSchema = Joi.object({
  name: Joi.string().trim().max(255).optional(),
  firstName: Joi.string().trim().max(255).required(),
  lastName: Joi.string().trim().max(255).required(),
  userId: Joi.number().required(),
  age: Joi.number().integer().min(1).max(150).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  optionalNumber: Joi.string().max(255).optional().allow(null, ""),
  caste: Joi.string().max(255).optional().allow(null, ""),
  subCaste: Joi.string().max(255).optional().allow(null, ""),
  village: Joi.string().max(255).optional().allow(null, ""),
  taluka: Joi.string().max(255).optional().allow(null, ""),
  district: Joi.string().max(255).optional().allow(null, ""),
  state: Joi.string().max(255).optional().allow(null, ""),
  geoLocation: Joi.string().max(255).optional().allow(null, ""),
  pinCode: Joi.string().max(10).optional().allow(null, ""),
  digiPin: Joi.string().max(255).optional().allow(null, ""),
  whatsappNumber: Joi.string().max(15).optional().allow(null, ""),
  isAadhaarCard: Joi.boolean().optional().allow(null),
  aadhaarNumber: Joi.string()
    .max(255)
    .pattern(/^\d{12}$/)
    .optional()
    .allow(null, ""),
  isBankAccount: Joi.boolean().optional().allow(null),

  landDetails: Joi.array()
    .items(
      Joi.object({
        landOwnedAcres: Joi.number().min(0).max(1000000000).required(),
        landLeasedAcres: Joi.number().min(0).max(1000000000).required(),
        totalLandUnderCultivation: Joi.number()
          .min(0)
          .max(1000000000)
          .optional()
          .allow(null),
        landForPotatoFarming: Joi.number()
          .min(0)
          .max(1000000000)
          .optional()
          .allow(null),
        areaUnderDrip: Joi.number()
          .min(0)
          .max(1000000000)
          .optional()
          .allow(null),
        storageCapacityAtFarm: Joi.number()
          .min(0)
          .max(1000000000)
          .optional()
          .allow(null),
        irrigationEquipmentModel: Joi.string()
          .max(255)
          .optional()
          .allow(null, ""),
        irrigationEquipmentBrand: Joi.string()
          .max(255)
          .optional()
          .allow(null, ""),
        seedProcurementType: Joi.string()
          .valid("new", "reused", "both")
          .optional(),
        newSeedPercent: Joi.number()
          .min(0)
          .max(100)
          .when("seedProcurementType", {
            is: "both",
            then: Joi.required(),
            otherwise: Joi.optional().allow(null, ""),
          }),

        reusedSeedPercent: Joi.number()
          .min(0)
          .max(100)
          .when("seedProcurementType", {
            is: "both",
            then: Joi.required(),
            otherwise: Joi.optional().allow(null, ""),
          }),
        soilType: Joi.string().max(255).optional().allow(null, ""),
        averageYieldPerAcre: Joi.number()
          .min(0)
          .max(1000000000)
          .optional()
          .allow(null),
        sowingMonth: Joi.string().max(255).optional().allow(null, ""),
        harvestMonth: Joi.string().max(255).optional().allow(null, ""),
        sowingMethod: Joi.string().max(255).optional().allow(null, ""),
        seedBrandName: Joi.string().max(255).optional().allow(null, ""),
        storageFacilityAtFarm: Joi.boolean().optional().allow(null),
        equipmentSource: Joi.string().max(255).optional().allow(null, ""),
        primarySalesPoint: Joi.string().max(255).optional().allow(null, ""),
        distanceToNearestMandi: Joi.string()
          .max(255)
          .optional()
          .allow(null, ""),
        isGradingMachineAtFarm: Joi.boolean().optional().allow(null),
        isShadeAtFarmGate: Joi.boolean().optional().allow(null),
        isUnderContractFarming: Joi.boolean().optional().allow(null),
        contractPercent: Joi.number().min(0).max(100).optional().allow(null),
        spotPercent: Joi.number().min(0).max(100).optional().allow(null),
        contractPartnerName: Joi.string().max(255).optional().allow(null, ""),
        // reasonForTrust: Joi.string().optional().allow(null, ""),
        preference: Joi.string().optional().allow(null, ""),
        suggestions: Joi.string().optional().allow(null, ""),
        contractFarmingPercent: Joi.number()
          .min(1)
          .max(100)
          .optional()
          .allow(null),
        soldInSpotMarketPercent: Joi.number()
          .min(0)
          .max(100)
          .optional()
          .allow(null),
        storedInColdStoragePercent: Joi.number()
          .min(0)
          .max(100)
          .optional()
          .allow(null),
        interestedInDigitalTrading: Joi.boolean().optional().allow(null),
        usesWhatsappForBusiness: Joi.boolean().optional().allow(null),
      })
    )
    .optional(),

  irrigationSources: Joi.array()
    .items(
      Joi.object({
        method: Joi.string().max(255).required(),
      })
    )
    .optional(),

  irrigationMethods: Joi.array()
    .items(
      Joi.object({
        method: Joi.string().max(255).required(),
      })
    )
    .optional(),

  potatoVarieties: Joi.array()
    .items(
      Joi.object({
        variety: Joi.string().max(255).required(),
        subVariety: Joi.string().max(255).optional().allow(null, ""),
        isCustom: Joi.boolean().optional().allow(null, ""),
      })
    )
    .optional(),

  farmEquipment: Joi.array()
    .items(
      Joi.object({
        machine: Joi.string().max(255).required(),
        brand: Joi.string().max(255).optional().allow(null, ""),
        model: Joi.string().max(255).optional().allow(null, ""),
      })
    )
    .optional(),

  technologyUsed: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(255).required(),
      })
    )
    .optional(),

  sellingChannels: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(255).required(),
      })
    )
    .optional(),

  sellingChallenges: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(255).required(),
      })
    )
    .optional(),

  majorSellingChallenges: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(255).required(),
      })
    )
    .optional(),

  priceDiscoveryMethods: Joi.array()
    .items(
      Joi.object({
        method: Joi.string().max(255).required(),
      })
    )
    .optional(),

  brandPreferenceReasons: Joi.array()
    .items(
      Joi.object({
        reason: Joi.string().max(255).required(),
      })
    )
    .optional(),

  sellingPrices: Joi.array()
    .items(
      Joi.object({
        price: Joi.string().max(255).required(),
      })
    )
    .optional(),

  otherCropsGrown: Joi.array()
    .items(
      Joi.object({
        cropName: Joi.string().max(255).optional().allow(null, ""),
        sowingMonth: Joi.string().max(255).optional().allow(null, ""),
        harvestingMonth: Joi.string().max(255).optional().allow(null, ""),
      })
    )
    .optional(),

  sellingPlaces: Joi.array()
    .items(
      Joi.object({
        place: Joi.string().max(255).required(),
      })
    )
    .optional(),

  potatoTypes: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().max(255).required(),
      })
    )
    .optional(),

  seedBrandName: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(255).required(),
        isCustom: Joi.boolean().optional().allow(null, ""),
      })
    )
    .optional(),
});

export const updateFarmerSchema = Joi.object({
  name: Joi.string().trim().max(255).optional().allow(null, ""),
  firstName: Joi.string().trim().max(255).optional().allow(null, ""),
  lastName: Joi.string().trim().max(255).optional().allow(null, ""),
  age: Joi.number().integer().min(1).max(150).optional().allow(null),
  gender: Joi.string().max(255).valid("male", "female", "other").optional(),
  optionalNumber: Joi.string().max(255).optional().allow(null, ""),
  caste: Joi.string().max(255).optional().allow(null, ""),
  subCaste: Joi.string().max(255).optional().allow(null, ""),
  village: Joi.string().max(255).optional().allow(null, ""),
  taluka: Joi.string().max(255).optional().allow(null, ""),
  district: Joi.string().max(255).optional().allow(null, ""),
  state: Joi.string().max(255).optional().allow(null, ""),
  geoLocation: Joi.string().max(255).optional().allow(null, ""),
  pinCode: Joi.string().max(10).optional().allow(null, ""),
  digiPin: Joi.string().max(255).optional().allow(null, ""),
  whatsappNumber: Joi.string().max(15).optional().allow(null, ""),
  isAadhaarCard: Joi.boolean().optional().allow(null),
  aadhaarNumber: Joi.string()
    .max(255)
    .pattern(/^\d{12}$/)
    .optional()
    .allow(null, ""),
  isBankAccount: Joi.boolean().optional().allow(null),

  landDetails: Joi.array()
    .items(
      Joi.object({
        landOwnedAcres: Joi.number()
          .min(0)
          .max(1000000000)
          .optional()
          .allow(null),
        landLeasedAcres: Joi.number()
          .min(0)
          .max(1000000000)
          .optional()
          .allow(null),
        totalLandUnderCultivation: Joi.number()
          .min(0)
          .max(1000000000)
          .optional()
          .allow(null),
        landForPotatoFarming: Joi.number()
          .min(0)
          .max(1000000000)
          .optional()
          .allow(null),
        areaUnderDrip: Joi.number()
          .min(0)
          .max(1000000000)
          .optional()
          .allow(null),
        storageCapacityAtFarm: Joi.number()
          .min(0)
          .max(1000000000)
          .optional()
          .allow(null),
        irrigationEquipmentModel: Joi.string()
          .max(255)
          .optional()
          .allow(null, ""),
        irrigationEquipmentBrand: Joi.string()
          .max(255)
          .optional()
          .allow(null, ""),
        seedProcurementType: Joi.string()
          .valid("new", "reused", "both")
          .optional(),
        newSeedPercent: Joi.number()
          .min(0)
          .max(100)
          .when("seedProcurementType", {
            is: "both",
            then: Joi.required(),
            otherwise: Joi.optional().allow(null, ""),
          }),
        reusedSeedPercent: Joi.number()
          .min(0)
          .max(100)
          .when("seedProcurementType", {
            is: "both",
            then: Joi.required(),
            otherwise: Joi.optional().allow(null, ""),
          }),
        soilType: Joi.string().max(255).optional().allow(null, ""),
        averageYieldPerAcre: Joi.number().optional().allow(null),
        sowingMonth: Joi.string().max(255).optional().allow(null, ""),
        harvestMonth: Joi.string().max(255).optional().allow(null, ""),
        sowingMethod: Joi.string().max(255).optional().allow(null, ""),
        seedBrandName: Joi.string().max(255).optional().allow(null, ""),
        storageFacilityAtFarm: Joi.boolean().optional().allow(null),
        equipmentSource: Joi.string().max(255).optional().allow(null, ""),
        primarySalesPoint: Joi.string().max(255).optional().allow(null, ""),
        distanceToNearestMandi: Joi.string()
          .max(255)
          .optional()
          .allow(null, ""),
        isGradingMachineAtFarm: Joi.boolean().optional().allow(null),
        isShadeAtFarmGate: Joi.boolean().optional().allow(null),
        isUnderContractFarming: Joi.boolean().optional().allow(null),
        contractPercent: Joi.number().min(0).max(100).optional().allow(null),
        spotPercent: Joi.number().min(0).max(100).optional().allow(null),
        contractPartnerName: Joi.string().max(255).optional().allow(null, ""),
        // reasonForTrust: Joi.string().optional().allow(null, ""),
        preference: Joi.string().optional().allow(null, ""),
        suggestions: Joi.string().optional().allow(null, ""),
        contractFarmingPercent: Joi.number()
          .min(1)
          .max(100)
          .optional()
          .allow(null),
        soldInSpotMarketPercent: Joi.number()
          .min(0)
          .max(100)
          .optional()
          .allow(null),
        storedInColdStoragePercent: Joi.number()
          .min(0)
          .max(100)
          .optional()
          .allow(null),
        interestedInDigitalTrading: Joi.boolean().optional().allow(null),
        usesWhatsappForBusiness: Joi.boolean().optional().allow(null),
      })
    )
    .optional(),

  irrigationSources: Joi.array()
    .items(Joi.object({ method: Joi.string().max(255).required() }))
    .optional(),

  irrigationMethods: Joi.array()
    .items(Joi.object({ method: Joi.string().max(255).required() }))
    .optional(),

  potatoVarieties: Joi.array()
    .items(
      Joi.object({
        variety: Joi.string().max(255).required(),
        subVariety: Joi.string().max(255).optional().allow(null, ""),
        isCustom: Joi.boolean().optional().allow(null, ""),
      })
    )
    .optional(),

  farmEquipment: Joi.array()
    .items(
      Joi.object({
        machine: Joi.string().max(255).required(),
        brand: Joi.string().max(255).optional().allow(null, ""),
        model: Joi.string().max(255).optional().allow(null, ""),
      })
    )
    .optional(),

  technologyUsed: Joi.array()
    .items(Joi.object({ name: Joi.string().max(255).required() }))
    .optional(),

  sellingChannels: Joi.array()
    .items(Joi.object({ name: Joi.string().max(255).required() }))
    .optional(),

  sellingChallenges: Joi.array()
    .items(Joi.object({ name: Joi.string().max(255).required() }))
    .optional(),

  majorSellingChallenges: Joi.array()
    .items(Joi.object({ name: Joi.string().max(255).required() }))
    .optional(),

  priceDiscoveryMethods: Joi.array()
    .items(Joi.object({ method: Joi.string().max(255).required() }))
    .optional(),

  brandPreferenceReasons: Joi.array()
    .items(Joi.object({ reason: Joi.string().max(255).required() }))
    .optional(),

  sellingPrices: Joi.array()
    .items(Joi.object({ price: Joi.string().max(255).required() }))
    .optional(),

  otherCropsGrown: Joi.array()
    .items(
      Joi.object({
        cropName: Joi.string().max(255).optional().allow(null, ""),
        sowingMonth: Joi.string().max(255).optional().allow(null, ""),
        harvestingMonth: Joi.string().max(255).optional().allow(null, ""),
      })
    )
    .optional(),

  sellingPlaces: Joi.array()
    .items(Joi.object({ place: Joi.string().max(255).required() }))
    .optional(),

  potatoTypes: Joi.array()
    .items(Joi.object({ type: Joi.string().max(255).required() }))
    .optional(),

  seedBrandName: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(255).required(),
        isCustom: Joi.boolean().optional().allow(null, ""),
      })
    )
    .optional(),
});
