const request = require('supertest');

const User = require('../src/models/User');
const app = require('../src/app');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);


test('Should signup a new user', async () =>
{
    const response = await request(app).post('/users').send(
        {
            name:'Miguel',
            email:'miguel.panuto@live.com',
            password:'asdwd2wadfwaf'
        }).expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
    
    expect(response.body).toMatchObject(
    {
        user:{
            name: 'Miguel',
            email: 'miguel.panuto@live.com'
        }
    });
    expect(user.password).not.toBe('asdwd2wadfwaf');
});

test('Should login existing user', async () =>
{
    const response = await request(app).post('/users/login').send(
    {
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should fail to login', async () =>
{
    await request(app).post('/users/login').send(
    {
        email: userOne.email,
        password: 'userOne.password'
    }).expect(400);
});

test('Should get profile for user', async () =>
{
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get for unauthenticated user', async () =>
{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should delete account for user', async () =>
{
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('Should not delete account for user', async () =>
{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('Should upload avatar image', async () =>
{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profilepic.jpeg')
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () =>
{
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: 'Jack' })
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user.name).toBe('Jack');
});

test('Should not update invalid user fields', async () =>
{
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ location: 'Jack' })
        .expect(400);
});