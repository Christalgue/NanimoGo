var anecdote;
var nom;
var points;
var photo;
var chemin = new String( 'DecisionTree' );
var question;
function ecrireInfos() {
    document.getElementById("image").innerHTML = "<img src=\" " + photo + "\"/>"; 
    document.getElementById("points").innerHTML = points + " points"; 
    document.getElementById("espece").innerHTML = nom; 
    document.getElementById("anecdote").innerHTML = anecdote; 
   }

function resultatInit() {
	firebase.database().ref("ListeAnimaux/"+localStorage.getItem("id")).on('value', function(snapshot) {
	anecdote = snapshot.val().Anecdote;
	nom  = snapshot.val().Nom;
	points = snapshot.val().Points;
	photo = snapshot.val().Image;
	ecrireInfos();
	});
}

function getInformations() {
	if (chemin === "DecisionTree") {
		firebase.database().ref("Question").on('value', function(snapshot) {
		question = snapshot.val();
		ecrireQuestion();
					
		});
	} else {
				
		firebase.database().ref(chemin).on('value', function(snapshot) {
			if (!snapshot.val().Question)
			{	
				if (snapshot.val().ID === 0) {
					document.location.href = "Inconnue.html";
				} else {	
					localStorage.setItem("id", snapshot.val().ID);
					document.location.href = "Comparaison.html";	
				}	
			} else {
				question = snapshot.val().Question;
				ecrireQuestion();
			}
		});
	}
}		
function questionValidee (bouton) {
	var valeur = bouton.value;
	chemin += ('/' + valeur);
	getInformations();
}
		
function ecrireQuestion() {
	document.getElementById("question").innerHTML = question; 
}

function afficherImageRef() {

		firebase.database().ref("ListeAnimaux/"+localStorage.getItem("id")).on('value', function(snapshot) {
			document.getElementById("imageRef").innerHTML = "<img src = \" " +snapshot.val().Image + "\"/> "; 
					
		});
	
}


