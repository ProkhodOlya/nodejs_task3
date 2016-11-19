import express from 'express';
import cors from 'cors';
import _ from 'lodash';
import Promise from 'bluebird';
import fetch from 'isomorphic-fetch'

const app = express();
app.use(cors());


//Домашнее задание 3С
app.listen(3000, () => {
    console.log('Your app listening on port 3000!');
});

const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';
let pc = {};
fetch(pcUrl)
    .then(async(res) => {
        pc = await res.json()
    })
    .catch(err => {
        console.log('Что-то пошло не так:', err);
    });

app.get('/volumes', function (req, res) {
    let objDisc = {};
    for (let key in pc.hdd) {
        objDisc[pc.hdd[key].volume] = objDisc[pc.hdd[key].volume] ? objDisc[pc.hdd[key].volume] + pc.hdd[key].size : pc.hdd[key].size;
    }
    for (let key in objDisc) {
        objDisc[key] = objDisc[key] + 'B';
    }
    console.log(objDisc);
    return res.json(objDisc);
});


app.get('/*', function (req, res) {
    let arrUrl = req.originalUrl.split('/').slice(1);
    console.log(req.originalUrl);
    let result = pc;
    let DEV = true;
    for (let i = 0; i < arrUrl.length; i++) {
        if (!arrUrl[i]) break;
        _.forOwn(result, function (value, key) {
            if (key == arrUrl[i]) {
                DEV = true;
            }
        });
        if ((result[arrUrl[i]] === 0 || result[arrUrl[i]] || result[arrUrl[i]] === null) && DEV) {
            result = result[arrUrl[i]];
            DEV = false;
        } else {
            return res.status(404).send('Not Found');
        }
    }
    return res.json(result);
});
