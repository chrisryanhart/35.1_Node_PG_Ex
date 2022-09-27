const db = require('../db.js');

const express = require('express');
const ExpressError = require('../expressError.js');
const router = new express.Router();


router.get('/', async function(req,res,next){
    try {
        const results = await db.query(
            `SELECT *
            FROM companies;`
        );
        return res.json({"companies": results.rows});
    } catch(e){
        next(e);
    }
});

router.get('/:code', async function(req,res,next){
    try {

        const code = req.params.code;

        const results = await db.query(
            `SELECT *
            FROM companies
            WHERE code=$1;`, [code]
        );
        const companyInvoice = await db.query(
            `SELECT *
            FROM invoices
            WHERE comp_code=$1`, [code]
        );

        if (results.rows.length === 0){
            throw new ExpressError('Company code not found!',404);
        }

        results.rows[0]['invoices'] = companyInvoice.rows

        return res.json({"company": results.rows[0]});
    } catch(e){
        next(e);
    }
});

router.post('/',async function(req,res,next){
    try {

        const {code, name, description } = req.body;

        const results = await db.query(
            `INSERT INTO companies
            VALUES ($1, $2, $3)
            RETURNING code, name, description`, [code, name, description]
        );
        return res.json({"company": results.rows[0]});
    } catch(e){
        next(e);
    }
});

router.put('/:code',async function(req,res,next){
    try {

        const { name, description } = req.body;

        const results = await db.query(
            `UPDATE companies SET name=$1, description=$2
            WHERE code=$3
            RETURNING code, name, description`, [name, description,req.params.code]
        );
        if (results.rows.length === 0){
            throw new ExpressError('Company code not found!',404);
        }
        return res.json({"company": results.rows[0]});
    } catch(e){
        next(e);
    }
});

router.delete('/:code',async function(req,res,next){
    try{
        const code = req.params.code;

        const results = await db.query(
            `DELETE FROM companies
            WHERE code=$1`, [code]
        );
        if (results.rowCount === 0){
            throw new ExpressError('Company code not found!',404);
        }
        return res.json({"status": "deleted"});
    } catch (e) {
        next(e);
    }
});

module.exports = router;