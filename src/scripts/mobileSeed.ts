import AdvertisementService from "../database/models/adminModels/advertisementService";
import { advertisementServiceList } from "../utils/constants/mobileSeedList";
import { seedData } from "./seedHelper";

const seedDatabase = async () => {
  try {
    await seedData(
      AdvertisementService,
      advertisementServiceList,
      "Advertisement Services"
    );

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

seedDatabase();
