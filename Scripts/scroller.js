const smoothScroller = function (settings) {
  "use strict";

  // Settings obj
  settings = {
    customScrollbar: settings?.customScrollbar === undefined ? true : false,
    accessMainObjects: settings?.accessMainObjects === undefined ? false : true,
  };

  // Defining Variables
  let allScrollerEls,
    allSubScrollerEls = [
      ...document.querySelectorAll(".sub-scroller-main-cont"),
    ],
    allTabNavigators,
    activeNavIndex = -1,
    activeScrollObj = undefined,
    scrollerExtraValue = 0;

  const allScrollerObjs = [],
    allSubScrollerObjs = [],
    minScrollbarHeight = Math.round(innerWidth * (2.5 / 100));

  // ----- ( 1 )
  // ----- Initialisations ----- >>>

  const subScrollerInitializer = () => {
    if (allSubScrollerEls) {
      for (let i = 0; i < allSubScrollerEls.length; i++) {
        const oldInnerEls = allSubScrollerEls[i].innerHTML,
          newInnerEls = `
            <div class="sub-scroller-cont">
              <div class="sub-scroller-page">
                ${oldInnerEls}
              </div>
            </div>
            <div class="scroller-height"></div>
          `;

        allSubScrollerEls[i].innerHTML = newInnerEls;
        allSubScrollerEls = [
          ...document.querySelectorAll(".sub-scroller-main-cont"),
        ];
      }
    }
  };
  subScrollerInitializer();

  allScrollerEls = [...document.querySelectorAll(".scroller-main-cont")];

  const scrollerInitializer = () => {
    if (allScrollerEls) {
      for (let i = 0; i < allScrollerEls.length; i++) {
        const oldInnerEls = allScrollerEls[i].innerHTML,
          newInnerEls = `
            <div class="scroller-cont">
              <div class="scroller-page-wrapper">
                <div class="scroller-page">
                  ${oldInnerEls}
                </div>
              </div>

              <div class="scrollbarY-cont">
                <div class="scrollbarY"></div>
              </div>

              <div class="scrollbarX-cont">
                <div class="scrollbarX"></div>
              </div>
            </div>
            <div class="scroller-height"></div>
          `;

        allScrollerEls[i].innerHTML = newInnerEls;
        allScrollerEls = [...document.querySelectorAll(".scroller-main-cont")];
      }
    }
  };
  scrollerInitializer();

  allSubScrollerEls = [...document.querySelectorAll(".sub-scroller-main-cont")];

  // Sub Scroller Functions
  const subScrollerHeightFix = (theObj) => {
    let oldValue = theObj.scrollHeight,
      newValue = Math.floor(theObj.page.getBoundingClientRect().width);

    if (newValue !== oldValue) {
      theObj.scrollHeight = newValue;
      let theHeight = newValue - theObj.scrollerCont.clientWidth;
      theObj.heightEl.style.height = `${theHeight >= 0 ? theHeight : 0}px`;
    }
  };

  const subScrollerObjMaker = () => {
    allSubScrollerEls?.forEach((theEl) => {
      const theObj = {
        mainCont: theEl,
        scrollerCont: theEl.children[0],
        page: theEl.children[0].firstElementChild,
        heightEl: theEl.children[1],
        scrollHeight: 0,
        stage: -1, // An a innitial value of stage
      };

      allSubScrollerObjs.push(theObj);
      subScrollerHeightFix(theObj);
    });
  };
  subScrollerObjMaker();

  // Main Sub-scroller Function
  const subScroller = (theObj) => {
    let theValue = theObj.mainCont.getBoundingClientRect().top;
    if (theValue < 0 && theValue > -theObj.heightEl.clientHeight) {
      theObj.page.style.left = `${theValue}px`;
      theObj.stage = 1;
    } else if (theValue >= 0 && theObj.stage !== 0) {
      theObj.stage = 0;
      theObj.page.style.left = `0`;
    } else if (
      theValue <= -theObj.heightEl.clientHeight &&
      theObj.stage !== 2
    ) {
      theObj.stage = 2;
      theObj.page.style.left = `${-theObj.heightEl.clientHeight}px`;
    }
  };

  // Tab nav ELs
  const tabNavigatorFinder = (parent) => {
    return [
      ...parent.querySelectorAll(
        "a, [href], button, input, select, textarea, [tabindex]"
      ),
    ].filter((theEl) => theEl.tabIndex !== -1);
  };

  allTabNavigators = tabNavigatorFinder(allScrollerEls[0]);

  // Height Width Calculator
  const elHeightCalc = (theObj) => {
    let elHeight = Math.floor(theObj.page.getBoundingClientRect().height),
      elWidth = Math.floor(theObj.page.getBoundingClientRect().width);
    let thisScrollHeights = [elWidth, elHeight];

    if (theObj.mainCont.classList.contains("auto-scrollerX"))
      thisScrollHeights[1] =
        elWidth -
        theObj.mainCont.clientWidth +
        theObj.mainCont.clientHeight +
        theObj.scrollbarY.clientWidth;
    else if (
      !theObj.mainCont.classList.contains("scrollerX") &&
      !theObj.mainCont.classList.contains("scrollerY")
    ) {
      thisScrollHeights[1] = elHeight + theObj.scrollbarX.clientHeight;
      thisScrollHeights[0] = elWidth + theObj.scrollbarY.clientWidth;
    }
    return [thisScrollHeights, elHeight, elWidth];
  };

  const scrollHeightFixer = (
    theObj,
    [thisScrollHeights, elHeight, elWidth]
  ) => {
    // For Scroller Height El
    theObj.scrollHeights[0] = thisScrollHeights[0];
    theObj.scrollHeights[1] = thisScrollHeights[1];

    if (theObj.mainCont.classList.contains("scrollerY")) {
      theObj.heightEl.style.height = `${thisScrollHeights[1]}px`;
    } else if (theObj.mainCont.classList.contains("scrollerX")) {
      theObj.heightEl.style.width = `${thisScrollHeights[0]}px`;
    } else if (theObj.mainCont.classList.contains("auto-scrollerX")) {
      theObj.heightEl.style.height = `${thisScrollHeights[1]}px`;
    } else {
      theObj.heightEl.style.height = `${thisScrollHeights[1]}px`;
      theObj.heightEl.style.width = `${thisScrollHeights[0]}px`;
    }

    // Scrollbar Height fixer
    if (settings.customScrollbar) {
      // For Scrollbar Height and Width
      let scrollbarWidth =
          Math.ceil(
            (theObj.scrollbarXCont.clientWidth / elWidth) *
              theObj.scrollbarXCont.clientWidth
          ) + theObj.scrollbarYCont.clientWidth,
        scrollbarHeight;

      if (theObj.mainCont.classList.contains("auto-scrollerX")) {
        scrollbarHeight = Math.ceil(
          (theObj.scrollbarYCont.clientHeight /
            (elWidth -
              theObj.pageWrapper.clientWidth +
              theObj.pageWrapper.clientHeight)) *
            theObj.scrollbarYCont.clientHeight
        );
      } else {
        scrollbarHeight =
          Math.ceil(
            (theObj.scrollbarYCont.clientHeight / elHeight) *
              theObj.scrollbarYCont.clientHeight
          ) + theObj.scrollbarXCont.clientHeight;
      }

      scrollbarHeight =
        scrollbarHeight > minScrollbarHeight
          ? scrollbarHeight < theObj.scrollbarYCont.clientHeight
            ? scrollbarHeight
            : theObj.scrollbarYCont.clientHeight
          : minScrollbarHeight;

      scrollbarWidth =
        scrollbarWidth > minScrollbarHeight
          ? scrollbarWidth < theObj.scrollbarXCont.clientWidth
            ? scrollbarWidth
            : theObj.scrollbarXCont.clientWidth
          : minScrollbarHeight;

      theObj.scrollbarY.style.height = `${scrollbarHeight}px`;
      theObj.scrollbarX.style.width = `${scrollbarWidth}px`;

      // Hide inactive Scrollbar
      if (elHeight <= theObj.pageWrapper.clientHeight) {
        if (!theObj.mainCont.classList.contains("auto-scrollerX"))
          theObj.mainCont.classList.add("hide-scrollerY");
      } else {
        theObj.mainCont.classList.remove("hide-scrollerY");
      }

      if (elWidth <= theObj.pageWrapper.clientWidth) {
        !theObj.mainCont.classList.contains("auto-scrollerX")
          ? theObj.mainCont.classList.add("hide-scrollerX")
          : theObj.mainCont.classList.add("hide-scrollerY");
      } else {
        !theObj.mainCont.classList.contains("auto-scrollerX")
          ? theObj.mainCont.classList.remove("hide-scrollerX")
          : theObj.mainCont.classList.remove("hide-scrollerY");
      }

      // Fixing scrollbar scrolling ratio
      theObj.scrollRatio[0] = (
        (elWidth - theObj.pageWrapper.clientWidth) /
        (theObj.scrollbarXCont.clientWidth - scrollbarWidth)
      ).toFixed(3);

      theObj.scrollRatio[1] = theObj.mainCont.classList.contains(
        "auto-scrollerX"
      )
        ? (
            (elWidth -
              theObj.mainCont.clientWidth +
              theObj.mainCont.clientHeight +
              theObj.scrollbarY.clientWidth) /
            theObj.scrollbarYCont.clientHeight
          ).toFixed(3)
        : (
            (elHeight - theObj.pageWrapper.clientHeight) /
            (theObj.scrollbarYCont.clientHeight - scrollbarHeight)
          ).toFixed(3);
    } else {
      theObj.mainCont.classList.add("hide-scrollerX");
      theObj.mainCont.classList.add("hide-scrollerY");
      theObj.mainCont.classList.add("default-scroller");
    }
  };

  const scrollerObjMaker = () => {
    allScrollerEls?.forEach((theEl, i) => {
      const theObj = {
        mainCont: theEl,
        // pageCont: theEl.children[0],
        pageWrapper: theEl.children[0].children[0],
        page: theEl.children[0].children[0].firstElementChild,
        scrollbarYCont: theEl.children[0].children[1],
        scrollbarY: theEl.children[0].children[1].firstElementChild,
        scrollbarXCont: theEl.children[0].children[2],
        scrollbarX: theEl.children[0].children[2].firstElementChild,
        heightEl: theEl.children[1],
        scrollValues: [0, 0],
        scrollHeights: [0, 0],
        scrollRatio: [0, 0],
      };

      scrollHeightFixer(theObj, elHeightCalc(theObj));
      allScrollerObjs.push(theObj);

      // Detecting nested Sub-scroller
      [...theEl.querySelectorAll(".sub-scroller-main-cont")].forEach((el) => {
        el.dataset.mainScrollerIndex = i;
      });

      // Page mover by thumb - Function
      if (settings.customScrollbar) {
        theObj.scrollbarX.addEventListener("pointerdown", () => {
          activeScrollObj = [theObj, "X"];
          document.body.classList.add("scroller-activated");
        });
        theObj.scrollbarX.addEventListener("touchstart", (theEvent) => {
          if (theEvent.cancelable) theEvent.preventDefault();
        });

        theObj.scrollbarY.addEventListener("pointerdown", () => {
          activeScrollObj = [theObj, "Y"];
          document.body.classList.add("scroller-activated");
        });
        theObj.scrollbarY.addEventListener("touchstart", (theEvent) => {
          if (theEvent.cancelable) theEvent.preventDefault();
        });
      }
    });
  };
  scrollerObjMaker();

  // ----- ( 2 )
  // ----- Main Scroller functions ----- >>>

  // Scrollbar thumb mover events
  window.addEventListener("pointerup", () => {
    if (activeScrollObj) {
      activeScrollObj = undefined;
      scrollerExtraValue = 0;
      document.body.classList.remove("scroller-activated");
    }
  });

  // Custom Scrollbar's functions
  if (settings.customScrollbar) {
    const scrollerExtraValueCalc = (theValue) => {
      scrollerExtraValue += theValue % 1;
      let thisExtraValue = 0;

      if (Math.abs(scrollerExtraValue) > 1) {
        thisExtraValue = Math.trunc(scrollerExtraValue);
        scrollerExtraValue -= thisExtraValue;
      }
      return thisExtraValue;
    };

    window.addEventListener("pointermove", (theEvent) => {
      if (activeScrollObj) {
        theEvent.preventDefault();
        let theObj = activeScrollObj[0],
          theValue;

        if (activeScrollObj[1] === "X") {
          theValue = theEvent.movementX * theObj.scrollRatio[0];
          theObj.mainCont.scrollBy(
            Math.trunc(theValue) + scrollerExtraValueCalc(theValue),
            0
          );
        } else {
          theValue = theEvent.movementY * theObj.scrollRatio[1];
          theObj.mainCont.scrollBy(
            0,
            Math.trunc(theValue) + scrollerExtraValueCalc(theValue)
          );
        }
      }
    });
  }

  // Resizer handler - function
  const containerResizer = function (theObj, windowResized = false) {
    const oldValues = theObj.scrollHeights,
      elHeights = elHeightCalc(theObj),
      newValues = elHeights[0];

    if (
      !(oldValues[0] === newValues[0] && oldValues[1] === newValues[1]) ||
      windowResized
    ) {
      scrollHeightFixer(theObj, elHeights);
    }
  };

  window.addEventListener("resize", () => {
    allScrollerObjs.forEach((theObj) => {
      containerResizer(theObj, true);
    });
  });

  // Main scroll animator function
  const scrollerAnimator = () => {
    allScrollerObjs.forEach((theObj) => {
      let thisScrollValues = theObj.mainCont.classList.contains(
        "auto-scrollerX"
      )
        ? [-theObj.mainCont.scrollTop, 0]
        : [-theObj.mainCont.scrollLeft, -theObj.mainCont.scrollTop];

      if (
        !(
          theObj.scrollValues[0] === thisScrollValues[0] &&
          theObj.scrollValues[1] === thisScrollValues[1]
        )
      ) {
        theObj.page.style.left = `${thisScrollValues[0]}px`;
        theObj.page.style.top = `${thisScrollValues[1]}px`;

        // Setting's condition
        if (settings.customScrollbar) {
          theObj.scrollbarX.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${
            -thisScrollValues[0] / theObj.scrollRatio[0]
          }, 0, 0, 1)`;

          theObj.scrollbarY.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${
            theObj.mainCont.classList.contains("auto-scrollerX")
              ? -thisScrollValues[0] / theObj.scrollRatio[1]
              : -thisScrollValues[1] / theObj.scrollRatio[1]
          }, 0, 1)`;
        }

        theObj.scrollValues = thisScrollValues;
      }
      allSubScrollerObjs?.forEach((theObj) => subScroller(theObj));

      containerResizer(theObj);
    });

    allSubScrollerObjs?.forEach((theObj) => subScrollerHeightFix(theObj));

    requestAnimationFrame(scrollerAnimator);
  };
  scrollerAnimator();

  // ----- ( 3 )
  // ----- Navigator functions ----- >>>

  // Target element's offset calculator
  const offsetCalc = (theEl, parentObj) => {
    let offsetTop = 0,
      offsetLeft = 0;

    if (theEl.offsetParent !== parentObj.page) {
      let el = theEl;
      while (el !== parentObj.page) {
        offsetLeft += el.offsetLeft;
        offsetTop += el.offsetTop;
        el = el.offsetParent;
      }
    } else {
      offsetLeft = theEl.offsetLeft;
      offsetTop = theEl.offsetTop;
    }
    return [offsetLeft, offsetTop];
  };

  const subScrollerNestedInedxFinder = (theEl) => {
    let subScrollerNestedInedx = undefined;
    allSubScrollerEls?.forEach((el) => {
      if (el.contains(theEl))
        subScrollerNestedInedx = el.dataset.mainScrollerIndex;
    });
    return subScrollerNestedInedx;
  };

  // Scroll to any point function
  const scrollToPoint = (theEl, parentObj, screenOffsets) => {
    let offsetLeft,
      offsetTop,
      mainCont = parentObj.mainCont,
      subScrollerNestedInedx = subScrollerNestedInedxFinder(theEl);

    if (subScrollerNestedInedx === undefined) {
      [offsetLeft, offsetTop] = offsetCalc(theEl, parentObj);
    }

    if (mainCont.classList.contains("scrollerY")) {
      if (subScrollerNestedInedx !== undefined) {
        let subScrollerNestedObj = allSubScrollerObjs[subScrollerNestedInedx];

        [offsetLeft, offsetTop] = offsetCalc(theEl, subScrollerNestedObj);

        let extraOffsetLeft =
          offsetLeft +
          theEl.clientWidth -
          subScrollerNestedObj.scrollerCont.clientWidth;
        extraOffsetLeft = extraOffsetLeft < 0 ? 0 : extraOffsetLeft;

        let [, subOffsetTop] = offsetCalc(
          subScrollerNestedObj.mainCont,
          parentObj
        );

        subScrollerNestedObj.scrollerCont.scrollTo(0, 0);
        mainCont.scrollTo(0, subOffsetTop + extraOffsetLeft);
      } else {
        mainCont.scrollTo(0, Math.round(offsetTop - screenOffsets[1]));
      }
    } else if (mainCont.classList.contains("scrollerX")) {
      mainCont.scrollTo(Math.round(offsetLeft - screenOffsets[0]), 0);
    } else if (mainCont.classList.contains("auto-scrollerX")) {
      mainCont.scrollTo(0, Math.round(offsetLeft - screenOffsets[0]));
    } else {
      mainCont.scrollTo(
        Math.round(offsetLeft - screenOffsets[0]),
        Math.round(offsetTop - screenOffsets[1])
      );
    }
  };

  // Making array of Nesting sequence of target element
  const navSetCalc = (theEl) => {
    const navSet = [];

    allScrollerEls.forEach((el, i) => {
      if (el.contains(theEl)) navSet.push(i);
    });
    return navSet.sort();
  };

  // Main Scroll to any element - function
  const scrollToPointHandler = (activeEl, screenOffsets) => {
    let activeElNavSet = navSetCalc(activeEl),
      currentNavObj =
        allScrollerObjs[activeElNavSet[activeElNavSet.length - 1]];

    screenOffsets =
      screenOffsets === undefined
        ? [
            currentNavObj.mainCont.clientWidth / 3,
            currentNavObj.mainCont.clientHeight / 3,
          ]
        : screenOffsets;

    activeEl.focus();

    activeElNavSet.forEach((tabSetIndex, i) => {
      if (i !== 0)
        scrollToPoint(
          allScrollerObjs[tabSetIndex].mainCont,
          allScrollerObjs[activeElNavSet[i - 1]],
          [0, 0]
        );

      allScrollerObjs[tabSetIndex].pageWrapper.scrollTo(0, 0);
    });

    scrollToPoint(activeEl, currentNavObj, screenOffsets);
  };

  // Tab navigator - function
  window.addEventListener("keydown", (theEvent) => {
    if (theEvent.code === "Tab") {
      theEvent.preventDefault();

      if (!theEvent.shiftKey) {
        activeNavIndex = allTabNavigators[activeNavIndex + 1]
          ? activeNavIndex + 1
          : 0;
      } else {
        activeNavIndex =
          activeNavIndex === 0
            ? allTabNavigators.length - 1
            : activeNavIndex - 1;
      }

      let activeEl = allTabNavigators[activeNavIndex];
      scrollToPointHandler(activeEl);
    }
  });

  // Navigation by Anchor
  const scrollToPointEls = [...document.querySelectorAll("a")].filter((theEl) =>
    theEl.getAttribute("href").includes("#")
  );

  scrollToPointEls.forEach((theEl) => {
    let theId = theEl.getAttribute("href").slice(1);
    let targetEl = theId && document.getElementById(theId);
    theEl.addEventListener("pointerdown", (theEvent) => {
      if (targetEl) {
        theEvent.preventDefault();
        scrollToPointHandler(targetEl, [0, 0]);
      }
    });
  });

  // Setting's statement
  if (settings.accessMainObjects) return [allScrollerObjs, allSubScrollerObjs];
};

smoothScroller();

// --------------- Alhamdulillah
