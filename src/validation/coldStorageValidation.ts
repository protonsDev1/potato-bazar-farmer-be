import Joi from 'joi';

export const coldStorageSchema = Joi.object({
  name: Joi.string().required(),
  ownerName: Joi.string().required(),
  mobileNumber: Joi.string().required(),
  optionalNumber: Joi.string().allow('', null),
  whatsappNumber: Joi.string().required(),
  village: Joi.string().required(),
  district: Joi.string().required(),
  state: Joi.string().required(),
  taluka: Joi.string().required(),
  pinCode: Joi.string().required(),
  digiPin: Joi.string().required(),
  geoLocation: Joi.string().required(),
  hasGstCertificate: Joi.boolean().required(),
  gstOrCertificateNumber: Joi.string().allow('', null),
  totalCapacityMt: Joi.number().required(),
  builtYear: Joi.number().integer().required(),
  // constructionType: Joi.string().required(),
  // roofType: Joi.string().required(),
  numberOfChambers: Joi.number().integer().required(),
  // floorsPerChamber: Joi.number().integer().required(),
  // chamberWiseCapacityMt: Joi.string().required(),
  numberOfSheds: Joi.number().integer().required(),
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
  numberOfKattas: Joi.number().required(),
  // dryingFloorCapacityKatta: Joi.number().integer().allow(null),
  // bookingMode: Joi.string().required(),
  // coldStorageType: Joi.string().required(),
  co2Controller: Joi.string().required(),
  humidityController: Joi.string().required(),
  temperatureController: Joi.string().required(),
  monitoringLogAvailable: Joi.boolean().required(),
  realTimeAlertSystem: Joi.boolean().required(),
  refrigerationType: Joi.string().required(),
  refrigerationMake: Joi.string().required(),
  machineCount: Joi.number().integer().required(),
  machineCapacity: Joi.number().required(),
  // machineMake: Joi.string().required(),
  // hasAmmoniaDetector: Joi.boolean().required(),
  // hasRemoteMonitoring: Joi.boolean().required(),
  // hasWebCamera: Joi.boolean().required(),
  // hasGuestStay: Joi.boolean().required(),
  // hasGuestMeals: Joi.boolean().required(),
  weighBridge: Joi.boolean().required(),
  weighbridgeCapacityLength: Joi.string().required(),
  hasLorryShades: Joi.boolean().required(),
  lorryShadeCapacity: Joi.number().integer().required(),
  numberOfTrucks: Joi.number().integer().required(),
  // accessibility: Joi.string().required(),
  hasLabourForGrading: Joi.boolean().required(),
  noOfLabourInPeakSeason: Joi.number().integer().required(),
  // potatoDisposalMethod: Joi.string().required(),
  // solarPowerCapacityKw: Joi.number().allow(null),
  // backupPowerCapacityKw: Joi.number().allow(null),
  uniqueFeatures: Joi.string().allow('', null),
  // tradeMode: Joi.string().valid('yesTradeOnly', 'noRentalOnly', 'bothTradeAndRent').required(),
  // isContractFarming: Joi.boolean().required(),
  // contractFarmingDetails: Joi.string().allow('', null),
  // transportProvided: Joi.boolean().required(),
  // willingOnlineAuction: Joi.boolean().required(),
  // additionalComments: Joi.string().allow('', null),
  userId: Joi.number().integer().allow(null),
  awardOrCertificate: Joi.string().optional(),
  photos: Joi.string().optional(),

  storageTypes: Joi.array().items(
    Joi.object({
      storageType: Joi.string().required(),
    })
  ).required(),

  usageTypes: Joi.array().items(
    Joi.object({
      type: Joi.string().required(),
      capacity: Joi.number().required(),
    })
  ).required(),

  operationalChallenges: Joi.array().items(
    Joi.object({
      challenge: Joi.string().required(),
    })
  ).required(),

  elevatorsAndStuffing: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
    })
  ).required(),

  chamberCapacities: Joi.array().items(
    Joi.object({
      capacityMt: Joi.number().integer().min(0).required(),
      noOfFloors: Joi.number().integer().optional(),
      sizePerChamberSqft: Joi.number().required(),
      description: Joi.string().optional(),
    })
  ).required(),

  sheds: Joi.array().items(
    Joi.object({
      sizeSqMtr: Joi.number().integer().min(0).required(),
      shedType: Joi.string().optional(),
    })
  ).required(),

 dryingFacilityDetails: Joi.array()
    .items(
      Joi.object({
        facility: Joi.string().required(),
      })
    )
    .required(),

  featureOfStorage: Joi.array()
    .items(
      Joi.object({
        feature: Joi.string().required(),
      })
    )
    .required(),

  monitoringFacilities: Joi.array()
    .items(
      Joi.object({
        facility: Joi.string().required(),
      })
    )
    .required(),

  otherFacilities: Joi.array()
    .items(
      Joi.object({
        facility: Joi.string().required(),
      })
    )
    .required(),

  potatoDisposalSystems: Joi.array()
    .items(
      Joi.object({
        disposalSystem: Joi.string().required(),
      })
    )
    .required(),

  powerFacilities: Joi.array()
    .items(
      Joi.object({
        facility: Joi.string().required(),
        capacityInKw: Joi.number().optional(),
        backupInHrs: Joi.number().optional(),
        make: Joi.string().optional(),
      })
    )
    .required(),

  constructionTypes: Joi.array()
    .items(
      Joi.object({
        constructionType: Joi.string().required(),
      })
    ).required(),

  coldStorageTypes: Joi.array()
  .items(
    Joi.object({
      coldStorageType: Joi.string().required(),
    })
  ).required(),

  roofTypes: Joi.array()
  .items(
    Joi.object({
      roofType: Joi.string().required(),
    })
  ).required(),

  storageBookingSystems: Joi.array()
  .items(
    Joi.object({
      bookingSystem: Joi.string().required(),
    })
  ).required(),

  seasonWiseBookingSystems: Joi.array()
  .items(
    Joi.object({
      season: Joi.string().required(),
      quantityInKg: Joi.number().required(),
    })
  ).required(),

  slabWiseDiscount: Joi.array()
  .items(
    Joi.object({
      quantityInMt: Joi.number().required(),
      discount: Joi.number().required(),
    })
  ).required(),

});
