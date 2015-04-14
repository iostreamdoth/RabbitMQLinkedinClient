var request = require("request");
var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.view = function(req, res) {
	// console.log("sessionid " + req.session.uid);
	if (req.session.uid == undefined) {

		res.redirect("/");

	} else {
		res.render('wall', {
			session : req.session.uid,
		});
	}
};
exports.getwall = function(req, res) {
	var puserid = req.session.uid;

	console.log(puserid);
	if (puserid == undefined) {

		res.redirect("/");

	} else {

		mq_client.make_request('member_queue', {
			reqtype : "/connection/connectionfeed",
			method : "POST",
			form : {
				idconnections : 0,
				userid : puserid,
				touserid : puserid,
			}
		}, function(error, response) {
			if (!error) {
				console.log("What is the response")
				var l = JSON.parse(response);
				console.log("Result is :" + JSON.stringify(l));
				if (l.status == "success") {
					console.log(l.data);

					res.setHeader('Content-Type', 'application/json');
					res.send({
						session : req.session.uid,
						feed : l.data
					});

					;
				} else {
					res.send({
						status : "failure"
					})
				}
			} else {
				res.send({
					status : "error"

				});
			}
		});

	}
}
