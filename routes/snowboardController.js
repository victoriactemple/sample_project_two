const express = require('express')
const router = express.Router({mergeParams: true})

const Schema = require("../db/schema.js");
const CompanyModel = Schema.CompanyModel;

router.get('/', (req, res) => {
    // res.send(`Company ID: ${req.params.companyId}`)
    const companyId = req.params.companyId

    //can't find snowboards on their own, we need to find the company 
    //grab the schema and paste above
    CompanyModel.findById(companyId)
        .then((company) => {
            //grab the array of snowboards off the object
            const snowboards = company.snowboards
            res.render('snowboards/index', {
                //pass these things individually
                // companyName: company.name,
                // snowboards: snowboards
                company: company
            })
        })
        .catch((error) => {
            console.log(error)
        })
})

module.exports = router