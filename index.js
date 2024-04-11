gsap.registerPlugin(Observer, ScrollTrigger);

let sections = document.querySelectorAll("section"),
    images = document.querySelectorAll(".bg"),
    headings = gsap.utils.toArray(".section-heading"),
    outerWrappers = gsap.utils.toArray(".outer"),
    innerWrappers = gsap.utils.toArray(".inner"),
    currentIndex = -1,
    wrap = gsap.utils.wrap(0, sections.length),
    animating;

gsap.set(outerWrappers, { yPercent: 100 });
gsap.set(innerWrappers, { yPercent: -100 });

function gotoSection(index, direction) {
    index = wrap(index); // make sure it's valid
    animating = true;
    let fromTop = direction === -1,
        dFactor = fromTop ? -1 : 1,
        tl = gsap.timeline({
            defaults: { duration: 1.15, ease: "power2.inOut" },
            onComplete: () => animating = false
        });
    if (currentIndex >= 0) {
        // The first time this function runs, current is -1
        gsap.set(sections[currentIndex], { zIndex: 0 });
        tl.to(images[currentIndex], { yPercent: -15 * dFactor, clearProps: "transform" })
        .set(sections[currentIndex], { autoAlpha: 0, clearProps: "all" });
    }
    gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
    tl.fromTo([outerWrappers[index], innerWrappers[index]], {
        yPercent: i => i ? -100 * dFactor : 100 * dFactor
    }, {
        yPercent: 0
    }, 0)
        .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
        .from("#video-1", {
             x: -800,
             ease: "power2.inOut",
             duration: 0.4,
             scrollTrigger: {
                trigger: ".second",
             }
            })
    console.log("index", index)
    console.log("current index", currentIndex)
    currentIndex = index;
}
gsap.to('.video-container iframe', {
    height: '100%', // Animate the height to full viewport height
    ease: 'none',
  });

console.log(sections.length)
Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onDown: () => !animating && gotoSection(currentIndex - 1, -1),
    onUp: () => !animating && gotoSection(currentIndex + 1, 1),
    tolerance: 5,
    preventDefault: true
});

gotoSection(0);

