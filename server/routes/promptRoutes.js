const express = require('express');
const router = express.Router();
const { Prompt } = require('../database/index'); 

router.post('/', (req, res) => {
  Prompt.create(req.body)
    .then(() => {
      console.log('successfully added new prompt');
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error('prompt post handler failed', error)
      res.sendStatus(500);
    })
})

//get prompt by prompt id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Prompt.findOne({
    where: {id: id}
  })
  .then((promptObj) => {
    res.status(200).send(promptObj);
  })
  .catch((err) => {
    console.error(err.message);
    res.status(404);
  })
})

//Get all prompts
router.get('/', (req,res) => {
 // const { } = req.params;
  Prompt.findAll({})
    .then((promptData) => {
      res.send(promptData).status(200);
    })
    .catch((err) => {
      console.error('Could not Get all prompts', err);
      res.sendStatus(500);
    });
})

//Get last prompt submitted
router.get('/find/last', (req,res) => {
  Prompt.findAll({
    limit: 1,
    order: [['id', 'DESC']]
  })
    .then((lastPrompt) => {
      res.send(lastPrompt).status(200);
    })
    .catch((err) => {
      console.error('Could not Get last prompt submitted', err);
      res.sendStatus(500);
    });
})

module.exports = router;