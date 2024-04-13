gsap.registerPlugin(Observer, ScrollTrigger);
console.log(getComputedStyle(document.querySelector('.header-img')).display)
let sections = document.querySelectorAll("section"),
    images = document.querySelectorAll(".bg"),
    outerWrappers = gsap.utils.toArray(".outer"),
    innerWrappers = gsap.utils.toArray(".inner"),
    currentIndex = -1,
    wrap = gsap.utils.wrap(0, sections.length),
    animating;

gsap.set(outerWrappers, { yPercent: 100 });
gsap.set(innerWrappers, { yPercent: -100 });


document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.logo');
    const iframes = gsap.utils.toArray('.small-video');


    iframes.forEach((video, index) => {
        const direction = index % 2 === 0 ? -20 :20;

        gsap.set(video, { yPercent: direction })
        video.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    })
    gsap.set(iframes, {  autoAlpha: 1 });


    const logoTimeline = gsap.timeline({
        repeat: -1,
    })
      .to(logo, {
        scale: 1.1,
        rotation: 5,
        ease: "back.out(3)",
        duration: 2,
      })
      .to(logo, {
        scale: 0.9,
        rotation: '-5',
        ease: "elastic.out(2, 4)",
        duration: 2,
      });


    Observer.create({
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        onDown: () => !animating && gotoSection(currentIndex - 1, -1),
        onUp: () => !animating && gotoSection(currentIndex + 1, 1),
        tolerance: 5,
        preventDefault: true
    });

    gotoSection(0, 1);
    updateHeaderVisibilityBasedOnSection();

    const quote = document.querySelector('#quote');

    if (quote) {
        quote.innerHTML = quote.textContent.replace(/\S/g, "<span class='char'>$&</span>");
        
        const chars = document.querySelectorAll('.char');
        const charsTimeline = gsap.timeline().to(chars, {
          duration: 2,
          color: '#ffffff',
          stagger: 0.08,
          ease: 'none',
          repeat: -1
        });
      }


    emailjs.init("bdJh2-DiehX5coUUN");
    const form = document.getElementById("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault()
        document.querySelectorAll(".error-message").forEach((el) => el.textContent = "")
        let valid = true;

        const name = document.getElementById("name").value
        if (name.length === 0 || name.length > 100) {
            document.getElementById("name-error").textContent = "Invalid"
            valid = false
        }

        const email = document.getElementById("email").value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email) || email.length > 100) {
            document.getElementById("email-error").textContent = "Please enter a valid email address (max 100 characters).";
            valid = false;
        }

        const message = document.getElementById("message").value;
        if (message.length === 0) {
            document.getElementById("message-error").textContent = "Message cannot be empty.";
            valid = false;
        }

        if (valid) {
            var parameters = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                message: document.getElementById("message").value,
                reply_to: document.getElementById("email").value
            }

            emailjs.send("service_zrkc0jt","template_7usr8zf", parameters).then(function (response) {
                console.log("OK", response.status, response.text);
                form.reset()
            }, function (error) {
                console.log("ERROR", error)
            })
        }
    })



function gotoSection(index, direction) {
    index = wrap(index);
    animating = true;
    let fromTop = direction === -1,
        dFactor = fromTop ? -1 : 1,
        tl = gsap.timeline({
            defaults: {
                duration: 1, ease: "power2.inOut"
            },
            onComplete: () => animating = false
        });
    if (currentIndex >= 0) {
        gsap.set(sections[currentIndex], { zIndex: 0 });
        tl.to(images[currentIndex], { yPercent: -15 * dFactor, clearProps: "all" })
            .set(sections[currentIndex], { autoAlpha: 0, clearProps: "all" });
    }
    gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
    tl.fromTo([outerWrappers[index], innerWrappers[index]], {
        yPercent: i => {
            let initialValue = i ? -100 * dFactor : 100 * dFactor;
            console.log(`Initial yPercent for section ${index}: ${initialValue}`);
            return initialValue;
        }
    }, {
        yPercent: 0,
        onStart: () => console.log(`Animating wrappers to yPercent: 0 in section ${index}`),
        onComplete: () => console.log(`Wrappers animated to yPercent: 0 in section ${index}`)
    }, 0)
        .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
    console.log("index", index)
    console.log("current index", currentIndex)
    currentIndex = index;
    updateHeaderVisibilityBasedOnSection();
}

Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onDown: () => !animating && gotoSection(currentIndex - 1, -1),
    onUp: () => !animating && gotoSection(currentIndex + 1, 1),
    tolerance: 5,
    preventDefault: true
})

// gotoSection(0, 1);
updateHeaderVisibilityBasedOnSection();

function updateHeaderVisibilityBasedOnSection() {
    const header = document.getElementById('header');
    if (currentIndex === 0 || currentIndex === 3) {
        header.style.opacity = 0;
    } else {
        header.style.opacity = 1;
    }
}

})

