import DirectoryCategory from "../database/models/directoryCategory";
import DirectorySubCategory from "../database/models/directorySubCategory";
import { directoryData } from "../utils/constants/directorySeedList";
import { seedDataWithoutTrunctate } from "./seedHelperWithoutTruncate";

export const seedDirectoryData = async () => {
  try {
    const categoryList = directoryData.map((item, index) => ({
      name: item.name,
      position: index + 1,
      isActive: true,
    }));

    await seedDataWithoutTrunctate(
      DirectoryCategory,
      categoryList,
      "Directory Categories"
    );

    const allCategories = await DirectoryCategory.findAll();
    const keyMap = {};
    allCategories.forEach((cat) => {
      keyMap[cat.name] = cat.id;
    });

    const subCategoryList = directoryData.flatMap((item) =>
      item.subCategories.map((sub, i) => ({
        categoryId: keyMap[item.name],
        name: sub,
        isActive: true,
      }))
    );

    await seedDataWithoutTrunctate(
      DirectorySubCategory,
      subCategoryList,
      "Directory Sub Categories"
    );

    console.log("Directory Categories & Subcategories seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Directory Data:", error);
    process.exit(1);
  }
};

seedDirectoryData();
