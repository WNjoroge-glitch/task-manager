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









app.listen(8080);