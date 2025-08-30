import Joi from "joi";

export const coldStorageSchema = Joi.object({
  name: Joi.string().max(255).required(),
  ownerName: Joi.string().max(255).required(),
  mobileNumber: Joi.string().max(255).required(),
  optionalNumber: Joi.string().max(255).allow("", null),
  whatsappNumber: Joi.string().max(255).optional().allow("", null),
  village: Joi.string().max(255).required(),
  district: Joi.string().max(255).required(),
  state: Joi.string().max(255).required(),
  taluka: Joi.string().max(255).optional().allow(null, ""),
  pinCode: Joi.string().max(255).required(),
  digiPin: Joi.string().max(255).optional().allow("", null),
  geoLocation: Joi.string().max(255).optional().allow("", null),
  hasGstCertificate: Joi.boolean().required(),
  gstOrCertificateNumber: Joi.string().max(255).allow("", null),
  totalCapacityMt: Joi.number().required(),
  builtYear: Joi.number().integer().required(),
  // constructionType: Joi.string().required(),
  // roofType: Joi.string().required(),
  numberOfChambers: Joi.number().integer().required(),
  // floorsPerChamber: Joi.number().integer().required(),
  // chamberWiseCapacityMt: Joi.string().required(),
  numberOfSheds: Joi.number().integer().optional().allow(null, ""),
  // shedSize: Joi.string().required(),
  // antiChamberSizeCapacity: Joi.string().required(),
  // totalArea: Joi.string().required(),
  hasAirCutter: Joi.boolean().required(),
  hasInsectTrap: Joi.boolean().required(),
  // gradingBookingAvailable: Joi.boolean().required(),
  gradingAreaAvailable: Joi.boolean().required(),
  // gradingAreaSqft: Joi.number().when('gradingBookingAvailable', {
  // is: true,
  // then: Joi.required(),
  // otherwise: Joi.optional(),
  // }),
  // gradingMachineMake: Joi.string().allow('', null),
  gradingMachineAvailable: Joi.boolean().required(),
  gradingMachineTph: Joi.number().allow(null),
  manualGradingAreaAvailable: Joi.boolean().required(),
  numberOfKattas: Joi.number().optional().allow(null, ""),
  dryingFloorCapacityKatta: Joi.number().integer().allow(null),
  // bookingMode: Joi.string().required(),
  coldStorageType: Joi.string()
    .valid("Traditional", "Controlled Atmosphere")
    .required(),
  co2Controller: Joi.string().max(255).optional().allow("", null),
  humidityController: Joi.string().max(255).optional().allow("", null),
  temperatureController: Joi.string().max(255).optional().allow("", null),
  monitoringLogAvailable: Joi.boolean().required(),
  realTimeAlertSystem: Joi.boolean().required(),
  refrigerationType: Joi.string().max(255).required(),
  refrigerationMake: Joi.string().max(255).required(),
  machineCount: Joi.number().integer().required(),
  machineCapacity: Joi.number().required(),
  // machineMake: Joi.string().required(),
  // hasAmmoniaDetector: Joi.boolean().required(),
  // hasRemoteMonitoring: Joi.boolean().required(),
  // hasWebCamera: Joi.boolean().required(),
  // hasGuestStay: Joi.boolean().required(),
  // hasGuestMeals: Joi.boolean().required(),
  weighBridge: Joi.boolean().required(),
  weighbridgeCapacityLength: Joi.string().when("weighBridge", {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional().allow("", null),
  }),
  hasLorryShades: Joi.boolean().required(),
  lorryShadeCapacity: Joi.number()
    .integer()
    .when("hasLorryShades", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional().allow(null),
    }),
  numberOfTrucks: Joi.number().integer().optional().allow(null),
  // accessibility: Joi.string().required(),
  hasLabourForGrading: Joi.boolean().required(),
  noOfLabourInPeakSeason: Joi.number().integer().optional().allow(null),
  // potatoDisposalMethod: Joi.string().required(),
  // solarPowerCapacityKw: Joi.number().allow(null),
  // backupPowerCapacityKw: Joi.number().allow(null),
  uniqueFeatures: Joi.string().allow("", null),
  // tradeMode: Joi.string().valid('yesTradeOnly', 'noRentalOnly', 'bothTradeAndRent').required(),
  // isContractFarming: Joi.boolean().required(),
  // contractFarmingDetails: Joi.string().allow('', null),
  // transportProvided: Joi.boolean().required(),
  // willingOnlineAuction: Joi.boolean().required(),
  // additionalComments: Joi.string().allow('', null),
  isSlabWiseDiscount: Joi.boolean().required(),
  userId: Joi.number().integer().allow(null),
  awardOrCertificate: Joi.array().items(Joi.string()).optional(),
  photos: Joi.array().items(Joi.string()).optional(),

  storageTypes: Joi.array()
    .items(
      Joi.object({
        storageType: Joi.string().max(255).required(),
      })
    )
    .required(),

  usageTypes: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().max(255).required(),
        capacity: Joi.number().required(),
      })
    )
    .required(),

  operationalChallenges: Joi.array()
    .items(
      Joi.object({
        challenge: Joi.string().max(255).required(),
      })
    )
    .required(),

  elevatorsAndStuffing: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(255).required(),
      })
    )
    .optional(),

  chamberCapacities: Joi.array()
    .items(
      Joi.object({
        capacityMt: Joi.number().integer().min(0).required(),
        noOfFloors: Joi.number().integer().optional().allow(null),
        sizePerChamberSqft: Joi.number().required(),
        description: Joi.string().max(255).optional().allow("", null),
      })
    )
    .required(),

  sheds: Joi.array()
    .items(
      Joi.object({
        sizeSqMtr: Joi.number().integer().min(0).optional().allow(null, ""),
        shedType: Joi.string().max(255).optional().allow("", null),
      })
    )
    .optional(),

  dryingFacilityDetails: Joi.array()
    .items(
      Joi.object({
        facility: Joi.string().max(255).required(),
      })
    )
    .required(),

  featureOfStorage: Joi.array()
    .items(
      Joi.object({
        feature: Joi.string().max(255).required(),
      })
    )
    .required(),

  monitoringFacilities: Joi.array()
    .items(
      Joi.object({
        facility: Joi.string().max(255).required(),
      })
    )
    .required(),

  otherFacilities: Joi.array()
    .items(
      Joi.object({
        facility: Joi.string().max(255).required(),
      })
    )
    .optional(),

  potatoDisposalSystems: Joi.array()
    .items(
      Joi.object({
        disposalSystem: Joi.string().max(255).required(),
      })
    )
    .required(),

  powerFacilities: Joi.array()
    .items(
      Joi.object({
        facility: Joi.string().max(255).required(),
        capacityInKw: Joi.number().optional().allow(null),
        backupInHrs: Joi.number().optional().allow(null),
        make: Joi.string().max(255).optional().allow("", null),
      })
    )
    .required(),

  constructionTypes: Joi.array()
    .items(
      Joi.object({
        constructionType: Joi.string().max(255).required(),
      })
    )
    .optional(),

  coldStorageTypes: Joi.array()
    .items(
      Joi.object({
        coldStorageType: Joi.string().max(255).required(),
      })
    )
    .required(),

  roofTypes: Joi.array()
    .items(
      Joi.object({
        roofType: Joi.string().max(255).required(),
      })
    )
    .optional(),

  storageBookingSystems: Joi.array()
    .items(
      Joi.object({
        bookingSystem: Joi.string().max(255).required(),
      })
    )
    .optional(),

  seasonWiseBookingSystems: Joi.array()
    .items(
      Joi.object({
        season: Joi.string().max(255).required(),
        quantityInKg: Joi.number().required(),
      })
    )
    .optional(),

  slabWiseDiscount: Joi.array()
    .items(
      Joi.object({
        quantityInMt: Joi.string().max(255).optional().allow(null, ""),
        discount: Joi.number().optional().allow(null, ""),
      })
    )
    .optional(),
});

export const updateColdStorageSchema = Joi.object({
  name: Joi.string().max(255).optional().allow("", null),
  ownerName: Joi.string().max(255).optional().allow("", null),
  mobileNumber: Joi.string().max(255).optional().allow("", null),
  optionalNumber: Joi.string().max(255).allow("", null),
  whatsappNumber: Joi.string().max(255).optional().allow("", null),
  village: Joi.string().max(255).optional().allow("", null),
  district: Joi.string().max(255).optional().allow("", null),
  state: Joi.string().max(255).optional().allow("", null),
  taluka: Joi.string().max(255).optional().allow("", null),
  pinCode: Joi.string().max(255).optional().allow("", null),
  digiPin: Joi.string().max(255).optional().allow("", null),
  geoLocation: Joi.string().max(255).optional().allow("", null),
  hasGstCertificate: Joi.boolean().optional().allow(null),
  gstOrCertificateNumber: Joi.string().max(255).allow("", null),
  totalCapacityMt: Joi.number().optional().allow(null),
  builtYear: Joi.number().integer().optional().allow(null),
  // constructionType: Joi.string().optional(),
  // roofType: Joi.string().optional(),
  numberOfChambers: Joi.number().integer().optional().allow(null),
  // floorsPerChamber: Joi.number().integer().optional(),
  // chamberWiseCapacityMt: Joi.string().optional(),
  numberOfSheds: Joi.number().integer().optional().allow(null),
  // shedSize: Joi.string().optional(),
  // antiChamberSizeCapacity: Joi.string().optional(),
  // totalArea: Joi.string().optional(),
  hasAirCutter: Joi.boolean().optional().allow(null),
  hasInsectTrap: Joi.boolean().optional().allow(null),
  // gradingBookingAvailable: Joi.boolean().optional(),
  gradingAreaAvailable: Joi.boolean().optional().allow(null),
  // gradingAreaSqft: Joi.number().when('gradingBookingAvailable', {
  // is: true,
  // then: Joi.optional(),
  // otherwise: Joi.optional(),
  // }),
  // gradingMachineMake: Joi.string().allow('', null),
  gradingMachineAvailable: Joi.boolean().optional().allow(null),
  gradingMachineTph: Joi.number().allow(null),
  manualGradingAreaAvailable: Joi.boolean().optional().allow(null),
  numberOfKattas: Joi.number().optional().allow(null),
  dryingFloorCapacityKatta: Joi.number().integer().allow(null),
  // bookingMode: Joi.string().optional(),
  coldStorageType: Joi.string()
    .valid("Traditional", "Controlled Atmosphere")
    .required(),
  co2Controller: Joi.string().max(255).optional().allow("", null),
  humidityController: Joi.string().max(255).optional().allow("", null),
  temperatureController: Joi.string().max(255).optional().allow("", null),
  monitoringLogAvailable: Joi.boolean().optional().allow(null),
  realTimeAlertSystem: Joi.boolean().optional().allow(null),
  refrigerationType: Joi.string().max(255).optional().allow("", null),
  refrigerationMake: Joi.string().max(255).optional().allow("", null),
  machineCount: Joi.number().integer().optional().allow(null),
  machineCapacity: Joi.number().optional().allow(null),
  // machineMake: Joi.string().optional(),
  // hasAmmoniaDetector: Joi.boolean().optional(),
  // hasRemoteMonitoring: Joi.boolean().optional(),
  // hasWebCamera: Joi.boolean().optional(),
  // hasGuestStay: Joi.boolean().optional(),
  // hasGuestMeals: Joi.boolean().optional(),
  weighBridge: Joi.boolean().optional().allow(null),
  weighbridgeCapacityLength: Joi.string().when("weighBridge", {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional().allow("", null),
  }),
  hasLorryShades: Joi.boolean().optional().allow(null),
  lorryShadeCapacity: Joi.number()
    .integer()
    .when("hasLorryShades", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional().allow(null),
    }),
  numberOfTrucks: Joi.number().integer().optional().allow(null),
  // accessibility: Joi.string().optional(),
  hasLabourForGrading: Joi.boolean().optional().allow(null),
  noOfLabourInPeakSeason: Joi.number().integer().optional().allow(null),
  // potatoDisposalMethod: Joi.string().optional(),
  // solarPowerCapacityKw: Joi.number().allow(null),
  // backupPowerCapacityKw: Joi.number().allow(null),
  uniqueFeatures: Joi.string().allow("", null),
  // tradeMode: Joi.string().valid('yesTradeOnly', 'noRentalOnly', 'bothTradeAndRent').optional(),
  // isContractFarming: Joi.boolean().optional(),
  // contractFarmingDetails: Joi.string().allow('', null),
  // transportProvided: Joi.boolean().optional(),
  // willingOnlineAuction: Joi.boolean().optional(),
  // additionalComments: Joi.string().allow('', null),
  isSlabWiseDiscount: Joi.boolean().optional().allow(null),
  awardOrCertificate: Joi.array().items(Joi.string().max(255)).optional(),
  photos: Joi.array().items(Joi.string().max(255)).optional(),

  storageTypes: Joi.array()
    .items(
      Joi.object({
        storageType: Joi.string().max(255).required(),
      })
    )
    .optional(),

  usageTypes: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().max(255).required(),
        capacity: Joi.number().required(),
      })
    )
    .optional(),

  operationalChallenges: Joi.array()
    .items(
      Joi.object({
        challenge: Joi.string().max(255).required(),
      })
    )
    .optional(),

  elevatorsAndStuffing: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(255).required(),
      })
    )
    .optional(),

  chamberCapacities: Joi.array()
    .items(
      Joi.object({
        capacityMt: Joi.number().integer().min(0).required(),
        noOfFloors: Joi.number().integer().optional().allow(null),
        sizePerChamberSqft: Joi.number().required(),
        description: Joi.string().max(255).optional().allow("", null),
      })
    )
    .optional(),

  sheds: Joi.array()
    .items(
      Joi.object({
        sizeSqMtr: Joi.number().integer().min(0).optional().allow(null, ""),
        shedType: Joi.string().max(255).optional().allow("", null),
      })
    )
    .optional(),

  dryingFacilityDetails: Joi.array()
    .items(
      Joi.object({
        facility: Joi.string().max(255).required(),
      })
    )
    .optional(),

  featureOfStorage: Joi.array()
    .items(
      Joi.object({
        feature: Joi.string().max(255).required(),
      })
    )
    .optional(),

  monitoringFacilities: Joi.array()
    .items(
      Joi.object({
        facility: Joi.string().max(255).required(),
      })
    )
    .optional(),

  otherFacilities: Joi.array()
    .items(
      Joi.object({
        facility: Joi.string().max(255).required(),
      })
    )
    .optional(),

  potatoDisposalSystems: Joi.array()
    .items(
      Joi.object({
        disposalSystem: Joi.string().max(255).required(),
      })
    )
    .optional(),

  powerFacilities: Joi.array()
    .items(
      Joi.object({
        facility: Joi.string().max(255).required(),
        capacityInKw: Joi.number().optional().allow(null),
        backupInHrs: Joi.number().optional().allow(null),
        make: Joi.string().max(255).optional().allow("", null),
      })
    )
    .optional(),

  constructionTypes: Joi.array()
    .items(
      Joi.object({
        constructionType: Joi.string().max(255).required(),
      })
    )
    .optional(),

  coldStorageTypes: Joi.array()
    .items(
      Joi.object({
        coldStorageType: Joi.string().max(255).required(),
      })
    )
    .optional(),

  roofTypes: Joi.array()
    .items(
      Joi.object({
        roofType: Joi.string().max(255).required(),
      })
    )
    .optional(),

  storageBookingSystems: Joi.array()
    .items(
      Joi.object({
        bookingSystem: Joi.string().max(255).required(),
      })
    )
    .optional(),

  seasonWiseBookingSystems: Joi.array()
    .items(
      Joi.object({
        season: Joi.string().max(255).required(),
        quantityInKg: Joi.number().required(),
      })
    )
    .optional(),

  slabWiseDiscount: Joi.array()
    .items(
      Joi.object({
        quantityInMt: Joi.number().optional().allow(null, ""),
        discount: Joi.number().optional().allow(null, ""),
      })
    )
    .optional(),
});
