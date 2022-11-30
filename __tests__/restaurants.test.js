const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const testUser = {
  firstName: 'Test User',
  lastName: 'Testing User',
  email: 'user@testing.com',
  password: '123456789',
};

const registerAndLogin = async () => {
  const agent = request.agent(app);
  const user = await UserService.create(testUser);
  await agent
    .post('/api/v1/users/sessions')
    .send({ email: testUser.email, password: testUser.password });
  return [agent, user];
};

describe('restaurants routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  test('GET api/v1/restaurants should return a list of restaurants', async () => {
    const res = await request(app).get('/api/v1/restaurants');
    expect(res.status).toBe(200);
    expect(res.body).toMatchInlineSnapshot(`
      Array [
        Object {
          "cost": 1,
          "cuisine": "American",
          "id": "1",
          "image": "https://media-cdn.tripadvisor.com/media/photo-o/05/dd/53/67/an-assortment-of-donuts.jpg",
          "name": "Pip's Original",
          "website": "http://www.PipsOriginal.com",
        },
        Object {
          "cost": 3,
          "cuisine": "Italian",
          "id": "2",
          "image": "https://media-cdn.tripadvisor.com/media/photo-m/1280/13/af/df/89/duck.jpg",
          "name": "Mucca Osteria",
          "website": "http://www.muccaosteria.com",
        },
        Object {
          "cost": 2,
          "cuisine": "Mediterranean",
          "id": "3",
          "image": "https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/f2/e5/0c/dinner.jpg",
          "name": "Mediterranean Exploration Company",
          "website": "http://www.mediterraneanexplorationcompany.com/",
        },
        Object {
          "cost": 2,
          "cuisine": "American",
          "id": "4",
          "image": "https://media-cdn.tripadvisor.com/media/photo-o/0d/d6/a1/06/chocolate-gooey-brownie.jpg",
          "name": "Salt & Straw",
          "website": "https://saltandstraw.com/pages/nw-23",
        },
      ]
    `);
  });

  test('GET api/v1/restaurants/:id should return a restaurant with reviews', async () => {
    const res = await request(app).get('/api/v1/restaurants/1');
    // expect(res.status).toBe(200);
    expect(res.body).toMatchInlineSnapshot(`
      Object {
        "cost": 1,
        "cuisine": "American",
        "id": "1",
        "image": "https://media-cdn.tripadvisor.com/media/photo-o/05/dd/53/67/an-assortment-of-donuts.jpg",
        "name": "Pip's Original",
        "reviews": Array [
          Object {
            "detail": "Best restaurant ever!",
            "id": "1",
            "restaurant_id": "1",
            "stars": 5,
            "user_id": "1",
          },
          Object {
            "detail": "Terrible service.",
            "id": "2",
            "restaurant_id": "1",
            "stars": 1,
            "user_id": "2",
          },
          Object {
            "detail": "It was fine.",
            "id": "3",
            "restaurant_id": "1",
            "stars": 4,
            "user_id": "3",
          },
        ],
        "website": "http://www.PipsOriginal.com",
      }
    `);
  });

  test('POST /api/v1/restaurants/:id/reviews should create a new review when logged in', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.post('/api/v1/restaurants/1/reviews').send({
      stars: 5,
      detail: 'This is urgent. I have something to say. Call the fire brigade.',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchInlineSnapshot(`
      Object {
        "detail": "This is urgent. I have something to say. Call the fire brigade.",
        "id": "4",
        "restaurant_id": "1",
        "stars": 5,
        "user_id": "4",
      }
    `);
  });
  it('DELETE /api/v1/reviews/:id should delete a review', async () => {
    const [agent] = await registerAndLogin();
    await agent
      .post('/api/v1/restaurants/1/reviews')
      .send({ detail: 'another new review, a hot take, opinion soup and influence', stars: 2 });
    const res = await agent
      .delete('/api/v1/reviews/1')
      .send({ message: 'Thank god this review was deleted!' });
    expect(res.status).toBe(200);
    const deleteCheck = await agent.get('/api/v1/reviews/1');
    expect(deleteCheck.status).toBe(404);
  });
});
