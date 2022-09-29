process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('../app.js');
const db = require('../db.js');

let new_company;

// before each test, clean out data


beforeEach(async () => {
    await db.query(`
        DELETE FROM companies 
        WHERE code='cisco'`);

    await db.query(`
        DELETE FROM companies 
        WHERE code='bogus'`);

    let result = await db.query(`
        INSERT INTO
            companies (code,name,description) VALUES ('cisco','cisco_sys','internet_stuff')
        RETURNING code, name, description`);
 
    new_company = result.rows[0];
})

afterEach(async () => {
    await db.query(`
        DELETE FROM companies 
        WHERE code='cisco'`);
});


afterAll(async () => {
    await db.end();
});


describe('GET /companies', function(){
    test('Gets a list of companies', async () => {
        const resp = await request(app).get('/companies');

        expect(resp.status).toEqual(200);
        expect(resp.body.companies[0]).toEqual({code: 'apple', name: 'Apple Computer', description: 'Maker of OSX.'});
    });

});

describe('GET /companies/:code', function(){
    test('Gets a single company', async () => {
        const resp = await request(app).get(`/companies/${new_company.code}`);

        expect(resp.body.company.name).toEqual('cisco_sys');
        expect(resp.status).toEqual(200);
    });

    test('Returns error when company not found', async () => {
        const resp = await request(app).get(`/companies/random`);

        expect(resp.status).toEqual(404);
        expect(resp.body.message).toEqual('Company code not found!');
    });
});


describe('POST /companies', function(){
    test('Posts a new company', async () => {
        const company = {"code": "bogus", "name":"random_co","description":"Mysterious work"};
        const resp = await request(app).post('/companies').send(company);

        expect(resp.status).toEqual(200);
        expect(resp.body.company).toEqual({"code": "bogus", "name":"random_co","description":"Mysterious work"});
    });

});

describe('PUT /companies/:code', function(){
    test('Updates an existing company', async () => {
        const revision = {"name":"revised_co","description":"we do good work"};
        const resp = await request(app).put(`/companies/${new_company.code}`).send(revision);

        expect(resp.status).toEqual(200);
        expect(resp.body.company).toEqual({"code": "cisco", "name":"revised_co","description":"we do good work"});
    });
    test('Returns error when company not found', async () => {
        const revision = {"name":"revised_co","description":"we do good work"};
        const resp = await request(app).put(`/companies/random`).send(revision);

        expect(resp.status).toEqual(404);
        expect(resp.body.message).toEqual('Company code not found!');
    });
});

describe('DELETE /companies/:code', function(){
    test('Deletes an existing company', async () => {
        const resp = await request(app).delete(`/companies/${new_company.code}`);

        expect(resp.status).toEqual(200);
        expect(resp.body).toEqual({status: "deleted"});
    });
    test('Returns error when company not found', async () => {
        const revision = {"name":"revised_co","description":"we do good work"};
        const resp = await request(app).delete(`/companies/random`);

        expect(resp.status).toEqual(404);
        expect(resp.body.message).toEqual('Company code not found!');
    });
});