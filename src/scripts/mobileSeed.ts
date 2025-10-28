import AdvertisementService from "../database/models/adminModels/mobile/advertisementService";
import FaqCategory from "../database/models/adminModels/mobile/faqCategory";
import {
  advertisementServiceList,
  faqCategoryList,
} from "../utils/constants/mobileSeedList";
import { seedFaqHelper } from "./seedFaqHelper";
import { seedDataWithoutTrunctate } from "./seedHelperWithoutTruncate";

const seedDatabase = async () => {
  try {
    await seedDataWithoutTrunctate(
      AdvertisementService,
      advertisementServiceList,
      "Advertisement Services"
    ),
      await seedDataWithoutTrunctate(
        FaqCategory,
        faqCategoryList,
        "Faq Categories"
      ),
      await seedFaqHelper(),
      process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

seedDatabase();
