// Get rid of audio context prefixes
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var DOOR_STATES = {
    OPENED: 'opened',
    CLOSED: 'closed'
};

// TODO: Make a door object!!

function Carlos(audioURL, doorElement, doorState, onload) {
    this.DOOR = doorElement;
    doorState = doorState || DOOR_STATES['CLOSED'];
    this.onload = onload;
    this.sleeping = false;
    this.doorOpened = false;

    this.audioPlayer = new AudioPlayer(audioURL, onload, this.ctx);
    this.audioPlayer.onended = this.sleep.bind(this);

    this.initNodes();
    this.initDoor(doorState);

    // Click handler
    var me = this;
    doorElement.click(function () {
        me.doorOpened = !me.doorOpened;

        if (me.sleeping && me.doorOpened)
            $(this).toggleClass('sleeping', true);

        $(this).toggleClass('opened', me.doorOpened);
        me.toggleDoor(me.doorOpened);
    });
}

Carlos.prototype = {
    ctx: new AudioContext(),

    toggleDoor: function (state) {
        state ? this.open() : this.close();
    },

    open: function () {
        this.audioPlayer.connect(this.ctx.destination);
    },

    close: function () {
        var AUDIO = this.audioPlayer;
        var FILTER = this.FILTER;

        AUDIO.disconnect();
        AUDIO.connect(FILTER);
        FILTER.connect(this.ctx.destination);
    },

    play: function () {
        this.audioPlayer.play(function(err) {
            if (!err) return;

            if (err instanceof AudioPlayer.prototype.PlayingError) {
                this.showNotSupportedMsg();
                return;
            }

            throw err;
        }.bind(this));
    },

    initDoor: function (state) {
        var opened = null;
        if (state === DOOR_STATES['OPENED']) opened = true;
        if (state === DOOR_STATES['CLOSED']) opened = false;
        this.DOOR.toggleClass('opened', opened);
        this.toggleDoor(opened);
    },

    initNodes: function () {
        var ctx = this.ctx;

        // Audio filter node setup
        var FILTER = ctx.createBiquadFilter();
        FILTER.type = "lowpass";
        FILTER.frequency.value = 300;
        this.FILTER = FILTER;
    },

    // TODO: Make background and door two separate layers
    sleep: function () {
        $('#door')
            .toggleClass("opened", false)
            .toggleClass("sleeping", true);

        this.sleeping = true;
    },

    showNotSupportedMsg: function () {
        alert('I am so sorry, but Mexicans.eu does not work on your device.. (it doesn\'t work on iOS)');
    }
};
