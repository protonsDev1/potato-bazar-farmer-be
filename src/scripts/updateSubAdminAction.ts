import SubAdminWebPermission from "../database/models/subAdminWebPermission";

const updateExistingSubAdmins = async () => {
  try {
    await SubAdminWebPermission.update(
      { action: "approve_reject" },
      {
        where: { action: "review" },
      }
    );

    console.log("Existing Sub Admins updated successfully.");
  } catch (error) {
    console.error("Error updating subadmins:", error);
  }
};

updateExistingSubAdmins();
