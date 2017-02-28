!function() {
  const DEFAULT_SPEED = 1000;
  var twinkleContainers = [];

  function shuffle(array) {
    let counter = array.length;
    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);
      // Decrease counter by 1
      counter--;
      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  }

  var shuffle2 = function() {
    let counter = this.length;
    // While there are elements in the this
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);
      // Decrease counter by 1
      counter--;
      // And swap the last element with it
      let temp = this[counter];
      this[counter] = this[index];
      this[index] = temp;
    }
  };

  class Twinkle {
    constructor(twinkleEl, twinklesImages, twinklesToReveal, twinkleSpeed) {
      this.twinkleEl = twinkleEl;
      if (twinklesToReveal > twinklesImages.length - 1 || twinklesToReveal === null) {
        this.twinklesToReveal = twinklesImages.length - 1;
      } else {
        this.twinklesToReveal = twinklesToReveal;
      }
      this.twinklesImages = twinklesImages;
      this.twinklePosition = 0;
      this.twinkleSpeed = twinkleSpeed === null ? DEFAULT_SPEED : twinkleSpeed;
      this.twinkleSlotOrder = shuffle(Array.from({length: this.twinklesToReveal}, (v,i) => i));
      this.twinklesImages = shuffle([...this.twinklesImages]);
    }
    // placeImages creates the containers and installs the first images:
    placeImages() {
      let html = '';
      for (let i = 0; i < this.twinklesToReveal; i++) {
        let placeHolder = document.createElement('article');
        placeHolder.classList.add('js-twinkle__item');
        placeHolder.setAttribute('style','order:'+ this.twinkleSlotOrder[i]);
        this.twinklesImages[i].classList.add('on');
        placeHolder.innerHTML = this.twinklesImages[i].outerHTML;
        html += placeHolder.outerHTML;

        // take the twinkle out of the front and put it in the back
        this.twinklePosition++;
      }
      // attach the whole thing back to the dom:
      this.twinkleEl.innerHTML = html;
    }

    goLive() {
      this.twinkleEl.classList.add('is-loaded');
    }

    goTwinkle() {
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
        let activeTwinkle = thisTwinkle.twinklesImages[thisTwinkle.twinklePosition];
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
        thisTwinkle.twinklePosition = thisTwinkle.twinklePosition < (thisTwinkle.twinklesImages.length - 1) ? thisTwinkle.twinklePosition + 1 : thisTwinkle.twinklePosition = 0;
        // either reset or continue the slot position:
        incomingSlot = incomingSlot < (thisTwinkle.twinklesToReveal - 1) ? incomingSlot + 1 : incomingSlot = 0;

      }, thisTwinkle.twinkleSpeed); // repeat forever
    }
  }

  var init = function() {
    let twinkleEls = document.getElementsByClassName('js-twinkle');
    for (let twinkleEl of twinkleEls) {
      // statements
      let twinklesToReveal = twinkleEl.getAttribute('data-js-twinkle-reveal');
      let twinkleSpeed = twinkleEl.getAttribute('data-js-twinkle-speed');
      let twinkle = new Twinkle(twinkleEl, twinkleEl.children, twinklesToReveal, twinkleSpeed);

      // delete the original children
      while (twinkleEl.firstChild) { twinkleEl.removeChild(twinkleEl.firstChild); }

      twinkle.placeImages();
      twinkle.goLive();

      // add the twinkleEls to the array
      twinkleContainers.push(twinkle);
    }
  }
  init();
  twinkleContainers.forEach( twinkle => twinkle.goTwinkle() );
}();