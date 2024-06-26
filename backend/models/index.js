import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Convert the current file URL to a path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);

const env = process.env.NODE_ENV || "development";
const config = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../config/config.json"))
)[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Function to import models dynamically
const importModels = async () => {
  // Read all files in current directory except index.js
  fs.readdirSync(__dirname)
    .filter((file) => file !== basename && file.slice(-3) === ".js")
    .forEach(async (file) => {
      const filePath = path.resolve(__dirname, file);
      const { default: model } = await import(`file://${filePath}`);

      // Initialize the model with Sequelize and DataTypes
      const initializedModel = model(sequelize, DataTypes);
      db[initializedModel.name] = initializedModel;
    });

  // Associate models after all are imported
  Object.values(db).forEach((model) => {
    if (model.associate) {
      model.associate(db);
    }
  });
};

// Call the importModels function to initialize models
importModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { sequelize };
export default db;
