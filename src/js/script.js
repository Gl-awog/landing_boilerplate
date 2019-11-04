var app = {
    init: function() {
        this.$win = $(window);
        this.$body = $("body");
        this.$header = $(".header");
        this.headerHeight = this.$header.height();
        this.$sections = $(".section");
        this.$nav = $(".nav");
        this.$navItems = app.$nav.find(".nav__item--scroll");
        this.$mobNavTrigger = $(".js-mobmenu-toggle");
        this.mobileBreakpoint = 768;
        this.isReg = this.$body.hasClass("reg");

        this.initScrollAnim();
        this.initStickyHeader();
        this.initScrollToSection();        
        this.initMobMenu();  
        this.initPopup();
    },

    isMobile: function() {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) &&
            (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) <= app.mobileBreakpoint);
    },

    initScrollAnim: function() {
        if (!app.isMobile() && AOS && !app.isReg) {
            AOS.init({
                once: true,
                disable: function() {
                    return window.innerWidth <= app.mobileBreakpoint;
                }
            });
        }
    },

    initScrollToSection() {
        let sectionsOffset = app.isMobile() ? app.headerHeight : app.headerHeight;

        $(".js-scrollTo").on("click", function(e) {
            let $target = $($(this).data("scroll-target"));
            if ($target.length) scrollTo($target, $target.offset().top - sectionsOffset);
        });

        !app.isReg && app.$navItems.each(function() {
            $(this).on("click", function() {
                let $target = $($(this).attr("href"));
                scrollTo($target, $target.offset().top - sectionsOffset);
                app.isMobile() && app.$mobNavTrigger.click();
                return false;
            })
        });

        let sections = {};
        app.$sections.each(function() {
            if (this.id) {
                sections[this.id] = this.offsetTop - sectionsOffset
            }
        });

        function scrollTo(obj, top) {
            if (obj.length) {
                $('html, body').animate({
                    scrollTop: top !== undefined ? top : (obj.offset().top)
                }, 800, function() {

                });
            }
        }
    },

    initStickyHeader: function() {
        !app.isMobile() && !app.isReg && app.$win.on("scroll.stickyheader", function() {
            var st = $(this).scrollTop();

            if (st > app.headerHeight) {
                app.$header.addClass("header--fixed");
            } else {
                app.$header.removeClass("header--fixed");
            }
        });
    },

    initMobMenu: function() {
        this.$mobNavTrigger.on("click", function() {
            if (app.isMobile()) {
                if (app.$nav.hasClass("active")) {
                    app.$nav.removeClass("active");
                    app.$body.removeClass("mobnav-open");
                } else {
                    app.$nav.addClass("active");
                    app.$body.addClass("mobnav-open");
                }
            } else {
                app.$body.removeClass("mobnav-open");
                app.$nav.removeClass("active");
            }
            return false;
        });
    },

    initPopup: function() {
        $(".js-popup").on("click", function() {
            var target = $(this).data("popup");
            var pp = makePopup(target);
            pp.init();
            pp.popupShow();
            return false;
        });
    }
}

$(document).ready(function() {
    app.init();
});

function makePopup(target) {
    var pp = {
        popupContainer: null,
        popup: null,
        popupClose: null,
        fader: null,

        init: function() {
            var self = this;
            self.popupContainer = $(".popup-container" + target + "");
            self.popup = self.popupContainer.find(".popup");
            self.popupClose = $(".popup__close");
            self.popupContainer.on("click", self.popupHide.bind(self));
            if (!app.isMobile()) {
                self.popup.mCustomScrollbar({
                    theme: "minimal",
                    scrollInertia: 0,
                    autoHideScrollbar: false
                });
            }
        },
        popupHide: function() {
            var self = this;

            self.popupContainer.hide();
            self.popupClose.hide();
            $("body").removeClass("popup-open");

        },
        popupShow: function() {
            var self = this;
            self.popupContainer.fadeIn(300);
            self.popupClose.fadeIn(300);
            $("body").addClass("popup-open");

        }
    }
    return pp;
}

