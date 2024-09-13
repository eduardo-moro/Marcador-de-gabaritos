const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
import { inject } from "@vercel/analytics"
import { injectSpeedInsights } from '@vercel/speed-insights';


const app = express();

inject();
injectSpeedInsights();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

module.exports = (req, res) => {
    app(req, res);
};