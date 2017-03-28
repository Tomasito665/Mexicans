var chrome   = navigator.userAgent.indexOf('Chrome') > -1;
var explorer = navigator.userAgent.indexOf('MSIE') > -1;
var firefox  = navigator.userAgent.indexOf('Firefox') > -1;
var safari   = navigator.userAgent.indexOf("Safari") > -1;
var camino   = navigator.userAgent.indexOf("Camino") > -1;
var opera    = navigator.userAgent.toLowerCase().indexOf("op") > -1;
if ((chrome) && (safari)) safari = false;
if ((chrome) && (opera)) chrome = false;


function AudioPlayer(url, onload, ctx) {
    this.ready = false;
    this.onload = onload;
    this.ctx = ctx || new AudioContext();

    this.audioNode = null;
    this.audioElement = null;

    if (!Modernizr.audio_element_can_autoplay || safari) {
        this.loadAudio_node(url);
    } else {
        this.loadAudio_element(url);
    }

    console.log("End AudioPlayer constructor()");
}

AudioPlayer.prototype = {
    loadAudio_node: function (url) {
        var ctx = this.ctx;
        this.audioNode = ctx.createBufferSource();
        this.audioNode.onended = function () {
            this.onended();
        }.bind(this);

        var startTime = new Date().getTime();

        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = function () {
            var loadTime = new Date().getTime() - startTime;
            console.log("Loaded sound in " + loadTime + " milliseconds");

            console.log("Decoding sound");
            ctx.decodeAudioData(request.response, function (buffer) {
                this.audioNode.buffer = buffer;
                this.onload();
                this.ready = true;
                console.log("Decoded sound");
            }.bind(this));
        }.bind(this);

        console.log("Loading sound (Directly into Webaudio API AudioNode)");
        request.send();
    },

    loadAudio_element: function (url) {
        var ctx = this.ctx;
        var audioElement = this.audioElement;
        var audioNode = this.audioNode;

        console.log("Loading sound (Audio DOM element)");
        audioElement = new Audio(url);
        audioElement.load();

        audioNode = ctx.createMediaElementSource(audioElement);
        $(audioElement).on('canplaythrough', function () {
            this.onload();
            this.ready = true;
        }.bind(this));

        $(audioElement).on('ended', function () {
            this.onended();
        }.bind(this));

        this.audioNode = audioNode;
        this.audioElement = audioElement;
    },

    /**
     * Play audio async. A callback function should be provided taking one error argument.
     */
    play: function (callback) {
        var audioElement = this.audioElement;

        try {
            // If audio loaded with loadAudio_element
            if (audioElement) {
                audioElement.play();
                setTimeout(function() {
                    var err = undefined;
                    if (audioElement.paused) {
                        err = new AudioPlayer.prototype
                            .PlayingError('AudioElement paused');
                    }

                    callback(err);
                }, 0);
            }

            // If audio loaded with loadAudio_node
            else {
                this.audioNode.start();
                setTimeout(function() {
                    var err = undefined;
                    if (this.ctx.state === 'suspended') {
                        err = new AudioPlayer.prototype
                            .PlayingError('AudioContext suspended');
                    }

                    callback(err);
                }.bind(this), 0);
            }
        } catch (e) {
            callback(e);
        }

    },

    connect: function (audioNode) {
        this.audioNode.connect(audioNode);
    },

    disconnect: function () {
        this.audioNode.disconnect();
    }
};

AudioPlayer.prototype.PlayingError = function(msg) { this.message = (msg || "") };
AudioPlayer.prototype.PlayingError.prototype = new Error();
