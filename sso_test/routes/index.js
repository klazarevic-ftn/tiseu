var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const jwt = require('jsonwebtoken');


// router.get('/login/callback', function (req, res, next) {
//   if (req.oidc.isAuthenticated()) {
//     const user = req.oidc.user;
//     const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token });
//   } else {
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// });

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});

module.exports = router;
