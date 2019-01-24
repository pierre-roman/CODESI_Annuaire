function connexion(mail, mdp) {
    $.ajax({
        url: 'Action/Connexion.php',
        method: 'post',
        data: 'mail=' + mail + '&mdp=' + mdp
    }).done(function (data) {
        if (data['error']){
            document.getElementById("errorConnexion").innerHTML = '<div style="color: red">' + data['error'] + '</div>';
        }
        else{
            document.location.reload(true);
        }
    });
}
function inscription(mail, mdp, tel, nom, prenom){
    $.ajax({
        url: 'Action/Inscription.php',
        method: 'post',
        data: 'mail=' + mail + '&mdp=' + mdp + '&tel=' + tel + '&nom=' + nom +'&prenom=' + prenom
    }).done(function (data) {
        if (data['error']){
            document.getElementById("errorInscription").innerHTML = '<div style="color: red">' + data['error'] + '</div>';
        }
        else if (data['reponse']){
            document.getElementById("errorInscription").innerHTML = '<div style="color: green">' + data['reponse'] + '</div>';
        }
    });
}

$("#connexionButton").click(function () {
   connexion($("#connexionMail").val(), $("#connexionMDP").val());
});

$("#inscriptionButton").click(function () {
    inscription($("#inscriptionMail").val(), $("#inscriptionMDP").val(), $("#inscriptionTel").val(), $("#inscriptionNom").val(), $("#inscriptionPrenom").val());
});