require('dotenv').config();
// module.exports = function mongoDBMiddleware(req, res, next) {
// mongoose.connect("mongodb+srv://admin:" + process.env.MONGO_PASS + "@backenddb.asaeiqd.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB")
// .then(() => {
//     console.log('Connected to MongoDB');
// })
// .catch((err) => {
//     console.error('Error connecting to MongoDB:', err);
// });
// };
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://admin:" + process.env.MONGO_PASS + "@backenddb.asaeiqd.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB");
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error; 
  }
};

module.exports = { connectDB };
