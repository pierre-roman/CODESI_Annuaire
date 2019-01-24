function deconnexion() {
    $.ajax({
        url: 'Action/Deconnexion.php'
    }).done(function (data) {
        document.location.reload(true);
    });
}