import sequelize from '../database/models/db'; // sequelize instance
import Farmer from '../database/models/farmer';
import LandDetail from '../database/models/landDetails';
import IrrigationSource from '../database/models/irrigationSource';
import PotatoVarietyGrown from '../database/models/potatoVarietyGrown';
import FarmEquipment from '../database/models/farmEquipment';
import TechnologyUsed from '../database/models/technologyUsed';
import SellingChannel from '../database/models/sellingChannel';
import SellingChallenge from '../database/models/sellingChallenge';
import MajorSellingChallenge from '../database/models/majorSellingChallenge';
import PriceDiscoveryMethod from '../database/models/priceDiscoveryMethod';

import { Op } from 'sequelize';

interface Payload {
  name: string;
  age: number;
  gender: string;
  optionalNumber?: string;
  caste?: string;
  subCaste?: string;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  geoLocation?: string;
  isAadhaarCard?: boolean;
  aadhaarNumber?: string;
  isBankAccount?: boolean;

  landDetails?: Array<Record<string, any>>;
  irrigationSources?: Array<{ method: string }>;
  potatoVarieties?: Array<{ variety: string; subVariety?: string }>;
  farmEquipment?: Array<{ machine: string; brand?: string; model?: string }>;
  technologyUsed?: Array<{ name: string }>;
  sellingChannels?: Array<{ name: string }>;
  sellingChallenges?: Array<{ name: string }>;
  majorSellingChallenges?: Array<{ name: string }>;
  priceDiscoveryMethods?: Array<{ method: string }>;

  onBoardedBy?: number;
  userId?: number;


}

export async function onboardFarmer(payload: Payload) {
 try{
  return await sequelize.transaction(async (t) => {
    const farmer = await Farmer.create(
      {
        name: payload.name,
        age: payload.age,
        gender: payload.gender,
        optionalNumber: payload.optionalNumber,
        caste: payload.caste,
        subCaste: payload.subCaste,
        village: payload.village,
        taluka: payload.taluka,
        district: payload.district,
        state: payload.state,
        geoLocation: payload.geoLocation,
        isAadhaarCard: payload.isAadhaarCard,
        aadhaarNumber: payload.aadhaarNumber,
        isBankAccount: payload.isBankAccount,
        onBoardedBy: payload.onBoardedBy, 
        userId:payload.userId
      },
      { transaction: t }
    );

    if (payload.landDetails) {
      console.log("asuuasduia")
      for (const landDetail of payload.landDetails) {
        await LandDetail.create(
          {
            farmerId: farmer.id,
            ...landDetail,
          },
          { transaction: t }
        );
      }
    }

    if (payload.irrigationSources) {
      for (const irrigation of payload.irrigationSources) {
        await IrrigationSource.create(
          { farmerId: farmer.id, method: irrigation.method },
          { transaction: t }
        );
      }
    }

    if (payload.potatoVarieties) {
      for (const variety of payload.potatoVarieties) {
        await PotatoVarietyGrown.create(
          {
            farmerId: farmer.id,
            variety: variety.variety,
            subVariety: variety.subVariety,
          },
          { transaction: t }
        );
      }
    }

    if (payload.farmEquipment) {
      for (const equipment of payload.farmEquipment) {
        await FarmEquipment.create(
          {
            farmerId: farmer.id,
            machine: equipment.machine,
            brand: equipment.brand,
            model: equipment.model,
          },
          { transaction: t }
        );
      }
    }

    if (payload.technologyUsed) {
      for (const tech of payload.technologyUsed) {
        await TechnologyUsed.create(
          { farmerId: farmer.id, name: tech.name },
          { transaction: t }
        );
      }
    }

    if (payload.sellingChannels) {
      for (const channel of payload.sellingChannels) {
        await SellingChannel.create(
          { farmerId: farmer.id, name: channel.name },
          { transaction: t }
        );
      }
    }

    if (payload.sellingChallenges) {
      for (const challenge of payload.sellingChallenges) {
        await SellingChallenge.create(
          { farmerId: farmer.id, name: challenge.name },
          { transaction: t }
        );
      }
    }

    if (payload.majorSellingChallenges) {
      for (const majorChallenge of payload.majorSellingChallenges) {
        await MajorSellingChallenge.create(
          { farmerId: farmer.id, name: majorChallenge.name },
          { transaction: t }
        );
      }
    }

    if (payload.priceDiscoveryMethods) {
      for (const method of payload.priceDiscoveryMethods) {
        await PriceDiscoveryMethod.create(
          { farmerId: farmer.id, method: method.method },
          { transaction: t }
        );
      }
    }

    return farmer;
  });

 }catch(err){
  console.log(err);
  throw err;
 }
}


