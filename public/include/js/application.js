function invitationstatus() {
	// alert("invitationstatuscalled");
	$.get("/getinvitationstatus", {}).done(function(data) {
		//alert(data.invitation);
		if (data.invitation != 0) {
			

			setTimeout(function(){callitagain()}, 700);
			// $("#btnInvitation").toggleClass('btn-warning');
		}
	});
}
function callitagain() {
	//alert("Hello");
	$("#btnInvitation").toggleClass('btn-warning');
	setTimeout(function(){callitagain()}, 700);
}
invitationstatus();
// invitationstatus();

function sendtomessagebox() {
	window.location = "/invitation/box";
}