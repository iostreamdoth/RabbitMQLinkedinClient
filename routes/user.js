/*
 * GET users listing.
 */
var request = require("request");
var url = require('url');
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
				var l = response;
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
						session : 0
					})
				}
			} else {
				res.send({
					session : 0

				});
			}
		});

	}
}

exports.list = function(req, res) {
	res.send("respond with a resource");
};
exports.signin = function(req, res) {
	var username = req.param("username");
	var password = req.param("password");

	mq_client.make_request('login_queue', {
		reqtype : "/user/signinver",
		form : {
			firstname : "",
			lastname : "",
			username : req.param("username"),
			password : req.param("password")

		}
	}, function(error, response) {
		// console.log("What");
		var l = response;

		console.log(JSON.stringify(l));
		if (l.status == "success") {
			console.log(l.data);
			req.session.uid = l.data;
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({
				status : "success"
			}));
		} else {
			res.send({
				status : "failure"
			})
		}
	});

}
exports.signup = function(req, res) {
	// console.log(req);
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var username = req.param("username");
	var password = req.param("password");
	console.log(firstname);
	console.log(lastname);
	console.log(username);
	console.log(password);

	mq_client.make_request('login_queue', {
		reqtype : "/user/signupver",
		method : "POST",
		form : {
			firstname : req.param("firstname"),
			lastname : req.param("lastname"),
			username : req.param("username"),
			password : req.param("password")
		}
	}, function(error, body) {
		console.log(body);
		res.send({
			login : "success"
		})
	});

};

exports.profile = function(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	mq_client.make_request('profile_queue', {
		reqtype : "/profile/get",
		method : "POST",
		form : {
			userid : query.uid,
			profileid : 0,
			organisation : "",
			type : "",
			desc : "",
			as : "",
			from : "",
			to : "",
			location : "",
			summary : ""
		}
	}, function(error, response) {
		console.log(response)
		var l = response;
		var w = [];
		var e = []
		console.log(l.status);
		if (l.status == "success") {
			console.log(l.data);
			var data = JSON.parse(l.data);
			for (var i = 0; i < data.length; i++) {
				if (data[i].type == "ED") {
					e.push(data[i]);
					console.log(data[i]);
				} else {
					console.log(data[i]);
					w.push(data[i]);
				}
			}

			mq_client.make_request('login_queue', {
				reqtype : "/user/getuserdetails",
				method : "POST",
				form : {
					userid : query.uid,
					firstname : "",
					lastname : "",
					username : "",
					password : "",
					imagedetail : "",
					invitation : 0,
					totalconnection : 0,
					summary : ""
				}
			}, function(err, rponse) {

				var p = rponse;
				console.log("what the father gentelmen");
				console.log(JSON.parse(p.data));
				p = JSON.parse(p.data);

				mq_client.make_request('profile_queue', {
					reqtype : "/skill/getskills",
					method : "POST",
					form : {
						userid : query.uid,
					}
				}, function(er, rpons) {
					console.log("Here success");
					console.log(rpons);
					// var h = JSON.parse(rpons);
					var h = JSON.parse(rpons.data);
					console.log(JSON.stringify(h));
					res.render('profile', {
						session : req.session.uid,
						work : w,
						education : e,
						profile : p[0],
						skill : h

					});

				});

			});

			;
		} else {
			res.send({
				status : "failure"
			})
		}
	});

}
exports.editprofile = function(req, res) {

	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	mq_client.make_request('profile_queue', {
		reqtype : "/profile/get",
		method : "POST",
		form : {
			userid : uid,
			profileid : 0,
			organisation : "",
			type : "",
			desc : "",
			as : "",
			from : "",
			to : "",
			location : "",
			summary : ""
		}
	}, function(error, body) {
		console.log("Success in post /profile/get");
		var l = body;
		var w = [];
		var e = []
		console.log(l.status);
		if (l.status == "success") {
			console.log(l.data);
			var data = JSON.parse(l.data);
			for (var i = 0; i < data.length; i++) {
				if (data[i].type == "ED") {
					e.push(data[i]);
					console.log(data[i]);
				} else if (data[i].type == "WO") {
					console.log(data[i]);
					w.push(data[i]);
				}
			}

			mq_client.make_request('login_queue', {
				reqtype : "/user/getuserdetails",
				method : "POST",
				form : {
					userid : uid,
					firstname : "",
					lastname : "",
					username : "",
					password : "",
					imagedetail : "",
					invitation : 0,
					totalconnection : 0,
					summary : ""
				}
			}, function(err, bdy) {
				console.log("Success in post /user/getuserdetails");
				var p = bdy;
				p = JSON.parse(p.data);

				mq_client.make_request('profile_queue', {
					reqtype : "/skill/getskills",
					method : "POST",
					form : {
						userid : uid,
					}
				}, function(er, bd) {
					console.log("Success in post /skill/getskills");
					var h = bd;

					console.log(h.data);
					res.render('editprofile', {
						session : req.session.uid,
						work : w,
						education : e,
						profile : p[0],
						skill : JSON.parse(h.data)

					});

				});
			});

			;
		} else {
			res.send({
				status : "failure"
			})
		}
	});

}

exports.editsummary = function(req, res) {
	console.log(req.param("summary"))
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	var p_summary = req.param("summary");
	mq_client.make_request('profile_queue', {
		reqtype : "/profile/updatesummary",
		method : "POST",
		form : {
			userid : uid,
			firstname : "",
			lastname : "",
			username : "",
			password : "",
			imagedetail : "",
			invitation : 0,
			totalconnection : 0,
			summary : p_summary
		}
	}, function(err, bdy) {

		var p = bdy;
		p = p.data;
		res.send({
			status : "success"
		});

	});
}
exports.editexp = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	var p_profileid = req.param("profileid");
	mq_client.make_request('profile_queue', {
		reqtype : "/profile/getbyid",
		method : "POST",
		form : {
			userid : uid,
			profileid : p_profileid,
			organisation : "",
			type : "",
			desc : "",
			as : "",
			from : "",
			to : "",
			location : "",
			summary : ""
		}
	}, function(err, bdy) {

		var p = bdy;
		p = JSON.parse(p.data);
		console.log(JSON.stringify(p));
		res.send({
			status : "success",
			data : p[0]
		});

	});
}

exports.addexp = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	var p_profileid = req.param("profileid");
	mq_client.make_request('profile_queue', {
		reqtype : "/profile/create",
		method : "POST",
		form : {
			userid : uid,
			profileid : 0,
			organisation : req.param("organisation"),
			type : req.param("type"),
			desc : req.param("desc"),
			as : req.param("as"),
			from : req.param("from"),
			to : req.param("to"),
			location : req.param("location"),
			summary : req.param("summary")
		}
	}, function(err, bdy) {

		var p = bdy;
		p = JSON.parse(p.data);
		console.log(JSON.stringify(p));
		res.send({
			status : "success",
			data : p[0]
		});

	});
}

exports.editexpid = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	console.log("1");
	var p_profileid = req.param("profileid");
	console.log("2");
	mq_client.make_request('profile_queue', {
		reqtype : "/profile/update",
		method : "POST",
		form : {
			userid : uid,
			profileid : p_profileid,
			organisation : req.param("organisation"),
			type : req.param("type"),
			desc : req.param("desc"),
			as : req.param("as"),
			from : req.param("from"),
			to : req.param("to"),
			location : req.param("location"),
			summary : req.param("summary")
		}
	}, function(err, bdy) {
		console.log("3");
		var p = bdy;
		p = JSON.parse(p.data);
		console.log("Real Data")
		console.log(JSON.stringify(p));
		res.send({
			status : "success",
			data : p[0]
		});

	});
}
exports.delexp = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	console.log("1");
	var p_profileid = req.param("profileid");
	console.log("2");
	mq_client.make_request('profile_queue', {
		reqtype : "/profile/delexp",
		method : "POST",
		form : {
			userid : uid,
			profileid : p_profileid,
			organisation : "",
			type : "",
			desc : "",
			as : "",
			from : "",
			to : "",
			location : "",
			summary : ""
		}
	}, function(err, bdy) {
		console.log("3");

		console.log("Real Data")
		console.log(JSON.stringify(bdy));
		res.send({
			status : "success",

		});

	});
}

exports.search = function(req, res) {
	var name = req.param("name");
	console.log(name);
	var uid = 0;
	if (req.session.uid != undefined) {
		uid = req.session.uid;
	}

	var namearr = name.split(" ");
	var uname1 = "";
	var uname2 = "";
	var uname3 = "";
	for (var i = 0; i < namearr.length; i++) {
		if (i == 0)
			uname1 = namearr[i];
		if (i == 1)
			uname2 = namearr[i];
		if (i == 2)
			uname3 = namearr[i];
	}
	if (uname2 == "")
		uname2 = uname1;
	if (uname3 == "")
		uname3 = uname1;

	console.log(uname1);
	console.log(uname2);
	console.log(uname3);

	mq_client.make_request('profile_queue', {
		reqtype : "/profile/search",
		method : "POST",
		form : {
			uname1 : uname1,
			uname2 : uname2,
			uname3 : uname3,
			userid : uid
		}
	}, function(err, bdy) {
		console.log("3");
		var p = bdy;
		console.log("Real Data")
		console.log(JSON.stringify(p.data));
		res.render('search', {
			result : JSON.parse(p.data)

		});

	});
}
exports.getall = function(req, res) {
	var uname1 = "";
	var uname2 = "";
	var uname3 = "";
	var uid = 0;
	if (req.session.uid != undefined) {
		uid = req.session.uid;
	}
	mq_client.make_request('member_queue', {
		reqtype : "/profile/search",
		method : "POST",
		form : {
			uname1 : uname1,
			uname2 : uname2,
			uname3 : uname3,
			userid : uid
		}
	}, function(err, bdy) {
		console.log("3");
		var p = JSON.parse(bdy);
		console.log("Real Data")
		console.log(JSON.stringify(p.data));
		res.render('search', {
			result : JSON.parse(p.data)

		});

	});
}

exports.getallconnections = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	var uname1 = "";
	var uname2 = "";
	var uname3 = "";
	mq_client.make_request('member_queue', {
		reqtype : "/connection/getconnectionsdetails",
		method : "POST",
		form : {
			idconnections : 0,
			userid : uid,
			touserid : 0
		}
	}, function(err, bdy) {
		console.log("3");
		var p = (bdy.data);
		console.log("Real Data")
		console.log(JSON.stringify(p));
		res.render('connection', {
			result : JSON.parse(p)

		});

	});
}
exports.sendinvitations = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}

	var touserid = req.param("touserid");
	var fromuserid = req.session.uid;
	var connectiontype = req.param("connectiontype");
	var message = req.param("message");
	mq_client.make_request('member_queue', {
		reqtype : "/invite/sendinvitation",
		method : "POST",
		form : {
			idinvitations : 0,
			touserid : touserid,
			fromuserid : fromuserid,
			connectiontype : 'FR',
			message : message

		}
	}, function(err, bdy) {
		console.log("3");
		var p = bdy;
		console.log("Real Data")
		console.log(JSON.stringify(p.data));
		res.send({
			status : "success",
		});

	});

}

exports.getinvitationstatus = function(req, res) {
	
	console.log("I'm in get invitationstatus");
	if (req.session.uid == undefined) {
		console.log("I'm in return 0");

		res.send({
			invitation :0
		});

	} else {
		console.log("I'm in return more than 0");
		var uid = req.session.uid;
		mq_client.make_request('login_queue', {
			reqtype : "/user/getuserdetails",
			method : "POST",
			form : {
				userid : uid,
				firstname : "",
				lastname : "",
				username : "",
				password : "",
				imagedetail : "",
				invitation : 0,
				totalconnection : 0,
				summary : ""
			}
		}, function(er, rpons) {
			console.log("Stringify h is = ",JSON.stringify(rpons));
			//var h = JSON.parse(rpons);
			var h = JSON.parse(rpons.data);
			console.log("Stringify h is = ",JSON.stringify(h));

			res.send({
				invitation : h[0].invitation
			});
		});
	}
}
exports.box = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;
	mq_client.make_request('member_queue', {
		reqtype : "/invite/box",
		method : "POST",
		form : {
			idinvitations : 0,
			touserid : uid,
			fromuserid : 0,
			connectiontype : 'FR',
			message : ''
		}
	}, function(er, rpons) {

		var h = rpons;
		console.log("stringify here");
		console.log(JSON.stringify(h));
		console.log(h)
		if (h.data.length == 0) {
			res.render('invitations', {
				result : {
					status : "No Data"
				},
				status : "nodata"

			});

		} else {
			console.log("redering0");
			res.render('invitations', {
				result : h.data,
				status : "success"
			});
		}
	});

}
exports.signout = function(req, res) {
	req.session = null;
	res.render('signout', {});
}

exports.acceptinvitation = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;

	var reqtype = "";
	if (req.param("decision") == "A") {
		reqtype = "/invite/accept";
	} else if (req.param("decision") == "R") {
		reqtype = "/invite/reject";
	} else {
		res.redirect("/illegalopration");
	}

	mq_client.make_request('member_queue', {
		reqtype : reqtype,
		method : "POST",
		form : {
			idinvitations : req.param("idinvitations"),
			touserid : uid,
			fromuserid : req.param("fromid"),
			connectiontype : 'FR',
			message : ''
		}
	}, function(er, bd) {

		var h = bd;
		console.log("stringify here");
		console.log(JSON.stringify(h));
		console.log(h)

		res.render('invitations', {
			result : h,
			status : "success"

		});
	});
}

exports.addskill = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;

	var reqtype = "";

	reqtype = "/skill/setskills";

	mq_client.make_request('profile_queue', {
		reqtype : reqtype,
		method : "POST",
		form : {
			userid : req.session.uid,
			skillname : req.param("skillname")

		}
	}, function(er, bd) {

		var h = bd;
		console.log("stringify here");
		console.log(JSON.stringify(h));
		console.log(h)

		res.render('invitations', {
			result : h,
			status : "success"

		});
	});
}
exports.delskill = function(req, res) {
	if (req.session.uid == undefined) {

		res.redirect("/");

	}
	var uid = req.session.uid;

	var reqtype = "";

	reqtype = "/skill/removeskills";
	mq_client.make_request('profile_queue', {
		reqtype : reqtype,
		method : "POST",
		form : {
			userid : req.session.uid,
			skillid : req.param("skillid")

		}
	}, function(er, bd) {

		var h = JSON.parse(bd);
		console.log("stringify here");
		console.log(JSON.stringify(h));
		console.log(h)

		res.render('invitations', {
			result : h,
			status : "success"

		});
	});
}

exports.failure = function(req, res) {
	res.render('failure', {});
}
