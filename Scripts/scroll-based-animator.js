const scrollBasedAnimator = (animationObjs) => {
  const mainAnimationObjs = [];

  animationObjs.forEach((animationObj) => {
    const theObj = {
      type: animationObj.type ? animationObj.type : "simple",
      axis: animationObj.axis ? animationObj.axis : "y",
      offsets: animationObj.offsets ? animationObj.offsets : [0, 0],
      stage: animationObj.stage ? animationObj.stage : 0,
      stageHandler: function (percentage) {
        if (this.stage === 0) {
          animationObj.steps[0]();
        } else if (this.stage === 1) {
          animationObj.steps[1](percentage);
        } else {
          animationObj.steps[2]();
        }
      },
    };

    if (theObj.type === "simple") {
      theObj.pointEl = animationObj.pointEl;
    } else {
      theObj.startPointEl = animationObj.startPointEl;
      theObj.finishPointEl = animationObj.finishPointEl;
    }

    mainAnimationObjs.push(theObj);
  });

  const mainAnimator = () => {
    mainAnimationObjs.forEach((animationObj) => {
      let startLine, finishLine;

      if (animationObj.type === "simple") {
        if (animationObj.axis === "y") {
          startLine =
            -animationObj.pointEl.getBoundingClientRect().top +
            innerHeight -
            animationObj.offsets[0];

          finishLine =
            -animationObj.pointEl.getBoundingClientRect().top -
            animationObj.pointEl.getBoundingClientRect().height -
            animationObj.offsets[1];
        } else {
          startLine =
            -animationObj.pointEl.getBoundingClientRect().left +
            innerWidth -
            animationObj.offsets[0];

          finishLine =
            -animationObj.pointEl.getBoundingClientRect().left -
            animationObj.pointEl.getBoundingClientRect().width -
            animationObj.offsets[1];
        }
      } else {
        if (animationObj.axis === "y") {
          startLine =
            -animationObj.startPointEl.getBoundingClientRect().top +
            innerHeight -
            animationObj.offsets[0];

          finishLine =
            -animationObj.finishPointEl.getBoundingClientRect().top +
            innerHeight -
            animationObj.offsets[1];
        } else {
          startLine =
            -animationObj.startPointEl.getBoundingClientRect().left +
            innerWidth -
            animationObj.offsets[0];

          finishLine =
            -animationObj.finishPointEl.getBoundingClientRect().left +
            innerWidth -
            animationObj.offsets[1];
        }
      }

      if (startLine > 0 && finishLine <= 0) {
        let percentage = (startLine / (startLine - finishLine)).toFixed(3);

        animationObj.stage = 1;
        animationObj.stageHandler(percentage);
      } else if (finishLine <= 0) {
        if (animationObj.stage !== 0) {
          animationObj.stage = 0;
          animationObj.stageHandler();
        }
      } else {
        if (animationObj.stage !== 2) {
          animationObj.stage = 2;
          animationObj.stageHandler();
        }
      }
    });
    requestAnimationFrame(mainAnimator);
  };
  mainAnimator();
};
