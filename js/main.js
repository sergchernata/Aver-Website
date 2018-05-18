$(() => {

    const hash = window.location.hash.replace('panel-', '');

    const $stickyHeader = $('.navbar-dark.position-fixed');
    const $form = $('#ajax-contact');
    const $navLinks = $(".navbar-nav a");
    const $body = $("html, body");
    const $pages = $('.page');
    let currentPage = "";
    let scrolling = false;

    // show "page" if there is a hash
    if(hash != '') {
        const scroll = $(window).scrollTop();

        animateHeader(scroll);
        updateNav(hash.substring(1));
        scrollToPage(hash);

    }

    // sticky header
    $(window).scroll(event => {

        const scroll = $(window).scrollTop();
        animateHeader(scroll);

        if(!scrolling){
            animateIn();
            navigationStatus();
        }

    });

    // navigation page scroll
    $navLinks.on('click', function(e) {

        e.preventDefault();

        scrolling = true;
        $navLinks.removeClass('active');
        $(this).addClass('active');
        scrollToPage($.attr(this, 'href'));

        // mobile nav
        $('.navbar-collapse.collapse').removeClass('show');

        return false;
    });

    $form.on('submit', event => {

        event.preventDefault();

        let formData = $form.serialize();
        let $formMessages = $('#form-messages');

        $.ajax({
            type: 'POST',
            url: $form.attr('action'),
            data: formData
        })
        .done(response => {

            $formMessages.removeClass('error');
            $formMessages.addClass('success');

            $formMessages.text(response);

            $('#name').val('');
            $('#email').val('');
            $('#message').val('');

        })
        .fail(data => {

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

        $.each($pages, (index, elem) => {

            let page = $(elem).attr("id");

            if(inView(elem, true) && page != currentPage) {
                currentPage = page;
                updateNav(currentPage);
            }

        });

    }

    // start css animations on elements
    // as they come into view
    function animateIn() {

        const $toAnimate = $('.animate:not(.start)');

        $.each($toAnimate, (index, elem) => {

            if(inView(elem, false)) {
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
    function inView(elem, section = false) {

        const docViewTop = $(window).scrollTop();
        const docViewBottom = docViewTop + $(window).height();
        const midPoint = docViewTop + ( $(window).height() / 2 );

        if(section) {

            const elemTop = $(elem).find('.container').offset().top;
            const elemBottom = elemTop + $(elem).find('.container').height();
            return (elemTop < midPoint) && (elemBottom > midPoint);

        } else {

            const elemTop = $(elem).offset().top;
            const elemBottom = elemTop + $(elem).height();
            return (elemBottom < docViewBottom+200) && (elemTop > docViewTop-200);

        }

    }

    function updateNav(page) {

        $navLinks.removeClass('active');
        $(`.navbar-nav a[href="#${page}"]`).addClass('active');
        window.location.hash = `panel-${page}`;

    }

    function scrollToPage(page) {

        $body.stop().animate({
            scrollTop: $(page).offset().top
        }, 500, () => { scrolling = false; });

    }

    // trigger once for elements that are
    // already in view on page load
    animateIn();

});