const express = require('express');
const hbs = require('express-handlebars');
const path = require('path')
const bodyParser = require('body-parser');
const router = require('express').Router();

router.get('/', (req,res) => {
    res.render("index.hbs")
})

module.exports = router;
