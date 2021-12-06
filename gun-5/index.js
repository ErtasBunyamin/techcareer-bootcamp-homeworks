const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

var _ = require('lodash');
var colors = require('colors');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const port = 8080;

let suppliers = require('./suppliers');
//get all suppliers with order
app.get('/api/suppliers', function (req, res) {
    let orderBy = req.query.orderBy;


    if (orderBy == undefined ) {
        res.json(suppliers);
    } else if (orderBy == 'asc') {
        orderedSuppliers = _.orderBy(suppliers, ['contactName'], ['asc']);
        res.json(orderedSuppliers);
    } else if (orderBy == 'desc') {
        orderedSuppliers = _.orderBy(suppliers, ['contactName'], ['desc']);
        res.json(orderedSuppliers);
    }
});

// get supplier by id
app.get('/api/suppliers/:id',(req, res) => {
    let supplierId = req.params.id;
    console.log(("id : "+supplierId).blue)
    let filteredSuppliers = suppliers.filter(q => q.id == supplierId);
    res.json(filteredSuppliers);
})

// put supplier by id
app.post('/api/suppliers',

    body('companyName').notEmpty(),
    body('contactName').notEmpty()
        .withMessage("ContactName alanı boş geçilemez"),
    body('contactTitle').notEmpty(), 
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        var newSupplierId = suppliers[suppliers.length - 1].id + 1;

        var newSupplier = {
            companyName: req.body.companyName,
            contactName: req.body.contactName,
            contactTitle: req.body.contactTitle,
            id: newSupplierId
        }

        suppliers.push(newSupplier);

        res.status(201).json(newSupplier);

    });

app.delete("/api/suppliers/:id", function (req, res) {

    var supplierId = req.params.id;

    // console.log(("Before length: " + productsData.length + "").red);
    console.log(`Before length: ${suppliers.length}`.red);


    suppliers = suppliers.filter(q => q.id != supplierId);

    console.log(("After length: " + suppliers.length + "").blue);

    res.json({})

});

app.put("/api/suppliers",
    body('id').notEmpty(),
    body('contactName').notEmpty(),
    function (req, res) {
        // check validation
        const errors = validationResult(req);
        if(!errors.isEmpty) {
            res.send(errors);
        }
        // check supplier id
        var supplierId = req.body.id;
        var contactName = req.body.contactName;
        var supplier = suppliers.find(q => q.id == supplierId);
        if(supplier) {
            supplier.contactName = contactName;
            res.send(supplier);
        } else {
            res.status(400).send("record not found");
        }
    }
);

let { orders } = require('./orders');

app.get("/api/orders",
    body('month').isNumeric(),
    body('year').isNumeric(), 
    (req, res) => {
        var errors = validationResult(req);
        if(!errors.isEmpty)
            res.send(errors);
        var month =req.query.month;
        var year =req.query.year;
        if(month != undefined && year != undefined) {
            var startDate = new Date(`${year}-${month}-1`);
            var resultOrders = orders.filter(q => {
                let orderDate = new Date (q.orderDate);
                return orderDate.getFullYear() == startDate.getFullYear() 
                && orderDate.getMonth() == startDate.getMonth();
            });
            console.log(`getting data by date ${year}-${month} : ${resultOrders.length}`.magenta);
            res.json(resultOrders);
        } else {
            console.log(`getting all data : ${orders.length}`.bgMagenta);
            res.json(orders);
        }
    }
);

app.listen(port, () => {
    console.log("Sunucu calisiyor...".red);
});