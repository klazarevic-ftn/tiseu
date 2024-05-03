const User = require('../models/user.model');

// exports.getAllUsers = async () => {
//   const users = await User.find();
//   return users;
// };

async function checkAccountConfig(userEmail) {
    try {
      const user = await User.findOne({ email: userEmail });
  
      if (user && user.configured) {
        return { isConfigured: true };
      } else {
        return { isConfigured: false };
      }
    } catch (error) {
      console.error("Error while checking account:", error);
      throw new Error("Error while checking account.");
    }
}

async function findAll() {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.error("Error while fetching all users:", error);
    throw error;
  }
}

const findByUPIN = async (upin) => {
  try {
    const user = await User.findOne({ UPIN: upin });
    return user;
  } catch (error) {
    console.error('Error finding user by UPIN:', error);
    throw new Error('Failed to find user by UPIN');
  }
};

module.exports = { 
    checkAccountConfig,
    findAll,
    findByUPIN,
 };
  