var anecdote;
var nom;
var points;
var photo;
var chemin = new String( 'DecisionTree' );
var question;
var nbEspece;

function miseAJourPointsRangAlbum() {
			var id = localStorage.getItem("id");
			firebase.database().ref("Utilisateurs/" + localStorage.getItem("mail")).once('value', function(snapshot) {
				var Score = snapshot.val().Score + points;
				firebase.database().ref("Utilisateurs").child(localStorage.getItem("mail")).child("Score").set(Score);
				firebase.database().ref("Utilisateurs").child(localStorage.getItem("mail")).child("NombreEspeces").set((snapshot.val().NombreEspeces+1));
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
			firebase.database().ref("Utilisateurs").child(localStorage.getItem("mail")).child("Album").once('value', function(snapshot) {
				var taille = snapshot.val().length-1;
				console.log(taille);
				firebase.database().ref("Utilisateurs").child(localStorage.getItem("mail")).child("Album").child(taille).child("ID").set(parseInt(id, 10));
			})
}

function ecrireInfos() {
    document.getElementById("image").innerHTML = "<img class=\"image-centree\" src=\" " + photo + "\"/>"; 
    document.getElementById("points").innerHTML = points + " points"; 
    document.getElementById("espece").innerHTML = nom; 
    document.getElementById("anecdote").innerHTML = anecdote; 
    miseAJourPointsRangAlbum();
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

/*function detectFiles(event) {
	console.log("detect !");
	console.log(event.target.files[0]);
    this.onUploadFile(event.target.files[0]);
 }*/

/*function onUploadFile(file) {
	uploadFile(file).then(
	 (url) => {
		 firebase.database().ref("Utilisateurs/" + localStorage.getItem("mail").child("Album").on('value', function(snapshot) {
		  		firebase.database().ref("Utilisateurs").child(localStorage.getItem("mail")).child("Album").update({snapshot.length : {"Image" : url}});
		  }
		);
	}
}*/
	
/*function uploadFile(file) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            resolve(firebase.storage().ref()
              .child('images/' + almostUniqueFileName + file.name).getDownloadURL());
              
          }
        );
      }
    );
  }*/
  
function televerserImage(dataURL) {
		const nomUnique = Date.now().toString();
		tacheTeleversement = firebase.storage().ref('/images').child(nomUnique).putString(dataURL, 'data_url', {contentType:'image/png'});  
        tacheTeleversement.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                	case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
        }, function(error) {
                alert("error : " + error);
        }, function() {
        	alert("URL1" + uploadTask.snapshot.ref.getDownloadURL());
			uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
				alert("URL2 : " + downloadURL);
                localStorage.setItem("urlImage", downloadURL);
                firebase.database().ref("Utilisateurs/" + localStorage.getItem("mail")).child("Album").once('value', function(snapshot) {
		  			firebase.database().ref("Utilisateurs").child(localStorage.getItem("mail")).child("Album").set({[snapshot.val().length] : {"Image" : downloadURL}});
		  		});
			});
        	window.location.href='Question.html';

		  });
                
}  

function afficherImage() {
	alert(localStorage.getItem("urlImage"));
	document.getElementById("photoPrise").src = localStorage.getItem("urlImage");
}

function remplirAlbum() {
 	firebase.database().ref("Utilisateurs/" + localStorage.getItem("mail")).child("Album").once('value', function(snapshot) {
 		var innerHTML = " ";
 		var i = 0;
		for (i; i< snapshot.val().length; i++) {
			if (i%4 == 0) {
				innerHTML+= "<div class=\"row mb-1 mx-1\">";
			}
		
			 innerHTML += "<div class=\"col conteneur-carre col-sm-3\"><a href=\"Details.html\"><img src=\" " + snapshot.val()[i].Image + "\"class=\"miniature w-100\"/></a></div>";
			 if (i%4 == 3) { 
			  innerHTML += "</div>";
			 }
			
		 }
		  document.getElementById("album").innerHTML = innerHTML;
		  			 
		  			
	});
				
}
function afficherNbEspeces() {
	firebase.database().ref("Utilisateurs/" + localStorage.getItem("mail")).child("NombreEspeces").once('value', function(snapshot) {
		document.getElementById("nbEspece").innerHTML = snapshot.val();
		nbEspece =  snapshot.val();
		firebase.database().ref("ListeAnimaux").once('value', function(snapshot) {
			var nbEspeceRestant = snapshot.val().length - 1 - nbEspece;
			document.getElementById("nbEspeceRestant").innerHTML = nbEspeceRestant;
		
		})
		
	})
}



		
		



