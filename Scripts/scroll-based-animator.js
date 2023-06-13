// Main Scroll Animation ---

const scrollBasedAnimator = (animationObjs) => {
  const mainAnimationObjs = [];

  animationObjs.forEach((animationObj) => {
    const theObj = {
      type: animationObj.type ? animationObj.type : "simple",
      axis: animationObj.axis ? animationObj.axis : "y",
      offsets: animationObj.offsets ? animationObj.offsets : [0, 0],
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
      theObj.stage = animationObj.stage ? animationObj.stage : undefined;
    } else {
      theObj.startPointEl = animationObj.startPointEl;
      theObj.finishPointEl = animationObj.finishPointEl;
      theObj.stage = animationObj.stage ? animationObj.stage : 0;
    }

    mainAnimationObjs.push(theObj);
  });

  const mainAnimator = () => {
    mainAnimationObjs.forEach((animationObj) => {
      let startLine, finishLine;

      if (animationObj.type === "simple") {
        let pointElBoundingClient =
          animationObj.pointEl.getBoundingClientRect();

        if (animationObj.axis === "y") {
          startLine =
            -pointElBoundingClient.top + innerHeight - animationObj.offsets[0];

          finishLine =
            -pointElBoundingClient.top -
            pointElBoundingClient.height -
            animationObj.offsets[1];
        } else {
          startLine =
            -pointElBoundingClient.left + innerWidth - animationObj.offsets[0];

          finishLine =
            -pointElBoundingClient.left -
            pointElBoundingClient.width -
            animationObj.offsets[1];
        }
      } else {
        let startElBoundingClient =
            animationObj.startPointEl.getBoundingClientRect(),
          finishElBoundingClient =
            animationObj.finishPointEl.getBoundingClientRect();

        if (animationObj.axis === "y") {
          startLine =
            -startElBoundingClient.top + innerHeight - animationObj.offsets[0];

          finishLine =
            -finishElBoundingClient.top + innerHeight - animationObj.offsets[1];
        } else {
          startLine =
            -startElBoundingClient.left + innerWidth - animationObj.offsets[0];

          finishLine =
            -finishElBoundingClient.left + innerWidth - animationObj.offsets[1];
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

// Sticky Animation ---

const stickyAnimator = (animationObjs) => {
  const mainAnimationObjs = [];

  animationObjs.forEach((animationObj) => {
    const theObj = {
      axis: animationObj.axis ? animationObj.axis : "y",
      offsets: animationObj.offsets ? animationObj.offsets : [0, 0],
      stage: animationObj.stage ? animationObj.stage : undefined,
    };

    theObj.pointEl = animationObj.pointEl;
    theObj.parentEl = animationObj.parentEl
      ? animationObj.parentEl
      : theObj.pointEl.parentElement;

    mainAnimationObjs.push(theObj);

    theObj.pointEl.style.position = "relative";
  });

  const mainAnimator = () => {
    mainAnimationObjs.forEach((animationObj) => {
      let pointElBoundingClient = animationObj.pointEl.getBoundingClientRect(),
        parentElBoundingCLient = animationObj.parentEl.getBoundingClientRect(),
        mainValue,
        endValue;

      if (animationObj.axis === "y") {
        mainValue = -parentElBoundingCLient.top + animationObj.offsets[0];

        endValue =
          parentElBoundingCLient.height -
          pointElBoundingClient.height -
          animationObj.offsets[1];
      } else {
        mainValue = -parentElBoundingCLient.left + animationObj.offsets[0];

        endValue =
          parentElBoundingCLient.width -
          pointElBoundingClient.width -
          animationObj.offsets[1];
      }

      if (mainValue > 0 && mainValue < endValue) {
        animationObj.stage = 1;
        mainValue = mainValue.toFixed(3);

        if (animationObj.axis === "y")
          animationObj.pointEl.style.top = `${mainValue}px`;
        // animationObj.pointEl.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${mainValue}, 0, 1)`;
        else animationObj.pointEl.style.left = `${mainValue}px`;
        // animationObj.pointEl.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${mainValue}, 0, 0, 1)`;
      } else if (mainValue <= 0) {
        if (animationObj.stage !== 0) {
          animationObj.stage = 0;

          // animationObj.pointEl.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)`;

          animationObj.pointEl.style.top = `0`;
          animationObj.pointEl.style.left = `0`;
        }
      } else {
        if (animationObj.stage !== 2) {
          animationObj.stage = 2;

          if (animationObj.axis === "y")
            animationObj.pointEl.style.top = `${endValue}px`;
          // animationObj.pointEl.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${endValue}, 0, 1)`;
          else animationObj.pointEl.style.left = `${endValue}px`;
          // animationObj.pointEl.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${endValue}, 0, 0, 1)`;
        }
      }
    });
    requestAnimationFrame(mainAnimator);
  };
  mainAnimator();
};
