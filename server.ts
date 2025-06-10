import express from "express";
import sequelize from "./src/database/models/db";
import userRoutes from "./src/routes/userRoutes";
import farmerRoutes from "./src/routes/farmerRoutes";
import coldStorageRoutes from './src/routes/coldStorageRoutes';
import agentRoutes from "./src/routes/agentRoutes";
import locationRoutes from "./src/routes/locationRoutes";
import adminIrrigationRoutes from "./src/routes/adminIrrigationRoutes";
import adminSoilTypeRoutes from "./src/routes/adminSoilTypeRoutes";


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
