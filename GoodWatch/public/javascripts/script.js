document.addEventListener('DOMContentLoaded', () => {

    console.log('IronGenerator JS imported successfully!');

}, false);


objectFitImages();

/* init Jarallax */
jarallax(document.querySelectorAll('.jarallax'));

jarallax(document.querySelectorAll('.jarallax-keep-img'), {
    keepImg: true,
});