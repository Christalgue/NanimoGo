// inclusion du header et du footer
$(document).ready($(function(){
  $("#header").load("header.html"); 
  
  $("#footer").load("footer.html", function() {
	// dans le processus d'identification, on ajoute des fenêtres modales de confimation
	// avant de rediriger
	
	if (top.location.pathname.endsWith("Question.html") || top.location.pathname.endsWith("Comparaison.html"))
	{
	  $( "#footer a" ).click( function (link){
		$( "<p title='Confirmation'>Veux-tu vraiment quitter l'identification ?</p>" ).dialog({
		  resizable: false,
		  height: "auto",
		  width: 400,
		  modal: true,
		  buttons: {
			"Oui": function() {
			  $( this ).dialog( "close" );
			  document.location = link.currentTarget.href;
			},
			"Non": function() {
			  $( this ).dialog( "close" );
			}
		  }
		});
    	return false;
	  });
	}
  });
}));

