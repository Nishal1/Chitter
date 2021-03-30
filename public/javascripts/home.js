// Progress Bar
const showcase = document.querySelector('#showcase'),
    section1 = document.querySelector('#landing-s1'),
    section2 = document.querySelector('#landing-s2'),
    section3 = document.querySelector('#landing-s3'),
    bar1 = document.querySelector('#bar1'),
    bar2 = document.querySelector('#bar2'),
    bar3 = document.querySelector('#bar3'),
    bar4 = document.querySelector('#bar4');

document.addEventListener('scroll', function () {
    if (isScrolledIntoView(showcase)) {
        bar1.classList.add('active-bar');
        bar2.classList.remove('active-bar');
        bar3.classList.remove('active-bar');
        bar4.classList.remove('active-bar');
    } else if (isScrolledIntoView(section1)) {
        bar2.classList.add('active-bar');
        bar1.classList.remove('active-bar');
        bar3.classList.remove('active-bar');
        bar4.classList.remove('active-bar');
    } else if (isScrolledIntoView(section2)) {
        bar3.classList.add('active-bar');
        bar1.classList.remove('active-bar');
        bar2.classList.remove('active-bar');
        bar4.classList.remove('active-bar');
    } else if (isScrolledIntoView(section3)) {
        bar4.classList.add('active-bar');
        bar1.classList.remove('active-bar');
        bar2.classList.remove('active-bar');
        bar3.classList.remove('active-bar');
    }
});

var isScrolledIntoView = function (el) {
    var rect = el.getBoundingClientRect(),
        top = rect.top,
        height = rect.height,
        el = el.parentNode;
    // Check if bottom of the element is off the page
    if (rect.bottom < 0) return false;
    // Check its within the document viewport
    if (top > document.documentElement.clientHeight) return false;
    do {
        rect = el.getBoundingClientRect();
        if (top <= rect.bottom === false) return false;
        // Check if the element is out of view due to a container scrolling
        if (top + height <= rect.top) return false;
        el = el.parentNode;
    } while (el != document.body);
    return true;
};

/* -------------------------------------------------------------------------------- */
// Footer Background Image
const imgUrl = [
    {
        url: 'alexander-popov-kx1r9Fgqe7s-unsplash.jpg',
        author: 'Alexander Popov',
    },
    {
        url: 'alexander-popov-lXaOSpd_UQw-unsplash.jpg',
        author: 'Alexander Popov',
    },
    {
        url: 'ben-neale-zpxKdH_xNSI-unsplash.jpg',
        author: 'Ben Neale',
    },
    {
        url: 'the-new-york-public-library-4BXWIQoS8Fo-unsplash.jpg',
        author: 'The New York Public Library',
    },
    {
        url: 'jr-korpa-9XngoIpxcEo-unsplash.jpg',
        author: 'Korpa Jr.',
    },
    {
        url: 'louie-castro-garcia-UitmwXNMHiE-unsplash.jpg',
        author: 'Louie Castro Garcia',
    },
    {
        url: 'alek-kalinowski-GMQoxwAOlRM-unsplash.jpg',
        author: 'Alek Kalinowski',
    },
];
const credit = document.querySelector('#img-credit');

let randPic = imgUrl[Math.floor(Math.random() * imgUrl.length)];
section3.style.backgroundImage = `url("/images/${randPic.url}")`;
credit.innerHTML = `Picture by <strong>${randPic.author}</strong>`;
