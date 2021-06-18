let captionLength = 0;
let caption = '';
let currentIteration = 0;
const text = ['Nice Try...', null, 'Don\'t worry, we\'ll find you.', null, 'This is the end, my friend. Thank you for playing.'];

$(document).ready(function () {
    setInterval('cursorAnimation()', 600);
    captionEl = $('#caption');

    testTypingEffect(currentIteration);

    setTimeout(() => declareTimeout(), 2000);
});

function declareTimeout() {
    if (currentIteration === 4) { return };
    currentIteration++;
    if (currentIteration % 2 === 0) {
        testTypingEffect(currentIteration);
        setTimeout(declareTimeout, 4000)
    } else {
        testErasingEffect();
        setTimeout(declareTimeout, 1500);
    }
}

function testTypingEffect(i) {
    caption = text[i];
    type();
}

function type() {
    captionEl.html(caption.substr(0, captionLength++));
    if (captionLength < caption.length + 1) {
        setTimeout('type()', 50);
    } else {
        captionLength = 0;
        caption = '';
    }
}

function testErasingEffect() {
    caption = captionEl.html();
    captionLength = caption.length;
    erase();
}

function erase() {
    captionEl.html(caption.substr(0, captionLength--));
    if (captionLength >= 0) {
        setTimeout('erase()', 50);
    } else {
        captionLength = 0;
        caption = '';
    }
}

function cursorAnimation() {
    $('#cursor').animate({
        opacity: 0
    }, 'fast', 'swing').animate({
        opacity: 1
    }, 'fast', 'swing');
}