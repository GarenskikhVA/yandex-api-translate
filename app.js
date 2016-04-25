express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

var templating = require('consolidate');
app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

var request = require('request');
var urlutils = require('url');

app.get("/", function(req, res){
	res.render('translator', {
		title: 'Заполните форму для перевода!'
	});
});

app.post('/', function(req, res){
	if(!req.body.text || req.body.text == ""){
		res.render('translator', {
			title: "Введите слово для перевода!"
		});
	} else {
		var url = urlutils.format({
			protocol: 'https',
			hostname: 'translate.yandex.net',
			pathname: 'api/v1.5/tr.json/translate',
			query: {
				key: 'trnsl.1.1.20160424T134156Z.6c1ed0e669f82f81.edf8bdfd687989c6650ca491f73c682145b4dddf',
				lang: req.body.lang,
				text: req.body.text
			}
		});

		request.get({
			url: url, 
			json: true
		}, function (error, response, json){
			var data = {};

			if(error || json.code != 200){
				data = {
					title: "Error: " + req.body.text,
					error: json.message
				}
			} else {
				data = {
					title: "Перевод слова " + req.body.text + ": " + json.text
				}
			}

			res.render('translator', data); 
		});
	}

});

var port = process.env.PORT || 5000;
app.listen(port);