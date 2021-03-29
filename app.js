const express = require ("express");

const app = express()

app.use(express.static("public"));

//config to get access to form values
app.use(express.urlencoded({extended:false}))

app.set('views','./views')
app.set('view engine','ejs')

const items = [{id:1,name:'Potatoes'},{id:2,name:'Chilli'},{id:3,name : 'Yams'}]

app.get('/', (req,res) => {
   res.render("index")
} );

app.get('/items',(req,res)=>{
   res.render("items",{ items:items })
})

app.get('/items/:id',(req,res) => {
//get route parameter(id)
let id = Number(req.params.id)
let item = items.find(item => item.id === id)
res.render('item',{item:item})

})
//grab form


app.get('/create',(req,res) => {
   res.render('create');
})

//submit form

app.post('/create',(req,res) => {
   //grab new item & add to the list
   
let count = items.length + 1
items.push({id:count,name:req.body.newItem})


  //redirect to items page
  res.redirect('items')
})







app.listen(8080);