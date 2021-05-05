const express = require ("express");
const mysql = require('mysql');
const session = require('express-session')
const bcrypt = require('bcrypt')


const app = express()

app.use(
   session({
      secret:'vitu fishi',
      resave:false,
      saveUninitialized:false
 })
)

const connection = mysql.createConnection({
   host : 'localhost',
   user : 'root',
   port:'3306',
   password : 'sqlpassword1#',
   database : 'list_app'
})

connection.connect();

app.use(express.static("public"));

//config to get access to form values
app.use(express.urlencoded({extended:false}))

app.set('views','./views')
app.set('view engine','ejs')


app.use((req,res,next) =>{
   if(req.session.userId === undefined){
      res.locals.isLoggedIn = false;
      console.log("you are not logged in")
      //res.redirect('/')
   } else {
      console.log("you are logged in");
      res.locals.username = req.session.username
      res.locals.isLoggedIn = true
      }
   next()

})

//index page
app.get('/', (req,res) => {
   res.render("index")
} );


//items page
app.get('/items',(req,res)=>{
   if(res.locals.isLoggedIn){
      connection.query(
         'SELECT * FROM items WHERE user_id = ?', req.session.userId,
         (error,results) => {
            console.log(`userId:${req.session.userId}`)
            res.render("items",{ items:results })
         }
      );

   } else {
      res.redirect('/login')
   }
  
})

//edit page

app.get('/items/:id',(req,res) => {
//get route parameter(id)
let id = Number(req.params.id)

if(res.locals.isLoggedIn){
   connection.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ? LIMIT 1', [id,req.session.userId],
      (error,results) => {
         
         if(results.length === 1){
            res.render('edit',{item:results[0]})
         } else {
            res.render('404')
         }
      }
   
   )

} else {
   res.redirect('/login')
}
})
//grab form to add item
app.get('/create',(req,res) => {
   res.locals.isLoggedIn ? res.render('create') : res.redirect('/login')
})

//submit form with newly added item

app.post('/create',(req,res) => {
   //grab new item & add to the list
let itemName = req.body.newItem

connection.query(
   'INSERT INTO items (name,user_id) VALUES (?,?)',[itemName,req.session.userId],
   (error,results) => {
      res.redirect('/items')

   }
)
//redirect to items page
})

//update item
app.post('/update/:id',(req,res) => {
   let id = Number(req.params.id)
   let name = req.body.newItem

   connection.query(
      'UPDATE items SET name = ? WHERE id = ? AND user_id=?',
      [name,id,req.session.userId],
      (error,results) => {
         res.redirect('/items')
      }
   )
   
})

//delete item

app.post('/delete/:id', (req,res) => {
   const id = Number(req.params.id)
   
   connection.query(
      'DELETE FROM items WHERE id = ? AND user_id = ?',[id,req.session.userId],
      (error,results) => {
         res.redirect('/items')
      }
      )

})

//get login form 
app.get('/login',(req,res)=>{
   res.locals.isLoggedIn ? res.redirect('/items') : res.render('login')
   

})
//submit login form
app.post('/login',(req,res)=>{
   let email = req.body.email
   let password = req.body.password

   //todo : add validation

   connection.query('SELECT * FROM users WHERE email = ?',email,(error,results)=>{
      bcrypt.compare(password,results[0].password,(error,isEqual) =>{
         if(isEqual){
               req.session.userId = results[0].id
               req.session.username = results[0].username
               console.log("correct password")
               res.redirect('/items')
            } else {
               console.log("incorrect password")
               res.redirect('/')
            }
          })
      
   })

})
//get signup form
app.get('/signup',(req,res)=>{
  res.locals.isLoggedIn ? res.redirect('/items') : res.render('signup')
})
//submit signup form
app.post('/signup',(req,res)=>{
   let email = req.body.email
   let username = req.body.username
   let password = req.body.password
   let confirmPassword = req.body.confirmPassword 

   if(password !== confirmPassword){
      res.status(400).send("passwords don't match")
   } else {
      bcrypt.hash(password,10,(error,hash) => {
         connection.query('INSERT INTO users(username,password,email) VALUES (?,?,?)',
         [username,hash,email],
         res.redirect('/login')
         
         )
         
      })
    
      console.log('Account created successfully')
   }

})


app.get('/logout',(req,res)=>{
   req.session.destroy((error) =>{
      console.log("You are logged out")
      res.redirect('/')
   })

})

app.listen(8080,()=>{console.log("server open")});