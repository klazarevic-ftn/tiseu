const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');



// router.get('/check-auth', async (req, res) => {
//   await userController.checkAuthentication(req, res);
// });

router.get('/account-config', userController.checkAccountConfig);

router.post('/register', userController.register);
// router.post('/register', (req, res) => {
//   const { firstName, lastName, UPIN, dateOfBirth, streetAddress, aptNumber, city, country, phone, specialization, license, accountType } = req.body;

//   console.log("Received data from front-end:");
//   console.log("First name:", firstName);
//   console.log("Last name:", lastName);
//   console.log("UPIN:", UPIN);
//   console.log("Date of birth:", dateOfBirth);
//   console.log("Street Address:", streetAddress);
//   console.log("Apt. number:", aptNumber);
//   console.log("City:", city);
//   console.log("Country:", country);
//   console.log("Phone number:", phone);
//   console.log("Specialization:", specialization);
//   console.log("License number:", license);
//   console.log("Account type:", accountType );

//   res.send('Received data from front-end');
// });

module.exports = router;
