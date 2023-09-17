const express = require('express');
const passport = require('passport');
const { User } = require('../database/index')
const bcrypt = require('bcrypt')

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    if (!username || !password) {
      return res.status(400).json({ message: 'must input a username and password' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({ username, password: hashedPassword });
    const userID = newUser.id;
    const user_name = newUser.username;

    return res.status(201).json({ message: 'Registration successful.', newUser, userID, user_name });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// User login
router.post('/login', passport.authenticate('local'), (req, res) => {
  const user_id = req.user.id;
  const user_name = req.user.username;
  console.log('this is the current user id/name ---------->', user_id, user_name)
  return res.json({ message: 'Login successful.', user_id, user_name });
});

// // checking if user is logged in
// router.get('/check', (req, res) => {
//   if (req.isAuthenticated()) {
//     const userID = req.user.id;
//     const user_name = req.user.username;
//     return res.json({ message: 'Authenticated', userID, user_name });
//   }
//   res.status(401).json({ message: 'Not authenticated.' });
// });

// User logout
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logout successful.' });
});

module.exports = router;