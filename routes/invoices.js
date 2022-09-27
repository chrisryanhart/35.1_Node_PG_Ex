const db = require('../db.js');

const express = require('express');
const ExpressError = require('../expressError.js');
const router = new express.Router();



router.get('/', async function(req,res,next){
    try {
        const results = await db.query(
            `SELECT *
            FROM invoices;`
        );
        return res.json({"invoices": results.rows});
    } catch(e){
        next(e);
    }
});


router.get('/:id', async function(req,res,next){
    try {
        const results = await db.query(
            `SELECT * FROM invoices 
            INNER JOIN companies 
            ON invoices.comp_code = companies.code 
            WHERE id=$1;`, [req.params.id]
        );
        if (results.rows.length === 0){
            throw new ExpressError('No invoice found!',404);
        }
        return res.json({"invoice": {"id":results.rows[0].id, "amt":results.rows[0].amt, "paid":results.rows[0].paid, "add_date":results.rows[0].add_date, "paid_date":results.rows[0].paid_date, 
            "company": {"code":results.rows[0].code, "name":results.rows[0].name, "description":results.rows[0].description}}});
    } catch(e){
        next(e);
    }
});

router.post('/', async function(req,res,next){
    try {
        const {comp_code, amt} = req.body;

        const results = await db.query(
            `INSERT INTO invoices (comp_code,amt)
            VALUES ($1, $2)
            RETURNING id,comp_code,amt,paid,add_date,paid_date`, [comp_code,amt]
        );
        return res.json({"invoice": results.rows[0]});
    } catch(e){
        next(e);
    }
});

router.put('/:id', async function(req,res,next){
    try {
        const id = req.params.id;
        const {amt} = req.body;

        const results = await db.query(
            `UPDATE invoices SET amt=$1
            WHERE id=$2
            RETURNING id,comp_code,amt,paid,add_date,paid_date`, [amt,id]
        );
        if (results.rows.length === 0){
            throw new ExpressError('No invoice found!',404);
        }
        return res.json({"invoice":results.rows[0]});
    } catch(e){
        next(e);
    }
});

router.delete('/:id', async function(req,res,next){
    try {
        const id = req.params.id;

        const results = await db.query(
            `DELETE FROM invoices
            WHERE id=$1`, [id]
        );
        if (results.rowCount === 0){
            throw new ExpressError('No invoice found!',404);
        }
        return res.json({"status":"deleted"});
    } catch(e){
        next(e);
    }
});


















module.exports = router;