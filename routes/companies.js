const db = require('../db.js');

const express = require('express');
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
})

router.get('/:code', async function(req,res,next){
    try {

        const code = req.params.code;

        const results = await db.query(
            `SELECT *
            FROM companies
            WHERE code=$1;`, [code]
        );
        return res.json({"company": results.rows[0]});
    } catch(e){
        next(e);
    }
})


module.exports = router;