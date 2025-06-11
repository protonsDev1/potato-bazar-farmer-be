import express from "express";
import sequelize from "./src/database/models/db";
import userRoutes from "./src/routes/userRoutes";
import farmerRoutes from "./src/routes/farmerRoutes";
import coldStorageRoutes from './src/routes/coldStorageRoutes';
import agentRoutes from "./src/routes/agentRoutes";
import locationRoutes from "./src/routes/locationRoutes";
import adminIrrigationRoutes from "./src/routes/adminRoutes/adminIrrigationRoutes";
import adminSoilTypeRoutes from "./src/routes/adminRoutes/adminSoilTypeRoutes";
import adminPotatoVarietyRoutes from "./src/routes/adminRoutes/adminPotatoVarietyRoutes";
import adminPotatoSubVarietyRoutes from "./src/routes/adminRoutes/adminPotatoSubVarietyRoutes";
import adminSowingMethodRoutes from "./src/routes/adminRoutes/adminSowingMethodRoutes";
import adminFarmEquipmentRoutes from "./src/routes/adminRoutes/adminFarmEquipmentUsedRoutes";
import adminTechnologyUsedRoutes from "./src/routes/adminRoutes/adminTechnologyUsedRoutes";
import adminPriceDiscoveryRoutes from "./src/routes/adminRoutes/adminPriceDiscoveryRoutes";
import adminBiggestChallengeInSellingRoutes from "./src/routes/adminRoutes/adminBiggestChallengeInSellingRoutes"

const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/cold-storage", coldStorageRoutes);
app.use("/api/agent",agentRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/admin/irrigation_source", adminIrrigationRoutes);
app.use("/api/admin/soil_type", adminSoilTypeRoutes);
app.use("/api/admin/potato_variety", adminPotatoVarietyRoutes);
app.use("/api/admin/potato_sub_variety", adminPotatoSubVarietyRoutes);
app.use("/api/admin/sowing_method", adminSowingMethodRoutes);
app.use("/api/admin/farm_equipment", adminFarmEquipmentRoutes);
app.use("/api/admin/technology_used", adminTechnologyUsedRoutes);
app.use("/api/admin/price_discovery", adminPriceDiscoveryRoutes);
app.use("/api/admin/challenge_in_selling", adminBiggestChallengeInSellingRoutes);

const PORT = 8000;
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();
