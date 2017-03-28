var MEXICANS_AUDIO_URL = "assets/audio/jarabe.mp3";

$(document).ready(function () {
    window.CARLOS = new Carlos(
        MEXICANS_AUDIO_URL,
        $('#door'),
        DOOR_STATES.CLOSED,
        onCarlosLoad,
        onCarlosUnsupported
    );
});

function onCarlosLoad() {
    $('#loader-screen').css('display', 'none');
    CARLOS.play();
}

function onCarlosUnsupported() {
    $('#loader-screen').css('display', 'none');

    var memeUrl = 'assets/img/corn_trump.png';
    var spriteWidth = 307;
    var spriteHeight = 443;
    var spritePadding = 2;
    var nSprites = 2;
    var memeElement = document.createElement('div');
    var memeSpriteIndex = 0;
    $(memeElement)
        .css('background-image', 'url(' + memeUrl + ')')
        .css('width', spriteWidth + 'px')
        .css('height', spriteHeight + 'px')
        .addClass('horizontalCenterBlock')
        .click(function() {
            memeSpriteIndex = (memeSpriteIndex + 1) % 2;
            var yPos = (0).toString() + 'px';
            var xPos = ((nSprites - memeSpriteIndex) *
                (spriteWidth + spritePadding)).toString() + 'px';
            $(this).css('background-position', xPos + ' ' + yPos)
        });


    var sorryText = document.createElement('p');
    sorryText.innerHTML =
        '🌮 Oops... it looks like Mexicans.eu does not work on your device, but here is a consolatory meme 🌮';

    var consolidationText = document.createElement('p');
    consolidationText.innerHTML =
        ' 🌮 PS: Mexicans does not work on (Safari) iOS, but it does work on: Safari (OSX), Google Chrome, Firefox and Edge 🌮';

    $('#not-supported-msg-container')
        .css('display', 'block')
        .append(sorryText)
        .append(memeElement)
        .append(consolidationText);
}
