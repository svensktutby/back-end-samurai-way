import request from 'supertest';

import { app, HTTP_STATUS } from '../../src';

describe('/courses/', () => {
  beforeAll(async () => {
    await request(app)
      .delete('/__test__/data')
      .expect(HTTP_STATUS.NO_CONTENT_204);
  });

  it('GET returns an empty list of courses', async () => {
    await request(app)
      .get('/courses')
      .expect(HTTP_STATUS.OK_200, []);
  })

  it('GET returns 404 when there is no target course', async () => {
    await request(app)
      .get('/courses/99999')
      .expect(HTTP_STATUS.NOT_FOUND_404);
  })

  it('POST does not create a new course', async () => {
    await request(app)
      .post('/courses')
      .send({ title: '' })
      .expect(HTTP_STATUS.BAD_REQUEST_400);

    await request(app)
      .get('/courses')
      .expect(HTTP_STATUS.OK_200, []);
  })

  it('POST creates a new course', async () => {
    const createdResponse = await request(app)
      .post('/courses')
      .send({ title: 'test course' })
      .expect(HTTP_STATUS.CREATED_201);

    expect(createdResponse.body).toEqual( { id: expect.any(Number), title: 'test course' } );

    await request(app)
      .get('/courses')
      .expect(HTTP_STATUS.OK_200, [createdResponse.body]);
  })

  /*it('PUT updates an existing course', () => {
    // TODO
  })

  it('DELETE deletes an existing course', () => {
    // TODO
  })

  it('GET returns a single course by ID', () => {
    // TODO
  })

  it('GET returns courses filtered by title', () => {
    // TODO
  })*/
})