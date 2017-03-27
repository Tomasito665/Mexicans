Modernizr.addTest(
    'audio_element_can_autoplay',

    function () {
        var elem = document.createElement('audio');
        var elemStyle = elem.style;

        if (!Modernizr.audio) {
            return false;
        }

        elemStyle.position = 'absolute';
        elemStyle.height = 0;
        elemStyle.width = 0;

        // NOTE - Although not really part of this test, we make
        // the assertion that mp3 is supported
        if (!Modernizr.audio.mp3) {
            return false;
        }

        try {
            // 75ms of silence (minimum Mp3 duration loaded by Safari, not
            // tested other formats thoroughly: may be possible to shrink base64 URI)
            elem.src = 'data:audio/mpeg;base64,//MUxAAB6AXgAAAAAPP+c6nf//yi/6f3//MUxAMAAAIAAAjEcH//0fTX6C9Lf//0//MUxA4BeAIAAAAAAKX2/6zv//+IlR4f//MUxBMCMAH8AAAAABYWalVMQU1FMy45//MUxBUB0AH0AAAAADkuM1VVVVVVVVVV//MUxBgBUATowAAAAFVVVVVVVVVVVVVV';
        } catch (e) {
            return false;
        }

        elem.play();
        return !elem.paused;
    }
);
