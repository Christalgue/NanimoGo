var anecdote;
var nom;
var points;
var photo;
var chemin = new String( 'DecisionTree' );
var question;

function miseAJourPointsRang() {
			firebase.database().ref("Utilisateurs/" + localStorage.getItem("mail")).once('value', function(snapshot) {
				var Score = snapshot.val().Score + points;
				firebase.database().ref("Utilisateurs").child(localStorage.getItem("mail")).child("Score").set(Score);
				firebase.database().ref("ListeRangs").once('value', function(snapshot) {
					var trouve = 0;
					var i =0;
					while (!trouve && i<snapshot.val().length-1)  {
						console.log("i : " + i);
						if ( snapshot.val()[i].Score <= Score && Score < snapshot.val()[i+1].Score ) {
							trouve = 1;
							firebase.database().ref("Utilisateurs").child(localStorage.getItem("mail")).child("Rang").set(snapshot.val()[i].Nom);
						}
						i++;
					}
					if (!trouve &&  i===snapshot.val().length-1 && snapshot.val()[i].Score <= Score) {
						firebase.database().ref("Utilisateurs").child(localStorage.getItem("mail")).child("Rang").set(snapshot.val()[i].Nom);
					}
				})
			})
}

function ecrireInfos() {
    document.getElementById("image").innerHTML = "<img class=\"image-centree\" src=\" " + photo + "\"/>"; 
    document.getElementById("points").innerHTML = points + " points"; 
    document.getElementById("espece").innerHTML = nom; 
    document.getElementById("anecdote").innerHTML = anecdote; 
    miseAJourPointsRang();
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
					sendMail();
					//localStorage.setItem("chemin", chemin);
					
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
			document.getElementById("imageRef").innerHTML = "<img class=\"image-centree\" src = \" " +snapshot.val().Image + "\"/> "; 
					
		});
	
}

function ecrireRang() {
	localStorage.setItem("mail", "mail@example_dot_com"); // a deplacer
	firebase.database().ref("Utilisateurs/" + localStorage.getItem("mail") + "/Rang").on('value', function(snapshot) {
		document.getElementById("rang").append(snapshot.val());
	})
	
}
function ecrireScore() {
	firebase.database().ref("Utilisateurs/" + localStorage.getItem("mail") + "/Score").on('value', function(snapshot) {
		document.getElementById("points").append(snapshot.val());
	})
	
}

function sendMail() {
   /* var link = "mailto:lafanofdestiny@gmail.com"
             + "&subject=" + escape("This is my subject")
             + "&body=" + escape("chemin :"  + chemin)
    ;

    window.location.href = link;*/
    // key api : ab296ec761eb53d09ddf0d7dc79b6f4c-us20
}


