Modernizr.addTest(
    'audio_can_play_only_on_gesture',

    function () {
        var dummyAudio = new Audio(MEXICANS_AUDIO_URL);
        dummyAudio.play();
        var canPlay = dummyAudio.paused;
        dummyAudio.pause();
        return canPlay;
    }
);