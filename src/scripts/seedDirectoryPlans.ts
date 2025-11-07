import DirectoryPlan from "../database/models/directoryPlan";
import { directoryPlans } from "../utils/constants/directorySeedList";

export const seedDirectoryPlans = async () => {
  try {
    for (const plan of directoryPlans) {
      const [record, created] = await DirectoryPlan.findOrCreate({
        where: { name: plan.name },
        defaults: plan,
      });

      if (created) {
        console.log(`✅ Created new plan: ${plan.name}`);
      } else {
        console.log(`⚙️  Plan already exists: ${plan.name}`);
      }
    }

    console.log("Directory plans seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding directory plans:", error);
    process.exit(1);
  }
};

seedDirectoryPlans();
