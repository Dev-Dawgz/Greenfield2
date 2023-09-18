const express = require('express');
const router = express.Router();
const { User } = require('../database/index')

//User GET request by username
router.get('/:username', (req, res) => {
  const { username } = req.params;
  User.findAll({
    where: {
      username: username
    },
  })
  .then((userInfo) => {
    res.send(userInfo).status(200);
  })
  .catch((err) => {
    console.error('Could not GET user data', err);
    res.sendStatus(500);
  })
});

// router.get('/:id', (req, res) => {
//   const { id } = req.params;
//   User.findByPk(id)
//     .then((userdata) => {
//       res.send(userdata).status(200);
//     })
//     .catch((err) => {
//       console.error('Could not GET user data by id', err)
//       res.sendStatus(500);
//     })
// });

//creates new user
router.post('/', (req, res) => {
  const { newUser } = req.body;
  User.create(newUser)
    .then(() => {
      console.log('successfully added new user');
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error('user post handler failed', error)
      res.sendStatus(500);
    })
})

// API route to get user information
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    // Return user data if authenticated
    res.json({ user: req.user });
  } else {
    // Return an empty object if not authenticated
    res.json({});
  }
});

//post to update user badges
router.post('/badges/:id/:value', (req, res) => {
  const { id, value } = req.params;

  User.findByPk(id)
  .then((user) => {

      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }

      if(user.badges === null || !user.badges) {
        user.badges = `${value}+`;
      } else {
        user.badges += `${value}+`;
      }

      return user.save()
        .then(() => {
          res.status(201).send({ message: 'Action successful' });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send({ error: 'Internal server error' });
        });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500)
    });
});

// Define a route to update the username
router.put('/:userId', (req, res) => {
  const userId = req.params.userId;
  const newUsername = req.body.username;

  // Validate the new username
  if (!newUsername) {
    return res.status(400).json({ message: 'Must input a username' });
  }

  // Assuming you have a User model, update the username
  User.update(
    { username: newUsername },
    { where: { id: userId } }
  )
    .then((result) => {
      if (result[0] === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Handle success
      res.status(200).json({ message: 'Username updated successfully' });
    })
    .catch((error) => {
      // Handle error
      console.error('Error updating username:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// //post to update badge string in user
// router.post('/update/:id/:value', (req, res) => {
//   const { id, value } = req.params;
//   const oldInfo = User.findByPk(id).then(user => user.badges)

//   User.upsert({
//     id: id,
//     badges: `${User.findByPk(id).then(user => user.badges)}+${value}`
//   })
//   .then(() => res.sendStatus(201))
//   .catch(() => res.sendStatus(500))
// });



module.exports = router;