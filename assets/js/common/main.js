var MEXICANS_AUDIO_URL = "assets/audio/jarabe.mp3";

$(document).ready(function () {
    window.CARLOS = new Carlos(
        MEXICANS_AUDIO_URL,
        $('#door'),
        DOOR_STATES.CLOSED,
        onCarlosLoad
    );
});

function onCarlosLoad() {
    $('#loader-screen').css('display', 'none');
    CARLOS.play();
}