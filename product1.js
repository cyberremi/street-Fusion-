window.addEventListener('scroll', () => {
    const text = document.getElementById('scrollText');
    const scrollY = window.scrollY;

    if (scrollY > 300) { // adjust scroll distance
      text.classList.add('centered');
    } else {
      text.classList.remove('centered');
    }
  });