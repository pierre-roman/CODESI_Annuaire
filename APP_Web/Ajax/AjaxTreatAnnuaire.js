function rechercher(str) {
    $.ajax({
        url: 'Action/Recherche.php',
        method: 'post',
        data: 'recherche=' + str
    }).done(function (data) {
        if (data['error'] == 'mauvais token'){
            deconnexion();
        }
        document.getElementById("content").innerHTML = data;
    });
}
function supprimer(id){
    $.ajax({
        url: 'Action/Delete.php',
        method: 'post',
        data: 'id=' + id
    }).done(function (data) {
        if (data['isUser']){
            deconnexion();
        }
        else if (data['successful']){
            document.getElementById("messageAnnaire").innerHTML = '<div style="color: green">' + data['successful'] + '</div>';
        }
        else if (data['error'])
        {
            document.getElementById("messageAnnaire").innerHTML = '<div style="color: red">' + data['error'] + '</div>';
        }
        rechercher($('#searchBar').val());

    });
    return false;
}

$(document).ready(function () {
  rechercher('');
})