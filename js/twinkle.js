'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function () {
  var DEFAULT_SPEED = 1000;
  var twinkleContainers = [];

  function shuffle(array) {
    var counter = array.length;
    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      var index = Math.floor(Math.random() * counter);
      // Decrease counter by 1
      counter--;
      // And swap the last element with it
      var temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  }

  var shuffle2 = function shuffle2() {
    var counter = this.length;
    // While there are elements in the this
    while (counter > 0) {
      // Pick a random index
      var index = Math.floor(Math.random() * counter);
      // Decrease counter by 1
      counter--;
      // And swap the last element with it
      var temp = this[counter];
      this[counter] = this[index];
      this[index] = temp;
    }
  };

  var Twinkle = function () {
    function Twinkle(twinkleEl, twinklesImages, twinklesToReveal, twinkleSpeed) {
      _classCallCheck(this, Twinkle);

      this.twinkleEl = twinkleEl;
      if (twinklesToReveal > twinklesImages.length - 1 || twinklesToReveal === null) {
        this.twinklesToReveal = twinklesImages.length - 1;
      } else {
        this.twinklesToReveal = twinklesToReveal;
      }
      this.twinklesImages = twinklesImages;
      this.twinklePosition = 0;
      this.twinkleSpeed = twinkleSpeed === null ? DEFAULT_SPEED : twinkleSpeed;
      this.twinkleSlotOrder = shuffle(Array.from({ length: this.twinklesToReveal }, function (v, i) {
        return i;
      }));
      this.twinklesImages = shuffle([].concat(_toConsumableArray(this.twinklesImages)));
    }
    // placeImages creates the containers and installs the first images:


    _createClass(Twinkle, [{
      key: 'placeImages',
      value: function placeImages() {
        var html = '';
        for (var i = 0; i < this.twinklesToReveal; i++) {
          var placeHolder = document.createElement('article');
          placeHolder.classList.add('js-twinkle__item');
          placeHolder.setAttribute('style', 'order:' + this.twinkleSlotOrder[i]);
          this.twinklesImages[i].classList.add('on');
          placeHolder.innerHTML = this.twinklesImages[i].outerHTML;
          html += placeHolder.outerHTML;

          // take the twinkle out of the front and put it in the back
          this.twinklePosition++;
        }
        // attach the whole thing back to the dom:
        this.twinkleEl.innerHTML = html;
      }
    }, {
      key: 'goLive',
      value: function goLive() {
        this.twinkleEl.classList.add('is-loaded');
      }
    }, {
      key: 'goTwinkle',
      value: function goTwinkle() {
        // there are 4 twinkle states:
        // 1) inactive
        // 2) active
        // 3) incoming
        // 4) outgoing
        // 1) inactive (again)
        // these states are animated using css
        var thisTwinkle = this;
        var incomingSlot = 0; // incoming slot starts at slot 0
        var transitionSlot = -1;
        var deleteSlot = -2;

        window.setInterval(function () {

          // make the incoming one have the correct class:
          var activeTwinkle = thisTwinkle.twinklesImages[thisTwinkle.twinklePosition];
          activeTwinkle.classList.remove('on');
          activeTwinkle.classList.add('incoming');
          thisTwinkle.twinkleEl.children[incomingSlot].innerHTML = activeTwinkle.outerHTML + thisTwinkle.twinkleEl.children[incomingSlot].innerHTML;

          if (transitionSlot >= 0) {
            thisTwinkle.twinkleEl.children[transitionSlot].children[0].classList.remove('incoming');
            thisTwinkle.twinkleEl.children[transitionSlot].children[0].classList.add('on');

            thisTwinkle.twinkleEl.children[transitionSlot].children[1].classList.remove('on');
            thisTwinkle.twinkleEl.children[transitionSlot].children[1].classList.add('outgoing');
          }

          if (deleteSlot >= 0) {
            thisTwinkle.twinkleEl.children[deleteSlot].removeChild(thisTwinkle.twinkleEl.children[deleteSlot].children[1]);
            deleteSlot = transitionSlot;
          } else {
            // ratchet up the delete slot until the 3rd iteration to start deleting
            deleteSlot++;
          }

          // build the stuff for the next go'round
          transitionSlot = incomingSlot;

          // Move the twinkle Position
          thisTwinkle.twinklePosition = thisTwinkle.twinklePosition < thisTwinkle.twinklesImages.length - 1 ? thisTwinkle.twinklePosition + 1 : thisTwinkle.twinklePosition = 0;
          // either reset or continue the slot position:
          incomingSlot = incomingSlot < thisTwinkle.twinklesToReveal - 1 ? incomingSlot + 1 : incomingSlot = 0;
        }, thisTwinkle.twinkleSpeed); // repeat forever
      }
    }]);

    return Twinkle;
  }();

  var init = function init() {
    var twinkleEls = document.getElementsByClassName('js-twinkle');
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = twinkleEls[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var twinkleEl = _step.value;

        // statements
        var twinklesToReveal = twinkleEl.getAttribute('data-js-twinkle-reveal');
        var twinkleSpeed = twinkleEl.getAttribute('data-js-twinkle-speed');
        var twinkle = new Twinkle(twinkleEl, twinkleEl.children, twinklesToReveal, twinkleSpeed);

        // delete the original children
        while (twinkleEl.firstChild) {
          twinkleEl.removeChild(twinkleEl.firstChild);
        }

        twinkle.placeImages();
        twinkle.goLive();

        // add the twinkleEls to the array
        twinkleContainers.push(twinkle);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };
  init();
  twinkleContainers.forEach(function (twinkle) {
    return twinkle.goTwinkle();
  });
}();
//# sourceMappingURL=twinkle.js.map
