import AdvertisementService from "../database/models/adminModels/mobile/advertisementService";
import FaqCategory from "../database/models/adminModels/mobile/faqCategory";
import {
  advertisementServiceList,
  faqCategoryList,
} from "../utils/constants/mobileSeedList";
import { seedData } from "./seedHelper";

const seedDatabase = async () => {
  try {
    await seedData(
      AdvertisementService,
      advertisementServiceList,
      "Advertisement Services"
    );

    await seedData(FaqCategory, faqCategoryList, "Faq Categories");

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

seedDatabase();
