const updateModelFields = async (modelInstance, data) => {
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      modelInstance.set(key, data[key]);
    }
  });
  await modelInstance.save();
  return modelInstance;
};

export const updateRecord = async (modelClass, id, data) => {
  try {
    const instance = await modelClass.findByPk(id);
    if (!instance)
      return {
        success: false,
        error: `Record not found with ID: ${id}.`,
      };
    const updatedInstance = await updateModelFields(instance, data);
    return {
      success: true,
      data: updatedInstance,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error.message || "Error updating record",
    };
  }
};

export const createRecord = async (model, data) => {
  try {
    const result = await model.create(data);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error.message || "Error creating record",
    };
  }
};

export const getActiveRecords = async (model) => {
  try {
    const result = await model.findAll({
      where: { isActive: true },
      order: [["position", "ASC"]],
    });
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error.message || "Error retrieving active records",
    };
  }
};

export const getAllRecords = async (model) => {
  try {
    const result = await model.findAll();
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error.message || "Error retrieving records",
    };
  }
};

export const getRecordById = async (model, id) => {
  try {
    const result = await model.findByPk(id);
    if (!result) {
      return {
        success: false,
        error: `Record not found with ID: ${id}.`,
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error.message || "Error retrieving record by ID",
    };
  }
};

export const deleteRecord = async (model, id) => {
  try {
    const result = await model.findByPk(id);
    if (!result)
      return {
        success: false,
        error: `Record not found with ID: ${id}.`,
      };
    await model.destroy({ where: { id } });
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error.message || "Error Deleting record",
    };
  }
};
