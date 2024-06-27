import express, { Request, Response } from 'express'

const app = express()
const port = process.env.PORT || 3000;

const HTTP_STATUS = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,
  BAD_REQUEST_400: 400,
  UNAUTHORIZED_401: 401,
  FORBIDDEN_403: 403,
  NOT_FOUND_404: 404,
  INTERNAL_SERVER_ERROR_500: 500,
};

const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

const db = {
  courses: [
    {id: 1, title: 'front-end'},
    {id: 2, title: 'back-end'},
    {id: 3, title: 'automation qa'},
    {id: 4, title: 'devops'},
  ]
};

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello Developer!')
})

app.get('/courses', (req, res) => {
  let foundCoursesQuery = db.courses;

  if (req.query.title) {
    foundCoursesQuery = foundCoursesQuery.filter(course => course.title.indexOf(req.query.title as string) > -1)
  }

  res.json(foundCoursesQuery)
})

app.get('/courses/:id', (req, res) => {
  const foundCourse = db.courses.find(course => course.id === Number(req.params.id));

  if (!foundCourse) {
    res.status(HTTP_STATUS.NOT_FOUND_404).send('Course not found')
  } else {
    res.json(foundCourse)
  }
})

app.post('/courses', (req, res) => {
  if (!req.body.title) {
    res.status(HTTP_STATUS.BAD_REQUEST_400).send('title is required')
  } else {
    const createdCourse = {
      id: db.courses.length + 1,
      title: req.body.title,
    };

    db.courses.push(createdCourse)

    res.status(HTTP_STATUS.CREATED_201).json(createdCourse)
  }
})

app.put('/courses/:id', (req, res) => {
  if (!req.body.title) {
    res.status(HTTP_STATUS.BAD_REQUEST_400).send('title is required')
    return;
  }

  const foundCourse = db.courses.find(course => course.id === Number(req.params.id));

  if (!foundCourse) {
    res.status(HTTP_STATUS.NOT_FOUND_404).send('Course not found')
  } else  {
    foundCourse.title = req.body.title;
    res.status(HTTP_STATUS.NO_CONTENT_204).json(foundCourse)
  }
})

app.delete('/courses/:id', (req, res) => {
  if (!req.params.id) {
    res.status(HTTP_STATUS.NOT_FOUND_404).send('Course not found')
  } else {
    db.courses = db.courses.filter(course => course.id !== Number(req.params.id));
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})