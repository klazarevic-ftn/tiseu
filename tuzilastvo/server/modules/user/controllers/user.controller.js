const User = require('../models/user.model');
const userService = require('../services/user.service');

async function checkAuthentication(req, res) {
  try {
    if (!req.oidc.user) {
      return res.status(401).json({ isAuthenticated: false, message: "User is not authenticated." });
    }
    const userEmail = req.oidc.user.email;
    let user = await User.findOne({ email: userEmail });
    if (user) {

      return res.status(200).json({ isAuthenticated: true, user });
    }
    user = await User.create({
      nickname: req.oidc.user.nickname,
      name: req.oidc.user.name,
      email: req.oidc.user.email,
      type: 'CIVIL', 
      configured: false 
    });
    return res.status(200).json({ isAuthenticated: true, user });
  } catch (error) {

    return res.status(500).json({ isAuthenticated: false, message: "Error while checking authentication." });
  }
}

async function checkAccountConfig(req, res) {
  try {
    if (!req.oidc.user) {
      return res.status(401).json({ message: "User is not authenticated." });
    }
    const userEmail = req.oidc.user.email;
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!user.configured) {
      return res.status(201).json({ configured: false, user });
    }
    return res.status(200).json({ configured: true, user });
  } catch (error) {
    console.error("Error while checking account:", error);
    return res.status(500).json({ message: "Error while checking account." });
  }
}



async function register(req, res) {
  console.log("Received data from front-end:");

  try {
    const userEmail = req.body.userEmail;
    console.log(userEmail);
    console.log("Checking if user exists...");
    let user = await User.findOne({ email: userEmail });

    if (!user) {
      console.log("User does not exist.");
      return res.status(400).json({ message: "User does not exist." });
    }

    console.log("Checking if user is already configured...");
    if (user.configured) {
      console.log("User is already configured.");
      return res.status(400).json({ message: "User is already configured." });
    }

    console.log("Checking if UPIN is unique (if provided)...");
    if (req.body.UPIN) {
      const existingUser = await User.findOne({ UPIN: req.body.UPIN });
      if (existingUser) {
        console.log("UPIN must be unique.");
        return res.status(400).json({ message: "UPIN must be unique." });
      }
      user.UPIN = req.body.UPIN;
    }

    console.log("Setting user attributes...");
    user.type = req.body.accountType || 'CIVIL';
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.birthDate = req.body.dateOfBirth;
    user.address = {
      streetAddress: req.body.streetAddress,
      aptNumber: req.body.aptNumber,
      city: req.body.city,
      country: req.body.country
    };
    user.phone = req.body.phone;
    user.specialization = req.body.specialization;
    user.licenseNumber = req.body.license;

    user.configured = true;

    console.log("Saving updated user...");
    const updatedUser = await user.save();

    console.log("User registered successfully.");
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Error registering user." });
  }
}

async function findProsecutors(req, res) {
  try {
    const users = await userService.findAll();
    const prosecutors = users
      .filter(user => user.type === 'PROSECUTOR')
      .map(({ UPIN, firstName, lastName, specialization }) => ({ UPIN, firstName, lastName, specialization }));
    return res.status(200).json(prosecutors);
  } catch (error) {
    console.error("Error while fetching prosecutors:", error);
    return res.status(500).json({ message: "Error while fetching prosecutors." });
  }
}

// async function getUser(req, res) {
//   try {
//     const { UPIN } = req.params;
//     console.log("UPIN param from fron: ", UPIN)
//     const result = await userService.findByUPIN(UPIN);
//     console.log("response from service: ", result)

//     if (!result.success) {
//       return res.status(404).json({ message: result.message });
//     }
//     return res.status(200).json(result.user);
//   } catch (error) {
//     console.error("Error while getting user:", error);
//     return res.status(500).json({ message: "Error while getting user." });
//   }
// }


const getUser = async (req, res) => {
  try {
    const { UPIN } = req.params;
    const userInfo = await userService.findByUPIN(UPIN);
    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ userInfo });
  } catch (error) {
    console.error('Error getting user information:', error);
    res.status(500).json({ message: 'Failed to get user information', error: error.message });
  }
};

module.exports = { 
  checkAuthentication,
  checkAccountConfig,
  register,
  findProsecutors,
  getUser,
};
