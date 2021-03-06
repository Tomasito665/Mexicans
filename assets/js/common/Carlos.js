// Get rid of audio context prefixes
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var DOOR_STATES = {
    OPENED: 'opened',
    CLOSED: 'closed'
};

// TODO: Make a door object!!

function Carlos(audioURL, doorElement, doorState, onload, onMissingFeature) {
    this.DOOR = doorElement;
    doorState = doorState || DOOR_STATES['CLOSED'];
    this.onload = onload;
    this.onMissingFeature = onMissingFeature;
    this.sleeping = false;
    this.doorOpened = false;

    this.audioPlayer = new AudioPlayer(audioURL, function() {
        // Lazy initialize nodes, otherwise the nodes might be already
        // inactive if loading takes too long (Safari)
        this.initNodes();
        this.initDoor(doorState); // Filter init and node connections

        // Carlos' onLoad
        onload();
    }.bind(this), this.ctx);
    this.audioPlayer.onended = this.sleep.bind(this);

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
        if (!this.audioPlayer.connect(this.ctx.destination)) {
            console.warn('Couldn\'t connect audio player to destination')
        }
    },

    close: function () {
        var AUDIO = this.audioPlayer;
        var FILTER = this.FILTER;


        if (!AUDIO.disconnect()) {
            console.warn('Couldn\'t disconnect audio player');
        }

        if (!AUDIO.connect(FILTER)) {
            console.warn('Couldn\'t connect audio player to filter');
        }

        FILTER.connect(this.ctx.destination);
    },

    play: function () {
        this.audioPlayer.play(function(err) {
            if (!err) return;

            if (err instanceof AudioPlayer.prototype.PlayingError) {
                this.onMissingFeature();
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
    }
};
