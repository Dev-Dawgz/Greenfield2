const express = require('express');
const router = express.Router();
const { Badges } = require('../database/index'); 

router.get('/', (req, res) => {
  Badges.findAll({})
    .then((badges) => {
      res.status(200).send(badges)
    })
    .catch((error) => {
      console.error('could not get all badges', error)
      res.sendStatus(500);
    })
})

//grabs latest badge created
router.get('/find/last', (req, res) => {
  Badges.findAll({
    limit: 1,
    order: [['id', 'DESC']]
  })
    .then((lastBadge) => {
      res.send(lastBadge).status(200);
    })
    .catch((err) => {
      console.error('Could not Get last badge submitted', err);
      res.sendStatus(500);
    });
})

//create new badge
router.post('/', (req, res) => {
  Badges.create(req.body)
    .then(() => {
      console.log('successfully added new badges');
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error('badges post handler failed', error)
      res.sendStatus(500);
    })
})

//get by id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Badges.findOne({
    where: {
      id: id
    }
  })
    .then((badgeData) => {
      res.status(200).send(badgeData);
    })
    .catch(() => [
      res.sendStatus(500)
    ])
})


//post to update winner status in badge
router.post('/update/:id', (req, res) => {
  const { id } = req.params;

  Badges.upsert({
    id: id,
    mostLikes: req.body.mostLikes,
    mostWordMatchCt: req.body.mostWordMatchCt,
    mostContributions: req.body.mostContributions
  })
  .then(() => res.sendStatus(201))
  .catch(() => res.sendStatus(500))
});

module.exports = router;