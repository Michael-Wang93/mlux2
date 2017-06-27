const fs = require('fs');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevConfig = require('../webpack.dev.config.js');
const db = require('./db');
const resolve = file => path.resolve(__dirname, file);
const api = require('./api');
const app = express();


//var dll = webpack(webpackDllConfig);
var compiler = webpack(webpackDevConfig);

app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackDevConfig.output.publicPath,
    noInfo: true,
    stats: {
        colors: true
    }
}));
app.use(webpackHotMiddleware(compiler));
app.set('port', (process.env.port || 8006));
app.use('/dist', express.static(resolve('../dist')));
app.use(api);

var reload = require('reload');
var http = require('http');
var server = http.createServer(app);
reload(server, app);

// const createBundleRenderer = require('vue-server-renderer').createBundleRenderer


app.post('/api/setup', function (req, res) {
    new db.User(req.body)
        .save()
        .then(() => {
            res.status(200).end();
            db.initialized = true;
        })
        .catch(() => res.status(500).end());
});

app.get('*', function (req, res) {
    const fileName = db.initialized ? './index.html' : './index.html';
    const html = fs.readFileSync(resolve('../' + fileName), 'utf-8');
    // const html = fs.readFileSync(resolve('../setup.html'), 'utf-8')
    res.send(html);
});

app.listen(app.get('port'), function () {
    console.log('Visit http://localhost:' + app.get('port'));
});
