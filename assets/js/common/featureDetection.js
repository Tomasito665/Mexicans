Modernizr.addTest(
  'AudioPlayOnlyOnGesture',

  function() {
    var dummyAudio = new Audio(MEXICANS_AUDIO_URL);
    dummyAudio.play();
    var canPlay = dummyAudio.paused;
    dummyAudio.pause();
    return canPlay;
  }
);