const express = require ("express");

const app = express()

app.use(express.static("public"));

app.set('views','./views')
app.set('view engine','ejs')

app.get('/', (req,res) => {
   res.render("index")
} );

app.get('/items',(req,res)=>{
   res.render("items")
})
app.get('/potatoes',(req,res) => {
   res.render('potatoes')
})
app.get('/chilli',(req,res) => {
   res.render('chilli')
})
app.get('/yams',(req,res) => {
   res.render("yams")
})








app.listen(8080);