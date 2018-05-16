$(function() {

    var hash = window.location.hash;

    var $stickyHeader = $('.navbar-dark.position-fixed');
    var $form = $('#ajax-contact');
    var $navLinks = $(".navbar-nav a");
    var $body = $("html, body");
    var $pages = $('.page');
    var currentPage = "";

    // show "page" if there is a hash
    if(hash != '') {
        var scroll = $(window).scrollTop();

        animateHeader(scroll);
        updateNav(hash.substring(1));
        scrollToPage(hash);

    }

    // sticky header
    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();

        animateHeader(scroll);
        animateIn();
        navigationStatus();

    });

    // navigation page scroll
    $navLinks.on('click', function() {

        $navLinks.removeClass('active');
        $(this).addClass('active');

        scrollToPage($.attr(this, 'href'));
    });

    $form.on('submit', function(event) {

        event.preventDefault();

        let formData = $form.serialize();
        let $formMessages = $('#form-messages');

        $.ajax({
            type: 'POST',
            url: $form.attr('action'),
            data: formData
        })
        .done(function(response) {

            $formMessages.removeClass('error');
            $formMessages.addClass('success');

            $formMessages.text(response);

            $('#name').val('');
            $('#email').val('');
            $('#message').val('');

        })
        .fail(function(data) {

            $formMessages.removeClass('success');
            $formMessages.addClass('error');

            if (data.responseText !== '') {
                $formMessages.text(data.responseText);
            } else {
                $formMessages.text('Oops! An error occured and your message could not be sent.');
            }
        });

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
    // as they come into view
    function animateIn() {

        var $toAnimate = $('.animate:not(.start)');

        $.each($toAnimate, function( index, elem ) {

            if(inView(elem)) {
                $(elem).addClass('start');
            }

        });

    }

    // handle header animation (height and background color via css)
    function animateHeader(scroll) {
        if(scroll >= 70) {
            $stickyHeader.addClass('green');
        } else {
            $stickyHeader.removeClass('green');
        }
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
        window.location.hash = '#'+page;

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