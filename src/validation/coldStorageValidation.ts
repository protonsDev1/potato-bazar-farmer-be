import Joi from 'joi';

export const coldStorageSchema = Joi.object({
  name: Joi.string().required(),
  mobileNumber: Joi.string().required(),
  optionalNumber: Joi.string().allow('', null),
  village: Joi.string().required(),
  district: Joi.string().required(),
  geoLocation: Joi.string().required(),
  hasGstCertificate: Joi.boolean().required(),
  gstOrCertificateNumber: Joi.string().allow('', null),
  totalCapacityMt: Joi.number().required(),
  builtYear: Joi.number().integer().required(),
  constructionType: Joi.string().required(),
  roofType: Joi.string().required(),
  numberOfChambers: Joi.number().integer().required(),
  floorsPerChamber: Joi.number().integer().required(),
  chamberWiseCapacityMt: Joi.string().required(),
  numberOfSheds: Joi.number().integer().required(),
  shedSize: Joi.string().required(),
  antiChamberSizeCapacity: Joi.string().required(),
  totalArea: Joi.string().required(),
  hasAirCutter: Joi.boolean().required(),
  hasInsectTrap: Joi.boolean().required(),
  gradingBookingAvailable: Joi.boolean().required(),
  gradingMachineMake: Joi.string().allow('', null),
  gradingMachineTph: Joi.number().allow(null),
  dryingFloorCapacityKatta: Joi.number().integer().allow(null),
  bookingMode: Joi.string().required(),
  coldStorageType: Joi.string().required(),
  co2Controller: Joi.string().required(),
  humidityController: Joi.string().required(),
  temperatureController: Joi.string().required(),
  refrigerationType: Joi.string().required(),
  refrigerationMake: Joi.string().required(),
  machineCount: Joi.number().integer().required(),
  machineCapacity: Joi.number().required(),
  machineMake: Joi.string().required(),
  hasAmmoniaDetector: Joi.boolean().required(),
  hasRemoteMonitoring: Joi.boolean().required(),
  hasWebCamera: Joi.boolean().required(),
  hasGuestStay: Joi.boolean().required(),
  hasGuestMeals: Joi.boolean().required(),
  weighbridgeCapacityLength: Joi.string().required(),
  hasLorryShades: Joi.boolean().required(),
  lorryShadeCapacity: Joi.number().integer().required(),
  accessibility: Joi.string().required(),
  hasLabourForGrading: Joi.boolean().required(),
  potatoDisposalMethod: Joi.string().required(),
  solarPowerCapacityKw: Joi.number().allow(null),
  backupPowerCapacityKw: Joi.number().allow(null),
  uniqueFeatures: Joi.string().allow('', null),
  tradeMode: Joi.string().valid('yesTradeOnly', 'noRentalOnly', 'bothTradeAndRent').required(),
  isContractFarming: Joi.boolean().required(),
  contractFarmingDetails: Joi.string().allow('', null),
  transportProvided: Joi.boolean().required(),
  willingOnlineAuction: Joi.boolean().required(),
  additionalComments: Joi.string().allow('', null),
  userId: Joi.number().integer().allow(null),
  state: Joi.string().required(),

  storageTypes: Joi.array().items(
    Joi.object({
      storageType: Joi.string().required(),
    })
  ).required(),

  usageTypes: Joi.array().items(
    Joi.object({
      type: Joi.string().required(),
    })
  ).required(),

  operationalChallenges: Joi.array().items(
    Joi.object({
      challenge: Joi.string().required(),
    })
  ).required(),

  elevatorsAndStuffing: Joi.array().items(
    Joi.object({
      elevatorCount: Joi.number().integer().min(0).required(),
      stuffingType: Joi.string().required(),
    })
  ).required(),

  chamberCapacities: Joi.array().items(
    Joi.object({
      chamberNumber: Joi.number().required(),
      capacityMt: Joi.number().integer().min(0).required(),
    })
  ).required(),

  sheds: Joi.array().items(
    Joi.object({
     
      sizeSqMtr: Joi.number().integer().min(0).required(),
    })
  ).required(),
});
