import FaqCategory from "../database/models/adminModels/mobile/faqCategory";
import Faq from "../database/models/faq";
import { faqQuestionsAndAnswers } from "../utils/constants/mobileSeedList";

export const seedFaqHelper = async () => {
  const count = await Faq.count();

  if (count !== 0) {
    await Faq.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });
  }

  const categoryMap = {};

  const faqCategories = await FaqCategory.findAll();

  faqCategories.map((c) => {
    categoryMap[c.name] = c.id;
  });

  const faqData = faqQuestionsAndAnswers.map((q) => ({
    categoryId: categoryMap[q.category],
    question: q.question,
    answer: q.answer,
  }));

  await Faq.bulkCreate(faqData, {
    ignoreDuplicates: true,
  });

  console.log("FAQs inserted successfully.");
};
