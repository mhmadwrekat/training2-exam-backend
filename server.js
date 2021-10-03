'use strict';
const express = require('express');
const app = express();
const cors = require('cors') ;
const Axios = require('axios');
require('dotenv').config();
app.use(cors());
app.use(express.json());
const mongoose = require('mongoose');
const PORT = process.env.PORT ;
const MONGO = process.env.MONGO_URL ;
const API = process.env.API_URL ;
mongoose.connect(`mongodb+srv://${MONGO}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
// API //
class Drinks {constructor(strDrink , strDrinkThumb, idDrink){
    this.strDrink = strDrink;
    this.strDrinkThumb = strDrinkThumb;
    this.idDrink = idDrink;
}}
const getData = async (req,res) => {
    let URL = `https://${API}?a=Non_Alcoholic`;
    let axiosRes = await Axios.get(URL);
    let data = axiosRes.data.drinks ;
    let cleanData = data.map(item => {
        return new Drinks (item.strDrink , item.strDrinkThumb , item.idDrink);
    })
    res.status(200).json(cleanData);
}
app.get('/data', getData);
///////////////////////  DB //////////////////////////
const SCM = new mongoose.Schema({
    strDrink:String,
    strDrinkThumb:String,
    idDrink:String
});
let seed = () => {
    let newDrink = new DrinkModel({
        strDrink:"test",
        strDrinkThumb:"test",
        idDrink:"test"
        });
    newDrink.save();
}
const DrinkModel = mongoose.model('drink',SCM);
let DrinkController = (req,res) => {
    DrinkModel.find().then(data => {
        res.status(200).json(data);
    })
}
app.get('/DBseed', seed);
app.get('/DBdata', DrinkController);
/////////// CREATE ////////////
const createDrinkController = async (req,res) => {
    let drinkData = req.body ;
    let newDrink = DrinkModel(drinkData);
    newDrink.save();
    let Data = await DrinkModel.find({});
    res.status(201).json(Data);
}
app.post('/create', createDrinkController);
/*////////// Update ///////////*/ const updateDrinkController = async (req,res) => {
    let drinkID = req.params.id ;
    let update = req.body ;
    DrinkModel.findOne({_id:drinkID}).then(item => {
        item.strDrink = update.strDrink,
        item.strDrinkThumb = update.strDrinkThumb,
        item.idDrink = update.idDrink
        item.save();
    });
    let UP = await DrinkModel.find({});
    res.status(200).send(UP);
}
app.put('/update/:id', updateDrinkController)
/* Delete */ const deleteDrinkController = (req,res) => {
    let id = req.params.id;
    DrinkModel.findByIdAndDelete(id,(error,data) => {
        if(error){
            res.status(500).send("ERRORR");
        }else{
            DrinkModel.find({}).then(item => {
                res.json(item);
            })}})}
app.delete('/delete/:id', deleteDrinkController);
app.listen(PORT, () => {console.log('You In PORT : ' , PORT);});