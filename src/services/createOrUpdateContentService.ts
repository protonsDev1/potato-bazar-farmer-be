import ContentManagement from "../database/models/contentManagement";

export const createOrUpdateContentService = async (payload) => {
  const { title, description } = payload;

  const existingContent = await ContentManagement.findOne({ where: { title } });

  if (existingContent) {
    existingContent.description = description;
    await existingContent.save();

    return {
      statusCode: 200,
      message: `${title} updated successfully.`,
      data: existingContent,
    };
  }

  const newContent = await ContentManagement.create({
    title,
    description,
  });

  return {
    statusCode: 201,
    message: `${title} added successfully.`,
    data: newContent,
  };
};
