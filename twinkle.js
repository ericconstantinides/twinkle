!function() {
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

  var Twinkle = function(twinkleEl, twinkles, twinklesToReveal = 5, twinkleSpeed = 1000) {
    this.twinkleEl = twinkleEl;
    if (twinklesToReveal > twinkles.length - 1) {
      twinklesToReveal = twinkles.length - 1;
    }
    this.twinklesToReveal = twinklesToReveal;
    this.twinkles = twinkles;
    this.twinklePosition = 0;
    this.twinkleSpeed = twinkleSpeed;
  }
  Twinkle.prototype.makeSlotOrder = function() {
    let positionArray = []; // these will be the randomized positions
    for (let i = 0; i < this.twinklesToReveal; i++) {
      positionArray.push(i);
    };
    this.twinkleSlotOrder = shuffle(positionArray);
  };

  /*
   * shuffleImages shuffles and turns images into an array
   */
  Twinkle.prototype.shuffleImages = function(numOfImages) {
    let imageOrderArray = []; // these will be the randomized positions
    for (let i = 0; i < numOfImages; i++) {
      imageOrderArray.push(i);
    };
    let tempTwinkles = [];
    imageOrderArray = shuffle(imageOrderArray);
    for (let i = 0; i < imageOrderArray.length; i++) {
      tempTwinkles[i] = this.twinkles[imageOrderArray[i]];
    }
    this.twinkles = tempTwinkles;
  }

  /*
   * placeImages creates the containers and installs the first images:
   */
  Twinkle.prototype.placeImages = function() {
    var html = '';
    for (let i = 0; i < this.twinklesToReveal; i++) {
      let placeHolder = document.createElement('article');
      placeHolder.classList.add('js-twinkle__item');
      placeHolder.setAttribute('style','order:'+ this.twinkleSlotOrder[i]);
      this.twinkles[i].classList.add('on');
      placeHolder.innerHTML = this.twinkles[i].outerHTML;
      html += placeHolder.outerHTML;

      // take the twinkle out of the front and put it in the back
      this.twinklePosition++;
    }
    // attach the whole thing back to the dom:
    this.twinkleEl.innerHTML = html;
  }
  Twinkle.prototype.goLive = function() {
    this.twinkleEl.classList.add('is-loaded');
  }

  Twinkle.prototype.goTwinkle = function() {
    // there are 4 twinkle states:
    // 1) inactive
    // 2) active
    // 3) incoming
    // 4) outgoing
    // 1) inactive (again)
    // these states are animated using css
    var myTwinkle = this;
    var incomingSlot = 0; // incoming slot starts at slot 0
    var transitionSlot = -1;
    var deleteSlot = -2;

    window.setInterval(function () {

      // make the incoming one have the correct class:
      let activeTwinkle = myTwinkle.twinkles[myTwinkle.twinklePosition];
      activeTwinkle.classList.remove('on');
      activeTwinkle.classList.add('incoming');
      myTwinkle.twinkleEl.children[incomingSlot].innerHTML = activeTwinkle.outerHTML + myTwinkle.twinkleEl.children[incomingSlot].innerHTML;

      if (transitionSlot >= 0) {
        myTwinkle.twinkleEl.children[transitionSlot].children[0].classList.remove('incoming');
        myTwinkle.twinkleEl.children[transitionSlot].children[0].classList.add('on');

        myTwinkle.twinkleEl.children[transitionSlot].children[1].classList.remove('on');
        myTwinkle.twinkleEl.children[transitionSlot].children[1].classList.add('outgoing');
      }

      if (deleteSlot >= 0) {
        myTwinkle.twinkleEl.children[deleteSlot].removeChild(myTwinkle.twinkleEl.children[deleteSlot].children[1]);
        deleteSlot = transitionSlot;
      } else {
        // ratchet up the delete slot until the 3rd iteration to start deleting
        deleteSlot++;
      }

      // build the stuff for the next go'round
      transitionSlot = incomingSlot;

      // Move the twinkle Position
      myTwinkle.twinklePosition = myTwinkle.twinklePosition < (myTwinkle.twinkles.length - 1) ? myTwinkle.twinklePosition + 1 : myTwinkle.twinklePosition = 0;
      // either reset or continue the slot position:
      incomingSlot = incomingSlot < (myTwinkle.twinklesToReveal - 1) ? incomingSlot + 1 : incomingSlot = 0;

    }, myTwinkle.twinkleSpeed); // repeat forever, polling every 1 seconds
  }


  var TwinklesArray = [];

  var init = function() {
    var twinkles;
    twinkles = document.getElementsByClassName('js-twinkle');
    if (twinkles.length) {
      for (let i = 0; i < twinkles.length; i++) {
        let twinklesToReveal = twinkles[i].getAttribute('data-js-twinkle-reveal');
        let twinkleSpeed = twinkles[i].getAttribute('data-js-twinkle-speed');
        let twinkle = new Twinkle(twinkles[i], twinkles[i].children, twinklesToReveal, twinkleSpeed);
        twinkle.makeSlotOrder.call(twinkle);
        twinkle.shuffleImages.call(twinkle, twinkle.twinkles.length);

        // delete the original children
        while (twinkles[i].firstChild) { twinkles[i].removeChild(twinkles[i].firstChild); }

        twinkle.placeImages.call(twinkle);
        twinkle.goLive.call(twinkle);

        // add the twinkles to the array
        TwinklesArray.push(twinkle);
      }
    }
  }
  init();
  for (let i = 0; i < TwinklesArray.length; i++) {
    TwinklesArray[i].goTwinkle.call(TwinklesArray[i]);
  }
}();