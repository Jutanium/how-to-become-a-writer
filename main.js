const get = (id) => document.getElementById(id);

let currTimeline = 0;
const timelines = [];

const timeline = (cleanup) => { 
  const args = {onComplete: waitBeforeNext, paused: true};
  if (cleanup) args.onCompleteParams = [cleanup];
  const timeline = gsap.timeline(args);
  timelines.push(timeline)
  return timeline;
}

const cont = gsap.timeline({repeat: -1, yoyo: true});
cont.from("#continue-text", {duration: 1, opacity:0, yoyo: true, repeat:-1});
cont.pause();

const afterFunctions = {
  4: (tl) => {
    tl.to(".four-fade-out", 1, {opacity: 0})
    tl.to("#four-you", 0.5, {"margin-right": -120}, "+=0.6")
    tl.to("#four-insert", 2, {text: "sit down to write", 
      onComplete: () => {tl.pause(); waitBefore(tl.play.bind(tl))}}, "+=0.2")
    tl.to("#jutan-span", 2, {ease: "none", rotation:90, opacity:0, y:600});
    tl.to("#dan-span", 2, {ease: "none", rotation:90, opacity:0, y:600}, "-=1");
    tl.to("#by-span", 2, {ease: "none", rotation:90, opacity:0, y:600}, "-=0.2");
  },
  6: (tl) => {
    tl.to("#six-accomplishments", 1, {opacity: 0}, "+=0.5");
    tl.set("#six-accomplishments", {opacity: 1}, "+=1");
    tl.set("#six-accomplishments", {opacity: 0}, "+=0.2");
    tl.set("#six-accomplishments", {opacity: 1}, "+=0.2");
    tl.set("#six-accomplishments", {opacity: 0}, "+=0.2");
    tl.set("#six-accomplishments", {opacity: 0.5}, "+=0.2");
  },
  9: (tl) => {
    tl.to("#nine-certainty", 1, {"font-weight": 700});
  },
  11: (tl) => {
    tl.to("#eleven-little", 1, {"letter-spacing": 3, "font-size": "12px", autoRound: false})
  },
  16: (tl) => {
    const wait = () => {tl.pause(); waitBefore(tl.play.bind(tl))};
    tl.set({}, {onComplete: wait});
    tl.set("#sixteen-font-change", {"font-family": "Inconsolata", onComplete: wait});
    tl.set("#sixteen-font-change", {"font-family": "Libre Baskerville", onComplete: wait}, "+=0.2");
    tl.set("#sixteen-font-change", {"font-family": "Roboto", onComplete: wait}, "+=0.2");
    tl.set("#sixteen-font-change", {"font-family": "'Indie Flower', cursive", onComplete: wait}, "+=0.2");
  }
}
initializeTimelines();
timelines[currTimeline].play();


function initializeTimelines() {
  const titleScreen = timeline();
  titleScreen.to("#title-text", {duration: 2.5, ease: "rough", text: "How to Become"})
    .to("#title-text", {duration: 1.5, text: "How to Become a Writer"})
    .fromTo(get("by-span"),  0.3, {text: ""}, {text: "by"})
    .fromTo("#dan-span",  0.5, {text: ""}, {text: "Dan"}, "+=0.4")
    .fromTo("#jutan-span",  0.5, {text: ""}, {text: "Jutan"}) 
  
  const showFirst = timeline();
  showFirst.to("#title", {duration: 1.5, "margin-top": "5%"});
  showFirst.to("#inspired", {duration: 0.8, "opacity": 0.8, "line-height": '20pt', display: 'inline'})
  showFirst.to("#inspired", {duration: 1, "opacity": 0, display: 'none'}, "+=2.8")
  showFirst.fromTo("#main-box", 1, {display:'none', autoAlpha:0}, {display:'block', autoAlpha: 1});

  const contents = get("main-box").children;
  for (let i = 0; i < contents.length; i++) {

    const child = contents[i];
    const cleanup = (callback) => {
      console.log("Cleaning up!");
      gsap.to(child, 0.5, {opacity: 0, display: 'none', onComplete: callback});
    }

    const newTl = timeline(cleanup);

    newTl.to(child, 0, {display: 'block'});
    for (let j = 0; j < child.children.length; j++) {
      const subchild = child.children[j];
      const duration = subchild.dataset.duration ? Number(subchild.dataset.duration) : subchild.textContent.length * 0.06;
      const breakDuration = 0.5;
      const from = {text: ""};
      const to = {text: subchild.textContent, ease:"sine"};
      newTl.fromTo(subchild, duration, from, to);
      if (subchild.classList.contains("break")) {
        newTl.set({}, {}, "+=" + breakDuration);
      }
      if (subchild.classList.contains("wait")) {
        newTl.addPause("+=0", () => {waitBefore(newTl.play.bind(newTl))});
      }
    }

    const index = Number(child.id.substring(8));
    if (afterFunctions[index]) {
      afterFunctions[index](newTl);
    }
  }
  
}

function waitBefore (callback) {
  cont.play();
  const onPress = (e) => {
    cont.restart();
    cont.pause();
    document.removeEventListener("keydown", onPress);
    callback();
  }
  document.addEventListener("keydown", onPress);
  
}
function waitBeforeNext (cleanup) { 
  waitBefore(() => {
    if (currTimeline == 1) {
      get("continue-text").innerText = ". . .";
      get("continue-text").style.fontStyle = "16pt";
      get("continue-text").style.fontWeight = "700";
    }
    const next = () => {
      currTimeline++;
      timelines[currTimeline].play();
    }
    if (cleanup) {
      cleanup(next)
    }
    else next();
  })
}

//gsap.to("#title", {duration: 2, 'margin-top': 0, delay: 8});