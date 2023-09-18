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

//get by promptId
router.get('/:promptId', (req, res) => {
  const { promptId } = req.params;
  Badges.findOne({
    where: {
      promptId: promptId
    }
  })
    .then((badgeData) => {
      res.status(200).send(badgeData);
    })
    .catch(() => [
      res.sendStatus(500)
    ])
})

//changes badges by promptId
router.put('/:promptId', (req, res) => {
  const { promptId } = req.params;
  const { changes } = req.body
  Badges.update( 
    {
      mostLikes: changes.mostLikes,
      mostWordMatchCt: changes.mostWordMatchCt
    },
    {where: {promptId: promptId}}
  )
    .then((data) => {
      console.log(data);
      res.sendStatus(201)
    })
    .catch(() => {
      res.sendStatus(500)
    })
})

module.exports = router;