/* WrikeTheme JS */

/* --- Back to top ---------------------------------------- */
$(window).scroll(function() {
    var height = $(window).scrollTop();
    if (height > 200) {
        $('#backToTop').fadeIn();
    } else {
        $('#backToTop').fadeOut();
    }
});

$(document).ready(function() {
    $("#backToTop").click(function(event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

    /* --- Night mode ----------------------------------------
     * Primary persistence: userMetadataModel via AJAX (DB, per-user, cross-device).
     * The server already rendered the correct class on <body> (layout.php),
     * so there is NO flash of wrong theme on page load.
     * localStorage is kept as instant fallback for non-authenticated pages.
     * ------------------------------------------------------- */
    var STORAGE_KEY  = 'wrikeThemeNightMode';
    var toggleUrl    = $('body').data('night-toggle-url') || '';
    var serverNight  = $('body').data('night-mode');   // '1' or '0' from layout.php

    // Sync localStorage with the server-authoritative value
    if (serverNight !== undefined && serverNight !== '') {
        localStorage.setItem(STORAGE_KEY, serverNight);
    }

    function applyMode(night) {
        if (night) {
            $('body').addClass('night-mode');
            $('#wrike-night-toggle')
                .attr('title', 'Light mode')
                .find('i').removeClass('fa-moon-o').addClass('fa-sun-o');
        } else {
            $('body').removeClass('night-mode');
            $('#wrike-night-toggle')
                .attr('title', 'Night mode')
                .find('i').removeClass('fa-sun-o').addClass('fa-moon-o');
        }
    }

    // Toggle button click
    $(document).on('click', '#wrike-night-toggle', function(e) {
        e.preventDefault();
        var isNight = $('body').hasClass('night-mode');
        var newNight = !isNight;

        // Optimistic UI update — instant, no wait
        applyMode(newNight);
        localStorage.setItem(STORAGE_KEY, newNight ? '1' : '0');

        // Persist to DB via AJAX if the user is authenticated
        if (toggleUrl) {
            $.post(toggleUrl, { csrf_token: $('meta[name="csrf-token"]').attr('content') })
             .fail(function() {
                 // Rollback on failure
                 applyMode(isNight);
                 localStorage.setItem(STORAGE_KEY, isNight ? '1' : '0');
             });
        }
    });

    // OS theme change: only follow if no DB/localStorage preference is set
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!toggleUrl && localStorage.getItem(STORAGE_KEY) === null) {
                applyMode(e.matches);
            }
        });
    }
});
