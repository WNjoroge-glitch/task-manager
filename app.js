const express = require ("express");

const app = express()

app.use(express.static("public"));

app.set('views','./views')
app.set('view engine','ejs')

const items = [{id:1,name:'Potatoes'},{id:2,name:'Chilli'},{id:3,name : 'Yams'}]

app.get('/', (req,res) => {
   res.render("index")
} );

app.get('/items',(req,res)=>{
   res.render("items",{ items:items })
})

app.get('/create',(req,res) => {
   res.render('add');
})









app.listen(8080);