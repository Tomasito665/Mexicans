Modernizr.addTest(
    'audio_can_play_only_on_gesture',

    function () {
        var dummyAudio = new Audio(MEXICANS_AUDIO_URL);
        var playPromise = dummyAudio.play();
        var canPlay = dummyAudio.paused;
        playPromise.then(function() {
            dummyAudio.pause();
        });
        return canPlay;
    }
);