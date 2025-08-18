import Joi from "joi";

export const onboardFarmerSchema = Joi.object({
  name: Joi.string().required(),
  userId: Joi.number().required(),
  age: Joi.number().integer().min(1).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  optionalNumber: Joi.string().optional().allow(null, ""),
  caste: Joi.string().optional().allow(null, ""),
  subCaste: Joi.string().optional().allow(null, ""),
  village: Joi.string().optional().allow(null, ""),
  taluka: Joi.string().optional().allow(null, ""),
  district: Joi.string().optional().allow(null, ""),
  state: Joi.string().optional().allow(null, ""),
  geoLocation: Joi.string().optional().allow(null, ""),
  pinCode: Joi.string().optional().allow(null, ""),
  digiPin: Joi.string().optional().allow(null, ""),
  whatsappNumber: Joi.string().optional().allow(null, ""),
  isAadhaarCard: Joi.boolean().optional().allow(null),
  aadhaarNumber: Joi.string()
    .pattern(/^\d{12}$/)
    .when("isAadhaarCard", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional().allow(null, ""),
    }),
  isBankAccount: Joi.boolean().optional().allow(null),

  landDetails: Joi.array()
    .items(
      Joi.object({
        landOwnedAcres: Joi.number().required(),
        landLeasedAcres: Joi.number().required(),
        totalLandUnderCultivation: Joi.number().optional().allow(null),
        landForPotatoFarming: Joi.number().optional().allow(null),
        areaUnderDrip: Joi.number().optional().allow(null),
        storageCapacityAtFarm: Joi.number().optional().allow(null),
        irrigationEquipmentModel: Joi.string().optional().allow(null, ""),
        irrigationEquipmentBrand: Joi.string().optional().allow(null, ""),
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
        soilType: Joi.string().optional().allow(null, ""),
        averageYieldPerAcre: Joi.number().optional().allow(null),
        sowingMonth: Joi.string().optional().allow(null, ""),
        harvestMonth: Joi.string().optional().allow(null, ""),
        sowingMethod: Joi.string().optional().allow(null, ""),
        seedBrandName: Joi.string().optional().allow(null, ""),
        storageFacilityAtFarm: Joi.boolean().optional().allow(null),
        equipmentSource: Joi.string().optional().allow(null, ""),
        primarySalesPoint: Joi.string().optional().allow(null, ""),
        distanceToNearestMandi: Joi.string().optional().allow(null, ""),
        isGradingMachineAtFarm: Joi.boolean().optional().allow(null),
        isShadeAtFarmGate: Joi.boolean().optional().allow(null),
        isUnderContractFarming: Joi.boolean().optional().allow(null),
        contractPercent: Joi.number().optional().allow(null),
        spotPercent: Joi.number().optional().allow(null),
        contractPartnerName: Joi.string().optional().allow(null, ""),
        reasonForTrust: Joi.string().optional().allow(null, ""),
        preference: Joi.string().optional().allow(null, ""),
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
        subVariety: Joi.string().optional().allow(null, ""),
        isCustom: Joi.boolean().optional().allow(null, ""),
      })
    )
    .optional(),

  farmEquipment: Joi.array()
    .items(
      Joi.object({
        machine: Joi.string().required(),
        brand: Joi.string().optional().allow(null, ""),
        model: Joi.string().optional().allow(null, ""),
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

  otherCropsGrown: Joi.array()
    .items(
      Joi.object({
        cropName: Joi.string().optional().allow(null, ""),
        sowingMonth: Joi.string().optional().allow(null, ""),
        harvestingMonth: Joi.string().optional().allow(null, ""),
      })
    )
    .optional(),

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

  seedBrandName: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        isCustom: Joi.boolean().optional().allow(null, ""),
      })
    )
    .optional(),
});

export const updateFarmerSchema = Joi.object({
  name: Joi.string().optional().allow(null, ""),
  age: Joi.number().integer().min(1).optional().allow(null),
  gender: Joi.string().valid("male", "female", "other").optional(),
  optionalNumber: Joi.string().optional().allow(null, ""),
  caste: Joi.string().optional().allow(null, ""),
  subCaste: Joi.string().optional().allow(null, ""),
  village: Joi.string().optional().allow(null, ""),
  taluka: Joi.string().optional().allow(null, ""),
  district: Joi.string().optional().allow(null, ""),
  state: Joi.string().optional().allow(null, ""),
  geoLocation: Joi.string().optional().allow(null, ""),
  pinCode: Joi.string().optional().allow(null, ""),
  digiPin: Joi.string().optional().allow(null, ""),
  whatsappNumber: Joi.string().optional().allow(null, ""),
  isAadhaarCard: Joi.boolean().optional().allow(null),
  aadhaarNumber: Joi.string()
    .pattern(/^\d{12}$/)
    .when("isAadhaarCard", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional().allow(null, ""),
    }),
  isBankAccount: Joi.boolean().optional().allow(null),

  landDetails: Joi.array()
    .items(
      Joi.object({
        landOwnedAcres: Joi.number().optional().allow(null),
        landLeasedAcres: Joi.number().optional().allow(null),
        totalLandUnderCultivation: Joi.number().optional().allow(null),
        landForPotatoFarming: Joi.number().optional().allow(null),
        areaUnderDrip: Joi.number().optional().allow(null),
        storageCapacityAtFarm: Joi.number().optional().allow(null),
        irrigationEquipmentModel: Joi.string().optional().allow(null, ""),
        irrigationEquipmentBrand: Joi.string().optional().allow(null, ""),
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
        soilType: Joi.string().optional().allow(null, ""),
        averageYieldPerAcre: Joi.number().optional().allow(null),
        sowingMonth: Joi.string().optional().allow(null, ""),
        harvestMonth: Joi.string().optional().allow(null, ""),
        sowingMethod: Joi.string().optional().allow(null, ""),
        seedBrandName: Joi.string().optional().allow(null, ""),
        storageFacilityAtFarm: Joi.boolean().optional().allow(null),
        equipmentSource: Joi.string().optional().allow(null, ""),
        primarySalesPoint: Joi.string().optional().allow(null, ""),
        distanceToNearestMandi: Joi.string().optional().allow(null, ""),
        isGradingMachineAtFarm: Joi.boolean().optional().allow(null),
        isShadeAtFarmGate: Joi.boolean().optional().allow(null),
        isUnderContractFarming: Joi.boolean().optional().allow(null),
        contractPercent: Joi.number().optional().allow(null),
        spotPercent: Joi.number().optional().allow(null),
        contractPartnerName: Joi.string().optional().allow(null, ""),
        reasonForTrust: Joi.string().optional().allow(null, ""),
        preference: Joi.string().optional().allow(null, ""),
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
    .items(Joi.object({ method: Joi.string().required() }))
    .optional(),

  irrigationMethods: Joi.array()
    .items(Joi.object({ method: Joi.string().required() }))
    .optional(),

  potatoVarieties: Joi.array()
    .items(
      Joi.object({
        variety: Joi.string().required(),
        subVariety: Joi.string().optional().allow(null, ""),
        isCustom: Joi.boolean().optional().allow(null, ""),
      })
    )
    .optional(),

  farmEquipment: Joi.array()
    .items(
      Joi.object({
        machine: Joi.string().required(),
        brand: Joi.string().optional().allow(null, ""),
        model: Joi.string().optional().allow(null, ""),
      })
    )
    .optional(),

  technologyUsed: Joi.array()
    .items(Joi.object({ name: Joi.string().required() }))
    .optional(),

  sellingChannels: Joi.array()
    .items(Joi.object({ name: Joi.string().required() }))
    .optional(),

  sellingChallenges: Joi.array()
    .items(Joi.object({ name: Joi.string().required() }))
    .optional(),

  majorSellingChallenges: Joi.array()
    .items(Joi.object({ name: Joi.string().required() }))
    .optional(),

  priceDiscoveryMethods: Joi.array()
    .items(Joi.object({ method: Joi.string().required() }))
    .optional(),

  brandPreferenceReasons: Joi.array()
    .items(Joi.object({ reason: Joi.string().required() }))
    .optional(),

  sellingPrices: Joi.array()
    .items(Joi.object({ price: Joi.string().required() }))
    .optional(),

  otherCropsGrown: Joi.array()
    .items(
      Joi.object({
        cropName: Joi.string().optional().allow(null, ""),
        sowingMonth: Joi.string().optional().allow(null, ""),
        harvestingMonth: Joi.string().optional().allow(null, ""),
      })
    )
    .optional(),

  sellingPlaces: Joi.array()
    .items(Joi.object({ place: Joi.string().required() }))
    .optional(),

  potatoTypes: Joi.array()
    .items(Joi.object({ type: Joi.string().required() }))
    .optional(),

  seedBrandName: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        isCustom: Joi.boolean().optional().allow(null, ""),
      })
    )
    .optional(),
});
