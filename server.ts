import express from "express";
import sequelize from "./src/database/models/db";
import userRoutes from './src/routes/userRoutes';
import farmerRoutes from "./src/routes/farmerRoutes"
const cors = require('cors');



const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/farmers", farmerRoutes);

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