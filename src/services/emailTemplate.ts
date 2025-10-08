import fs from "fs";
import path from "path";

export const renderTemplate = (
  templateName: string,
  variables: Record<string, any>
) => {
  const filePath = path.join(__dirname, "../templates", `${templateName}.html`);
  let templateContent = fs.readFileSync(filePath, "utf8");

  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    templateContent = templateContent.replace(regex, variables[key]);
  });

  return templateContent;
};
