const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const MongoClient = require('mongodb').MongoClient;
var app = express();
port = process.env.PORT || 3000;

var url = process.env.MONGO_URL || "mongodb+srv://roshan:9939105936@music-app-db-hexhh.mongodb.net/?retryWrites=true&w=majority";
var cities = require('./cities.json');

var db;

// Use connect method to connect to the server
MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err, client) {
    if (err) {
        throw err;
    }
    console.log("Connected successfully to server");

    db = client.db('attainu-test');

    var result = cities.map((cities) => {
        return cities.state;
    });

    var states = result.filter((item, index) => {
        return result.indexOf(item) === index;
    });

    // console.log(states[0]);
    const monDBStateColl = []

    for (let index = 0; index < states.length; index++) {
        let stateObj = {};
        const element = states[index];
        stateObj.state = element;
        let city = cities.filter((city) => {
            let cityName = city.name
            // console.log(cityName);
            if (city.state === element) {
                return cityName;
            }
        });

        let name = city.map((obj) => {
            return obj.name;
        });
        // console.log(name);
        stateObj.city = name;
        monDBStateColl.push(stateObj);
    }
   db.collection('state').find().toArray(function (err, result) {
       if (err) {
           console.log(err);
       }
       console.log("state collection", result.length);
       if(result.length > 0){
           console.log("document already there", result.length);
       } else {
           db.collection('state').insertMany(monDBStateColl, function (err, result) {
               if (err) {
                   console.log(err);
               }
               console.log("inserted document", result.insertedCount);
           });
       }
   });
});

// body-parser, handlebars & express-static middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// static folder middleware
app.use(express.static('public'));
// hbs middleware
app.set('view engine', 'hbs');

//  /state/<state-name>/add/<city-name>
// /state/karnataka/add/raichur


app.put('/state/:state/add/:city', function (req, res) {
          console.log(req.params.state.charAt(0).toUpperCase());
          let firstChar = req.params.state.charAt(0).toUpperCase()
          let firstCharCity = req.params.city.charAt(0).toUpperCase()
          let state = req.params.state.split("");
          let city = req.params.city.split("");
          state.shift();
          state.unshift(firstChar);
          city.shift();
          city.unshift(firstCharCity)
          console.log(state.join(""));
          state = state.join("");
          city = city.join("")
          db.collection("state").updateOne({ state: state }, { $push: { city:  city} }, function (err, result) {
                    if (err) {
                        return res.status(400).json({ error: "An error occurred" });
                    }
                    db.collection('state').find().toArray(function (err, result) {
                        if (err) {
                            throw err;
                        }
                        // console.log(result);
                        data = result.filter((state) => {
                            return state.state.toLowerCase() === req.params.state.toLowerCase();
                        }) 
                        console.log("state: ", data);
                        res.json(data)
                    });
        });
});

app.delete('/state/:state/remove/:city', function (req, res) {
    console.log(req.params.state.charAt(0).toUpperCase());
    let firstChar = req.params.state.charAt(0).toUpperCase()
    let firstCharCity = req.params.city.charAt(0).toUpperCase()
    let state = req.params.state.split("");
    let city = req.params.city.split("");
    state.shift();
    state.unshift(firstChar);
    city.shift();
    city.unshift(firstCharCity)
    console.log(state.join(""));
    state = state.join("");
    city = city.join("")
    db.collection("state").updateOne({
        state: state
    }, {
        $pull: {
            city: city
        }
    }, function (err, result) {
        if (err) {
            return res.status(400).json({
                error: "An error occurred"
            });
        }
        db.collection('state').find().toArray(function (err, result) {
            if (err) {
                throw err;
            }
            // console.log(result);
            data = result.filter((state) => {
                return state.state.toLowerCase() === req.params.state.toLowerCase();
            })
            console.log("state: ", data);
            res.json(data)
        });
    });
});

//  /showAllCities/<alphabet>

app.get('/showAllCities/:alphabet', function (req, res) {
    let firstChar = req.params.alphabet.charAt(0).toUpperCase();
    // console.log(firstChar);
    db.collection('state').find().toArray(function (err, result) {
        if (err) {
            throw err;
        }
        // console.log(result);
        data = result.map((state) => {
            return state.city;
        });
        let allCity = [].concat.apply([], data);
        // console.log("cities ", allCity);
        var result = []
        for (let index = 0; index < allCity.length; index++) {
            const element = allCity[index];
            const stringElement = `${element}`;
            // console.log(element);
            if (stringElement.charAt(0) === firstChar) {
                result.push(element);
            }
        }
        // console.log(result.sort());
        res.json(result.sort()); 
    });
})

// route ->  /state/<city-name>
// -> /state/Udaipur -> return "Rajasthan"

app.get('/state/:city', function (req, res) {
    let firstChar = req.params.city.charAt(0).toUpperCase();
    let city = req.params.city.split("");
    city.shift();
    city.unshift(firstChar)
    city = city.join("")
    console.log(city);
    db.collection('state').find().toArray(function (err, result) {
        if (err) {
            throw err;
        }

        var state = ()=> {
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                let currentstate = element.state;
                let currentArr = element.city;
                for (let j = 0; j < currentArr.length; j++) {
                    let currentCity = currentArr[j];
                    // console.log(currentCity);

                    if (currentCity === city) {
                        return currentstate;
                    }

                }

            }
        }
        console.log(state()); 
        let currentstate = state(); 
        res.json(currentstate);
    });
})

// findFrequentState form
app.get('/findFrequentState', function (req, res) {
            res.render('index.hbs', {
                title: 'findFrequentState',
                script: 'findState.js',
            });
});

app.post('/findFrequentState', function (req, res) {
    res.render('index.hbs', {
        title: 'findFrequentState',
        script: 'findState.js',
    });
});



app.listen(port, function () {
    console.log('server is running at port ' + port);
});