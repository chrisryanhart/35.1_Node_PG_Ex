process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('../app.js');
const db = require('../db.js');

let new_invoice;


beforeEach(async () => {
    // await db.query(`
    //     DELETE FROM companies 
    //     WHERE code='cisco'`);

    // await db.query(`
    //     DELETE FROM companies 
    //     WHERE code='bogus'`);
    await db.query(`
    DELETE FROM invoices 
    WHERE id>4`);
    console.log('1-beforeEach');
    let result = await db.query(`
        INSERT INTO
            invoices (comp_code,amt) VALUES ('ibm','1000')
        RETURNING id, comp_code, amt, paid, add_date, paid_date`);
 
    new_invoice = result.rows[0];
})

afterEach(async () => {
    // await db.query(`
    //     DELETE FROM invoices 
    //     WHERE id>4`);
    console.log('1-afterEach');
});


afterAll(async () => {
    // await db.end();
});

describe('GET /invoices', function(){
    test('Gets a list of invoices', async () => {
        const resp = await request(app).get('/invoices');

        expect(resp.body.invoices.length).toEqual(5);
        expect(resp.status).toEqual(200);
    });
});

describe('GET /invoices/:id', function(){
    test('Gets a single voice', async () => {

        const resp = await request(app).get(`/invoices/${new_invoice.id}`);

        expect(resp.body.invoice).toEqual(expect.any(Object));
        expect(resp.status).toEqual(200);
    });

    test('Returns error when invoice not found', async () => {

        const resp = await request(app).get(`/invoices/0`);

        expect(resp.status).toEqual(404);
        expect(resp.body.message).toEqual('No invoice found!');
    });
});


describe('POST /invoices', function(){
    test('Posts a new invoice', async () => {

        const invoice = {"comp_code":"apple","amt":"2000"}

        const resp = await request(app).post(`/invoices`).send(invoice);

        expect(resp.body.invoice.comp_code).toEqual('apple');
        expect(resp.body.invoice.amt).toEqual(2000);

        expect(resp.status).toEqual(200);
    });
});


describe('PUT /invoices/:id', function(){
    test('Updates an invoice', async () => {
        
        const amt = {"amt": "1"};

        const resp = await request(app).put(`/invoices/${new_invoice.id}`).send(amt);

        expect(resp.body.invoice.amt).toEqual(1);
        expect(resp.status).toEqual(200);
    });

    test('Returns error when invoice not found', async () => {

        const amt = {"amt": "1"};
        const resp = await request(app).put(`/invoices/0`).send(amt);

        expect(resp.status).toEqual(404);
        expect(resp.body.message).toEqual('No invoice found!');
    });
});


describe('DELETE /invoices/:id', function(){
    test('Deletes an invoice', async () => {
        jest.setTimeout(30000);

        const amt = {"amt": "1"};

        const resp = await request(app).delete(`/invoices/${new_invoice.id}`);

        expect(resp.body).toEqual({status:"deleted"});
        expect(resp.status).toEqual(200);
    },30000);

    test('Returns error when invoice not found', async () => {

        const resp = await request(app).delete(`/invoices/0`);

        expect(resp.status).toEqual(404);
        expect(resp.body.message).toEqual('No invoice found!');
    });
});