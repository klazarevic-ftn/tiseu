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


module.exports = { 
    checkAccountConfig,
 };
  