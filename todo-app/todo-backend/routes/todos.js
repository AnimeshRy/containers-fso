const { response } = require('express');
const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redisClient = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
    let value = await redisClient.getAsync("added_todos");
    value = parseInt(value)
    await redisClient.setAsync("added_todos", value+=1)
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
    res.json(req.todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
    const body = req.body
    console.log(body);
    const todo = {
        text: body.text,
        done: body.done,
    }
    Todo.findByIdAndUpdate(req.todo.id, todo, { new: true })
    .then((changedRecord) => {
      res.json(changedRecord);
    })
    .catch((error) => res.sendStatus(405));
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
