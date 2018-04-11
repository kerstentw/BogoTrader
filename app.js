const express = require("express");
const app = express();

const fetch = require("node-fetch");
const path = require("path");
const endpoint = "https://api.coinmarketcap.com/v1/ticker/?limit=50"
const port = 4444 

function buildProportions(_number_of_members){

    var base = 100;
    final_props = []

    for (x = _number_of_members; x > 0; x--){
        prop = Math.floor(Math.random() * base)
        final_props.push(prop);
        base -= prop;
    }

    final_props[Math.floor(Math.random() * final_props.length)] += base;

    return final_props;

}




function selectRandomWithProportions(_budget, _asset_array){
    let size = 5;
    let portfolio = [];
    let proportions = buildProportions(size);
    for (x = 0; x < size; x++){ 
        let position =  Math.floor(Math.random() * _asset_array.length);
        _asset_array[position]["proportion"] = proportions[x];
        _asset_array[position]["amount_of_budget"] = _asset_array[position]["proportion"]/100 * _budget;
        _asset_array[position]["amount_to_buy"] = parseFloat(_asset_array[position]["price_usd"]) / _asset_array[position]["amount_of_budget"];
        portfolio.push(_asset_array[position])
    }
//    portfolio[0]["proportion"] += 0.01;

    return portfolio
 
}


app.get('/getPortfolio', (req, res)=> {
    fetch(endpoint).then(response=> {
        response.json().then(json => {
            var budget = req.query.budget;
            console.log("RECEIVED::: " + json.length)
            if (typeof(budget) == "undefined"){
                budget = 0;
            }
           
            res.send(selectRandomWithProportions(budget,json)) 
        }); 
    });
});
app.listen(port, () => console.log('Example App listening on Port: ' + port));


app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

