const express = require('express')
const router = express.Router({mergeParams: true})

const Schema = require("../db/schema.js");
const CompanyModel = Schema.CompanyModel;


// index route for the snowboards

router.get('/', (req, res) => {
    // res.send(`Company ID: ${req.params.companyId}`)
    const companyId = req.params.companyId

    //can't find snowboards on their own, we need to find the company 
    //grab the schema and paste above
    CompanyModel.findById(companyId)
        .then((company) => {
            //grab the array of snowboards off the object
            // const snowboards = company.snowboards
            res.render('snowboards/index', {
                //pass these things individually
                // companyName: company.name,
                // snowboards: snowboards

                //just
                company: company
            })
        })
        .catch((error) => {
            console.log(error)
        })
})


// NEW ROUTE
// Create a new showboard and display an empty form 

// Why do we need the company id? To know which company we're posting the new snowboard to later

router.get('/new', (req, res) => {
    const companyId = req.params.companyId

    res.render('snowboards/new', {
        companyId: companyId
    })
})


// CREATE ROUTE so you can see the new snowboard that was created

router.post('/', (req, res) => {
    const companyId = req.params.companyId
    const newSnowboard = req.body

    CompanyModel.findById(companyId)
    .then((company) => {

        //push the new snowboard to the array of snowboards
        company.snowboards.push(newSnowboard)
        // sve the snowboard created to the database

        return company.save()
    })
    .then((company) => {
        //redirect to let whole list of snowboards
        res.redirect(`/companies/${companyId}/snowboards`)
    })
})


// Edit one Snowboard

router.get('/:snowboardId/edit', (req, res) => {
    const companyId = req.params.companyId
    const snowboardId = req.params.snowboardId

    CompanyModel.findById(companyId)
    .then((company) => {
        const snowboard = company.snowboards.id(snowboardId)
        res.render('snowboards/edit', {
            //renders the form and the prepopulated form with preexisting data
            snowboard: snowboard,
            companyId: companyId
        })
        
    })
    .catch((error) => {
        console.log(error)
    })
})


//UPDATE Route
//capture the information from the user's input on the form

router.put('/:snowboardId', (req, res) => {
    const companyId = req.params.companyId
    const snowboardId = req.params.snowboardId
    const updatedSnowboard = req.body


    //finding something from the DB

    CompanyModel.findById(companyId)
    .then((company) => {
        const snowboard = company.snowboards.id(snowboardId)

//performing whatever action you want to do with it
//map all the values from the form and change them which changed the obkect

        snowboard.name = updatedSnowboard.name
        snowboard.price = updatedSnowboard.price

 // saving the modified thing to the DB

        return company.save()

       
    })
    .then(() => {
        //redirect back to that one single snowboard
        res.redirect(`/company/${companyId}/snowboards/${snowboardId}`)
    })
    
})

// SHOW Route

router.get('/:snowboardId', (req, res) => {
    const companyId = req.params.companyId
    const snowboardId = req.params.snowboardId

    CompanyModel.findById(companyId)
        .then((company) => {
            const snowboard = company.snowboards.id(snowboardId)

            res.render('snowboards/show', {
                snowboard: snowboard,
                companyId: companyId
                // I might want to have some links in the show page to Edit and Delete from the company, so you need to pass in the company Id here. This was refactored later in the process

            })
        })
        .catch((error) => {
            console.log(error)
        })
})


router.get('/:snowboardId/delete', (req, res) => {
    const companyId = req.params.companyId
    const snowboardId = req.params.snowboardId

    CompanyModel.findById(companyId)

    //ind the fcomapny the snowboard belongs to 
    .then((company) => {
        //find the thing by Id and use the mongoose helper, .remove
        const snowboard = company.snowboards.id(snowboardId).remove
        return company.save()
    })
    .then(() => {
        res.redirect(`/companies/${companyId}/snowbards`)
    })

})



module.exports = router