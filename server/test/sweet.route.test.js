import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import {Sweet} from '../model/sweet.model.js';
import dotenv from 'dotenv';

dotenv.config();

let connection

beforeAll(async () => {
    const test_db_url = process.env.TEST_DB_URL
    connection = await mongoose.createConnection(test_db_url)
})

afterAll(async () => { 
    await connection.close();
})

describe('POST /api/v1/sweet/add-item', () => {
    it('should create new sweet', async () => {
        const sweet = {
            name: 'Apple pie',
            category: 'pastry',
            price: 20,
            quantity: 10,
        }

        const res = await request(app).post('/api/v1/sweet/add-item').send(sweet)

        expect(res.statusCode).toBe(201)
        expect(res.body.body).toEqual("Sweet added.")
    })

    it('should fail when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/sweet/add-item')
      .send({ name: 'EmptySweet' }); 
    expect(res.statusCode).toBe(400);
  });
})


describe('POST /api/v1/sweet/delete-sweet', () => {

    it('should delete an existing sweet', async () => {
        const sweet = await Sweet.create({
            name: 'Chocolate Cake',
            category: 'chocolate',
            price: 30,
            quantity: 5,
        });

        const res = await request(app)
            .post('/api/v1/sweet/delete-sweet')
            .send({ sweetId: sweet._id });

        expect(res.statusCode).toBe(200);
        expect(res.body.body).toEqual('Item deleted.');
    });

    it('should return 400 if sweetId not provided', async () => {
        const res = await request(app)
            .post('/api/v1/sweet/delete-sweet')
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.body).toEqual('Id not provided.');
    });

    it('should return 400 if sweet not found', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .post('/api/v1/sweet/delete-sweet')
            .send({ sweetId: fakeId });

        expect(res.statusCode).toBe(400);
        expect(res.body.body).toEqual('Sweet not found.');
    });

});

describe('POST /api/v1/sweet/buy-sweet', () => {

    it('should buy sweet successfully', async () => {
        const sweet = await Sweet.create({
            name: 'Danish pastry',
            category: 'pastry',
            price: 30,
            quantity: 20,
        });

        const res = await request(app)
            .post('/api/v1/sweet/buy-sweet')
            .send({ sweetId: sweet._id, quantity: 5 });

        expect(res.statusCode).toBe(200);
        expect(res.body.body).toEqual('Sweet bought successfully.');

        const updatedSweet = await Sweet.findById(sweet._id);
        expect(updatedSweet.quantity).toBe(15);
    });

    it('should return 400 if sweetId or quantity missing', async () => {
        const res = await request(app)
            .post('/api/v1/sweet/buy-sweet')
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.body).toEqual('Please provide the details.');
    });

    it('should return 400 for invalid quantity', async () => {
        const sweet = await Sweet.create({
            name: 'Baklava',
            category: 'pastry',
            price: 10,
            quantity: 10,
        });

        const res = await request(app)
            .post('/api/v1/sweet/buy-sweet')
            .send({ sweetId: sweet._id, quantity: -5 });

        expect(res.statusCode).toBe(400);
        expect(res.body.body).toEqual('Please provide a valid positive number.');
    });

    it('should return 400 if quantity exceeds available stock', async () => {
        const sweet = await Sweet.create({
            name: 'Baklava',
            category: 'chocolate',
            price: 15,
            quantity: 3,
        });

        const res = await request(app)
            .post('/api/v1/sweet/buy-sweet')
            .send({ sweetId: sweet._id, quantity: 5 });

        expect(res.statusCode).toBe(400);
        expect(res.body.body).toEqual('Not much quantity.');
    });

});


describe('POST /api/v1/sweet/add-quantity', () => {

    it('should add quantity successfully', async () => {
        const sweet = await Sweet.create({
            name: 'Starburst',
            category: 'candy',
            price: 20,
            quantity: 10,
        });

        const res = await request(app)
            .post('/api/v1/sweet/add-quantity')
            .send({ sweetId: sweet._id, quantity: 5 });

        expect(res.statusCode).toBe(200);
        expect(res.body.body).toEqual('Quantity updated.');

        const updatedSweet = await Sweet.findById(sweet._id);
        expect(updatedSweet.quantity).toBe(15);
    });

    it('should return 400 if sweetId or quantity missing', async () => {
        const res = await request(app)
            .post('/api/v1/sweet/add-quantity')
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.body).toEqual('Please provide proper details.');
    });

    it('should return 400 for invalid quantity', async () => {
        const sweet = await Sweet.create({
            name: 'Peanut Butter Cups',
            category: 'candy',
            price: 20,
            quantity: 8,
        });

        const res = await request(app)
            .post('/api/v1/sweet/add-quantity')
            .send({ sweetId: sweet._id, quantity: -2 });

        expect(res.statusCode).toBe(400);
        expect(res.body.body).toEqual('Provide proper positive number.');
    });
});


describe('POST /api/v1/sweet/search', () => {

    it('should return all sweets when no filters applied', async () => {
        await Sweet.create([
            { name: 'Kit Kats', category: 'candy', price: 15, quantity: 30 },
            { name: 'Butter Cups', category: 'candy', price: 10, quantity: 40 },
        ]);

        const res = await request(app)
            .post('/api/v1/sweet/search')
            .send({});

        expect(res.statusCode).toBe(200);
    });

    it('should filter sweets by category', async () => {
        await Sweet.create([
            { name: 'White Chocolate', category: 'chocolate', price: 25, quantity: 10 },
            { name: 'Dark Chocolate', category: 'chocolate', price: 20, quantity: 15 },
        ]);

        const res = await request(app)
            .post('/api/v1/sweet/search')
            .send({ category: 'chocolate' });

        expect(res.statusCode).toBe(200);
        expect(res.body.body[0].category).toBe('chocolate');
    });

    it('should filter sweets by maxValue', async () => {
        await Sweet.create([
            { name: 'Flaky', category: 'pastry', price: 5, quantity: 100 },
            { name: 'Dark Chocolate', category: 'chocolate', price: 50, quantity: 20 },
        ]);

        const res = await request(app)
            .post('/api/v1/sweet/search')
            .send({ maxValue: 10 });

        expect(res.statusCode).toBe(200);
    });

});
