$(function() {

    var hash = window.location.hash;

    var $stickyHeader = $('.navbar-dark.position-fixed');
    var $navLinks = $(".navbar-nav a");
    var $body = $("html, body");
    var $pages = $('.page');
    var currentPage = "";

    // show "page" if there is a hash
    if(hash != '') {

        updateNav(hash.substring(1));
        scrollToPage(hash);

    }

    // sticky header
    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();

        if(scroll >= 70) {
            $stickyHeader.addClass('green');
        } else {
            $stickyHeader.removeClass('green');
        }

        animateIn();
        navigationStatus();

    });

    // navigation page scroll
    $navLinks.on('click', function() {

        $navLinks.removeClass('active');
        $(this).addClass('active');

        scrollToPage($.attr(this, 'href'));
    });

    function navigationStatus() {

        $.each($pages, function( index, elem ) {

            let page = $(elem).attr("id");

            if(inView(elem) && page != currentPage) {
                currentPage = page;
                updateNav(currentPage);
            }

        });

    }

    // start css animations on elements
    // as the come into view
    function animateIn() {

        var $toAnimate = $('.animate:not(.start)');

        $.each($toAnimate, function( index, elem ) {

            if(inView(elem)) {
                $(elem).addClass('start');
            }

        });

    }

    // check if element is in view
    function inView(elem) {

        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return (elemBottom < docViewBottom+400) && (elemTop > docViewTop-400);

    }

    function updateNav(page) {

        $navLinks.removeClass('active');
        $('.navbar-nav a[href="#'+page+'"]').addClass('active');

    }

    function scrollToPage(page) {

        $body.stop().animate({
            scrollTop: $(page).offset().top
        }, 500);

    }

    // trigger once for elements that are
    // already in view on page load
    animateIn();

});