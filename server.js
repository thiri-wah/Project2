var express = require("express");
var db = require('./db-connections');
var app = express();
app.use(express.json());
 app.use(express.static("./public"));

app.route("/vending_machine").get(function (req,res){
    var sql =  `SELECT 
    vending_machine.vending_machine_id,
    location.school, 
    location.block, 
    location.floor, 
    vending_machine.vending_image, 
    vending_machine.vendor_name, 
    status.status_name, 
    GROUP_CONCAT(payment_method.payment_name SEPARATOR ', ') AS payment_methods 
    FROM ((((vending_machine 
    JOIN status ON vending_machine.status_id = status.status_id) 
    JOIN location ON vending_machine.location_id = location.location_id) 
    JOIN vending_payment ON vending_machine.vending_machine_id = vending_payment.vending_id) 
    JOIN payment_method ON vending_payment.payment_id= payment_method.payment_id) 
    GROUP BY vending_machine.vending_machine_id, location.school, location.block, location.floor, vending_machine.vending_image, vending_machine.vendor_name, status.status_name 
    ORDER BY vending_machine.vending_machine_id ASC`;

    db.query(sql, function(error, result){ 
        if(error) 
        {
            throw error;
        }
        else{
            res.json(result);
        }
    });

});

app.route("/vending_item/:id").get(function (req,res){
    var sql =  `SELECT 
    vending_machine.vending_machine_id,
    vending_item.vending_item_id,
    item.item_name, 
    item.item_cost, 
    item.availability,
    item.item_image
    FROM item
    JOIN vending_item ON item.item_id = vending_item.item_id
    JOIN vending_machine ON vending_item.vending_machine_id = vending_machine.vending_machine_id
    WHERE vending_item.vending_machine_id =?`;
    var parameter=[req.params.id];
    db.query(sql, parameter,function(error, result){
        if(error) 
        {
            throw error; // If there is an error, throw it (this will crash the app)
        }
        else{
            res.json(result);// If the query is successful, send the results as a JSON response
        }
    });

});

app.route("/vending_machine/:id").get(function(req,res){
    var sql = `SELECT vending_machine.vending_machine_id FROM vending_machine WHERE vending_machine.vending_machine_id=?`;
    var parameter = [req.params.id];
    db.query(sql, parameter,function(error, result){
        if(error) 
        {
            throw error; // If there is an error, throw it (this will crash the app)
        }
        else{
            res.json(result);// If the query is successful, send the results as a JSON response
        }
    });
});

app.route("/add_item/:id").post(function(req,res){
    var sql = `INSERT INTO 
    vending_machine.item 
    (item_id, item_name, item_cost, item_image, availability, item_quantity) 
    VALUES (?,?,?,?,?,?)
    INSERT INTO vending_machine.vending_item
    (vending_item_id, vending_machine_id, item_id) VALUES (?,?,?)`;
    var parameter =[req.body.item_name, req.body.item_cost, req.body.item_image, req.item.availability, req.body.item_quantity, req.body.vending_machine_id];
});


app.route("/vending_item/:id").delete(function (req,res){
    var sql = "DELETE FROM vending_machine.vending_item WHERE vending_item.vending_item_id = ?";
    var parameter = [req.params.id];
    //Perform database query
    db.query(sql, parameter, function(error, result){
        if(error)
        {
            throw error;
        }
        else{
            res.json(result);
        }
    });
    
});

app.listen(8080, "127.0.0.1");
console.log("Webserver is started on http://127.0.0.1:8080");