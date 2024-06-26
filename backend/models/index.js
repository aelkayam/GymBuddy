import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Convert the current file URL to a path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log({ __filename, __dirname });

const basename = path.basename(__filename);
console.log({ basename });

const env = process.env.NODE_ENV || "development";
const config = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../config/config.json"))
)[env];
const db = {};
// console.log(process.env[config.use_env_variable]);
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

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(async (file) => {
    console.log({ file });
    const model = (await import(path.join(__dirname, file))).default(
      sequelize,
      DataTypes
    );
    console.log({ model });
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { sequelize };
export default db;
