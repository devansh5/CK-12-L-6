const express=require('express')
const bodyParser=require('body-parser')
const app=express()


const MongoClient=require('mongodb').MongoClient


MongoClient.connect("<uri>",{useUnifiedTopology:true})
.then(client=>{
    const db=client.db('marvels-quotes')
    console.log('connect to database')
    const recipesCollection=db.collection('recipes')
    app.use(express.static('public'))
    app.set('view engine','ejs')
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:true}))
    app.get('/',(req,res)=>{
        res.render('index.ejs')
    })

    app.get('/recipes',(req,res)=>{
        recipesCollection.find().toArray()
        .then(result=>{
            res.render('recipe',{recipes:result})
        }).catch(err=>console.error(err))
    })
    app.post('/recipes',(req,res)=>{
        recipesCollection.insertOne(req.body)
        .then(result=>{
            recipesCollection.find().toArray()
            .then(result=>{
                res.render('recipe',{recipes:result})
            }).catch(error=>console.error(error))
        }).catch(err=>{
            console.error(err)
        })
    })
})
.catch(err=>{
    console.error(err);
})





app.listen(3000,()=>{
    console.log("running")
})


