import fs from "fs";
import colors from "colors";
import dotenv from "dotenv";
import { productModel } from "../../models/product_model.js";
import { dbConnection } from "../../config/database.js";

dotenv.config({ path: '../../.env' });

// connect to DB
dbConnection();

// Read data
const products = JSON.parse(fs.readFileSync('./product.json'));


// Insert data into DB
const insertData = async () => {
  try {
    await productModel.create(products);

    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await productModel.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}