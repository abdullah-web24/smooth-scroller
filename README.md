# Smooth Scroller

A pure JS smooth scroll library for a better user experience with all accessibility.

## Installation

- Download the `Scripts` folder and the `Styles` folder.

- Attatch the `scroller.js` at the very top of all the attachments. Then attach the other files.

- Only attatch the `_scroller.scss` file in your main `SCSS` file.

> If you are not familiar with the `SCSS`, then please watch a video on it. It is very easy.

- Add a background color to the `<main>` tag to prevent `Chrome` lagging issue.

## Roadmap

Simply follow this step by step guide :)

### Scrollbar

- Wrap your all contents inside a wrapper and add `.scroller-main-cont` class.

```bash
<body>
    <main class="scroller-main-cont">
        <!-- All contents should be here -->
    </main>
</body>
```

- You can add a varient class to determine the scroller type. There are four types of scroller. `.scrollerX`, `.scrollerY`, `.auto-scrollerX` and the default.

```bash
<body>
    <main class="scroller-main-cont scrollerY">
        <!-- All contents should be here -->
    </main>
</body>
```

> `.scrollerX` makes horizntal scrollbar
>
> `.scrollerY` makes Vertical scrollbar
>
> `.auto-scrollerX` makes horizntal scroll by vertical scrollbar
>
> Default is simply the regular style.

- You can add horizontal sub-scroller inside the vertical scrollbar which will be automatically scrolled by the parent scroller. For this, parent must have `.scrollerY` class and you have to add `.sub-scroller-main-cont` class to that wrapper.

```bash
<body>
    <main class="scroller-main-cont scrollerY">
        <!-- Some contents here -->

        <div class="sub-scroller-main-cont">
            <!-- Some contents should be here -->
        </div>

        <!-- Some contents there -->
    </main>
</body>
```

- You can make many smooth-scroller wrapper as you want. Simply add `.scroller-main-cont` class to all wrapper.

- You can change the animation style, easing function, duration etc. from the css file.

- You have to add `data-classname` to select the container

- There are some options you can add to the `smoothScroller()` function giving an object as an argument. You can choose default scrollbar type.

```bash
smoothScroller({
    customScrollbar: true,  // If false, it will be the default scrollbar.
    accessMainObjects: false,   // If true, it will return all the scroller objects.
})
```

- You can change the animation style, easing function, duration etc. from the css file.

- The posibilities are endless. Just play around.

### Scroll Based Animation

- You can add external Js file and attach it under the `scroll-based-animator.js` file. Or if you use internal script, you have to wrap your code by `onload()` function.

- This animation works based on the position of the point elements. Point element can be anything. You have to select some point elements for the animation.

- Now make an array of objects. Each object will represent as an animation. Each of them has the property - `pointEl`.

- Now you have to add a property - `steps: []`. There will be three function in there. Each function represents the different stage of the animation.

> `steps[0]` is the innitial condition. Add style that you want to have before the animation happen.
>
> `steps[1]` is the animation condition. Add style that you want to have in the animation. It has a parameter that represents the animation percentage.
>
> `steps[2]` is the last condition. Add style that you want to have after the animation happen.
>
> You can animate many element as you wish in these fuctions.

```bash
const sbAnimationObjs = [
    {
    pointEl: pointEl1,
    steps: [
        () => {
            // Here goes the initial style
        },
        (percentage) => {
            // Here gose the animation style
        },
        () => {
            // Here goes the last style
        },
    ]
    },
    {
    pointEl: pointEl2,
    steps: [
        () => {
            myEl1.style.transform = `translateY(0)`;
            myEl2.style.height = `10px`;
        },
        (percentage) => {
            myEl1.style.transform = `translateY(${7 * percentage}vw)`;
            myEl2.style.height = `${50 * percentage}px`;
        },
        () => {
            myEl1.style.transform = `translateY(7vw)`;
            myEl2.style.height = `50px`;
        },
    ],
    }
]
```

> In this example, `myEl1` will have `translateY(0)` before the animation. The animation will start when `pointEl2` is entered into the viewport. `myEl1` will be changed from `translateY(0)` to `translateY(7vw)`. And the last value will be `translateY(7vw)`.

- There are two types of animation. One is the default, another one is the chaining animation. This kind of animation is more advanced animation. To define the type you have to add `type: "complex"`. Default type is `type: "simple"`.

> `type: "complex"` has two point element. `startPointEl` and `finishPointEl`. The chaining animation happen when the first animation's `finishPointEl` is the secont animation's `startPointEl`.

```bash
const sbAnimationObjs = [
    {
    type: "complex",
    startPointEl: pointEl1,
    finishPointEl: pointEl2,
    steps: [
        () => {
        myEl1.style.transform = `rotateZ(0deg)`;
        },
        (percentage) => {
        myEl1.style.transform = `rotateZ(${90 * percentage}deg)`;
        },
        () => {
        myEl1.style.transform = `rotateZ(90deg)`;
        },
    ],
    },
    {
    type: "complex",
    startPointEl: pointEl2,
    finishPointEl: pointEl3,
    steps: [
        () => {
        myEl1.style.backgroundColor = `rgb(15, 155, 135)`;
        },
        (percentage) => {
        myEl1.style.transform = `rotateZ(${90 - 90 * percentage}deg)`;
        },
        () => {
        myEl1.style.transform = `rotateZ(0deg)`;
        },
    ],
    }
]
```

> In this example, first animation will happen when the `pointEl1` enters into the viewport and the animation will finish when the `pointEl2` is entered into the viewport. `myEl1` will animate first time in this renge.
>
> After the `pointEl2` is entered into the viewport, the second animation will be triggered and it will run before the `pointEl3` is entered the viewport.
>
> For this kind of writing style, you can chain the animation as long as you can.

- You have to add the scroll direction. If you are using horizontal scroll, you must add `axis: "x"` for determine the scrollbar axis.

- You can add `offsets` property to set the offset of starting position and ending position. It has two values, `offsets: [starting offset, finishing offset]`.

- Now pass the `sbAnimationObjs` as an argument of `scrollBasedAnimator` function. `scrollBasedAnimator(sbAnimationObjs)`.

- It is very easy and responsive if you understand the concept. You can make very complex animation with this. Just play around.

### Sticky animation

You can use `position: sticky`. But in some browser like `Firefox` it only works if that element is a direct child of the wrapper. To solve this problem you can use our `stickyAnimator()` function.

- You have to wrap the element into a parent element.

- Now you have to define an array of animation object. There will be a property called `pointEl` which will be the `parentEl`.

- You can add offset which will work as `top` - `bottom` or `left` - `right` property on a `position: sticky` element.

- Now call the `stickyAnimator()` with the array of object as a parameter.

```bash
const stkAnimationObjs = [
    {
    pointEl: document.querySelector(".myEl"),
    offsets: [50, 50],
    },
];

stickyAnimator(stkAnimationObjs);
```

> There are few resons why I made this kind of syntax. One of them is to controll all of the animation from one place.

## Features

- Ultra responsive and dinamic.
- Works same as the default scrollbar.
- Scrolling animation is controlled by `CSS`.
- Works in all browser.
- Works in mobile too.
- Supports all the `CSS` with `position: fixed` and `position: sticky`
- Great `Tab` navigation experience.
- Less than 35kb file size.
- Two dimention scroll at a time.
- Fully customisabe scrollbar and animation.
- Easy to handle super complex scroll-based animation.
- supports all the input devices.
- End-less possibilities.

## Limitation

The only limitation is, it does not detect the scrollable element automatically. You have to add the `scroller-main-cont` class to define a scrollable element. If you don't add this class to a scrollable element there will be the default scrollbar.
