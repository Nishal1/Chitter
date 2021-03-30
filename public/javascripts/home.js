const showcase = document.querySelector('#showcase');
const section1 = document.querySelector('#landing-s1');
const bar1 = document.querySelector('#bar1');
const bar2 = document.querySelector('#bar2');
const bar3 = document.querySelector('#bar3');
const bar4 = document.querySelector('#bar4');

document.addEventListener("scroll", function() {
    if (isScrolledIntoView(showcase)){
        bar1.classList.add('active-bar');
        bar2.classList.remove('active-bar');
        bar3.classList.remove('active-bar');
        bar4.classList.remove('active-bar');
    } else if (isScrolledIntoView(section1)) {
        bar2.classList.add('active-bar');
        bar1.classList.remove('active-bar');
        bar3.classList.remove('active-bar');
        bar4.classList.remove('active-bar');
    }
}); 

var isScrolledIntoView = function(el){
    var rect = el.getBoundingClientRect(), top = rect.top, height = rect.height, 
      el = el.parentNode
    // Check if bottom of the element is off the page
    if (rect.bottom < 0) return false
    // Check its within the document viewport
    if (top > document.documentElement.clientHeight) return false
    do {
      rect = el.getBoundingClientRect()
      if (top <= rect.bottom === false) return false
      // Check if the element is out of view due to a container scrolling
      if ((top + height) <= rect.top) return false
      el = el.parentNode
    } while (el != document.body)
    return true;
  }
