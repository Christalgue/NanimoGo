var anecdote;
var nom;
var points;
var photo;
var chemin = new String( '' );
var question;
function ecrireInfos() {
    document.getElementById("image").innerHTML = "<img src=\" " + photo + "\"/>"; 
    document.getElementById("points").innerHTML = points + " points"; 
    document.getElementById("espece").innerHTML = nom; 
    document.getElementById("anecdote").innerHTML = anecdote; 
   }

function resultatInit() {
	firebase.database().ref(localStorage.getItem('chemin')).on('value', function(snapshot) {
	anecdote = snapshot.val().Anecdote;
	nom  = snapshot.val().Nom;
	points = snapshot.val().Points;
	photo = snapshot.val().Image;
	ecrireInfos();
	});
}

	function getInformations() {
		if (chemin.length === 0) {
			firebase.database().ref("Question").on('value', function(snapshot) {
			question = snapshot.val();
			ecrireQuestion();
					
			});
		} else {
				
			firebase.database().ref(chemin).on('value', function(snapshot) {
				if (!snapshot.val().Question)
				{
						
					localStorage.setItem("chemin", chemin);
					document.location.href="Resultat.html"
							
				} else {
					question = snapshot.val().Question;
					ecrireQuestion();
				}
			});
		}
	}		
	function questionValidee (bouton) {
		var valeur = bouton.value;
		if (chemin.length === 0) {
			chemin += valeur;
		} else {
			chemin += ('/' + valeur);
		}
		console.log(chemin);
		getInformations();
	}
		
	function ecrireQuestion() {
		document.getElementById("question").innerHTML = question; 
	}


