var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/index');
});
router.get('/index', function(req, res, next) {
    res.render('admin/index');
  });
  
//sql connection
var mysql=require("mysql");

connection=mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"root",
    database:"user_management"
});
connection.connect(function(err){
    if(err){
        throw err;
    }
    else{
        console.log("database is connected successfully")
    }
})

//adduser
router.post("/adduser",function(req,res){
    const firstname=req.body.firstname;
    const lastname=req.body.lastname;
    const phonenumber=req.body.phonenumber;
    const emailid=req.body.emailid;
    const address=req.body.address;
    insertquery=`insert into user_details (firstname,lastname,phonenumber,emailid,address) values(?,?,?,?,?)`;
    connection.query(insertquery,[firstname,lastname,phonenumber,emailid,address],function(err,results){
        if(err){
            throw err;
        }
        else{
            console.log("userdetails are inserted");
            res.render("admin/index");
        }
    })

})
//view user details
router.get("/viewuser", function(req, res) {
    const selectquery = "SELECT * FROM user_details";
    connection.query(selectquery, function(err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database query error");
        }
         else {
           
            const obj = { data: result };
            
            res.render("admin/viewuser", { obj: obj }); // Make sure this matches the template usage
            console.log("User details are displayed successfully");
        }
    });
});
router.get('/update/:userid', (req, res) => {
    const userid = req.params.userid; 
    const query = 'SELECT * FROM user_details WHERE userid = ?';
    
    connection.query(query, [userid], (err, results) => {
        if (err || results.length === 0) {
            throw err;
        }
        res.render('admin/edit', { user: results[0] }); 
    });
});


router.post("/edit/:userid",function(req,res){
    
    const  userid  = req.params.userid;
    const firstname=req.body.firstname;
    const lastname=req.body.lastname;
    const phonenumber=req.body.phonenumber;
    const emailid=req.body.emailid;
    const address=req.body.address;
    updatequery="update user_details set firstname = ?, lastname = ?, phonenumber = ?, emailid = ?, address = ? WHERE userid = ?";
    connection.query(updatequery,[firstname, lastname, phonenumber, emailid, address, userid],function(err,result){
        if(err){
            throw err;
        }
        else{
           
           
            res.render("admin/index");
            console.log("updated successfully"); 
        }
    })
})
//delete

router.post("/delete/:userid",function(req,res){
    
    const  userid  = req.params.userid;
    deletequery="delete from user_details WHERE userid = ?";
    connection.query(deletequery,[userid],function(err,result){
        if(err){
            throw err;
        }
        else{
           
           
            res.render("admin/index");
            console.log("deleted successfully"); 
        }
    })
})

module.exports = router;
