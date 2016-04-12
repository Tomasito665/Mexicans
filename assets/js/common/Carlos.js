// Get rid of audio context prefixes
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var DOOR_STATES = {
  OPENED: 'opened',
  CLOSED: 'closed'
};

function Carlos(audioURL, doorElement, doorState, onload) {
  this.DOOR = doorElement;
  doorState = doorState || DOOR_STATES['CLOSED'];
  this.onload = onload;

  this.initNodes();
  this._loadDoorSound(audioURL);
  this.initDoor(doorState);

  // Click handler
  var me = this;
  doorElement.click(function() {
    $(this).toggleClass('opened');
    var opened = $(this).hasClass('opened');
    me.toggleDoor(opened);
  });
}

Carlos.prototype = {
  ctx: new AudioContext(),

  toggleDoor: function(state) {
    state ? this.open() : this.close();
  },

  open: function() {
    this.AUDIO.connect(this.ctx.destination);
  },

  close: function() {
    var AUDIO = this.AUDIO;
    var FILTER = this.FILTER;

    AUDIO.disconnect();
    AUDIO.connect(FILTER);
    FILTER.connect(this.ctx.destination);
  },

  play: function() {
    this.AUDIO.start();
  },

  initDoor: function(state) {
    var opened = null;
    if (state == DOOR_STATES['OPENED']) opened = true;
    if (state == DOOR_STATES['CLOSED']) opened = false;
    this.DOOR.toggleClass('opened', opened);
    this.toggleDoor(opened);
  },

  initNodes: function() {
    var ctx = this.ctx;

    // Audio filter node setup
    var FILTER = ctx.createBiquadFilter();
    FILTER.type = "lowpass";
    FILTER.frequency.value = 300;
    this.FILTER = FILTER;

    // Audio source node
    this.AUDIO = ctx.createBufferSource();
    this.AUDIO.loop = true;
  },

  _loadDoorSound: function(url, onload) {
    var startTime = new Date().getTime();

    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
      var loadTime = new Date().getTime() - startTime;
      console.log("Loaded sound in " + loadTime + " milliseconds");

      console.log("Decoding sound");
      this.ctx.decodeAudioData(request.response, function(buffer) {
        this.AUDIO.buffer = buffer;
        this.onload();
        console.log("Decoded sound");
      }.bind(this));
    }.bind(this);

    console.log("Loading sound");
    request.send();
  }
};