/*! kleo-wp 4.1.8 combined.min.js 
Combined JS files for KLEO THEME: 
Bootstrap 
Waypoints 
Magnific popup 
carouFredSel 
TouchSwipe - jQuery Plugin 
Isotope 
2017-02-09 1:15:32 AM 
 */
if (!jQuery) {
    throw new Error("Bootstrap requires jQuery");
}

+function($) {
    "use strict";
    function transitionEnd() {
        var el = document.createElement("bootstrap");
        var transEndEventNames = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return {
                    end: transEndEventNames[name]
                };
            }
        }
    }
    $.fn.emulateTransitionEnd = function(duration) {
        var called = false, $el = this;
        $(this).one($.support.transition.end, function() {
            called = true;
        });
        var callback = function() {
            if (!called) $($el).trigger($.support.transition.end);
        };
        setTimeout(callback, duration);
        return this;
    };
    $(function() {
        $.support.transition = transitionEnd();
    });
}(window.jQuery);

+function($) {
    "use strict";
    var dismiss = '[data-dismiss="alert"]';
    var Alert = function(el) {
        $(el).on("click", dismiss, this.close);
    };
    Alert.prototype.close = function(e) {
        var $this = $(this);
        var selector = $this.attr("data-target");
        if (!selector) {
            selector = $this.attr("href");
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, "");
        }
        var $parent = $(selector);
        if (e) e.preventDefault();
        if (!$parent.length) {
            $parent = $this.hasClass("alert") ? $this : $this.parent();
        }
        $parent.trigger(e = $.Event("close.bs.alert"));
        if (e.isDefaultPrevented()) return;
        $parent.removeClass("in");
        function removeElement() {
            $parent.trigger("closed.bs.alert").remove();
        }
        $.support.transition && $parent.hasClass("fade") ? $parent.one($.support.transition.end, removeElement).emulateTransitionEnd(150) : removeElement();
    };
    var old = $.fn.alert;
    $.fn.alert = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.alert");
            if (!data) $this.data("bs.alert", data = new Alert(this));
            if (typeof option == "string") data[option].call($this);
        });
    };
    $.fn.alert.Constructor = Alert;
    $.fn.alert.noConflict = function() {
        $.fn.alert = old;
        return this;
    };
    $(document).on("click.bs.alert.data-api", dismiss, Alert.prototype.close);
}(window.jQuery);

+function($) {
    "use strict";
    var Button = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Button.DEFAULTS, options);
    };
    Button.DEFAULTS = {
        loadingText: "loading..."
    };
    Button.prototype.setState = function(state) {
        var d = "disabled";
        var $el = this.$element;
        var val = $el.is("input") ? "val" : "html";
        var data = $el.data();
        state = state + "Text";
        if (!data.resetText) $el.data("resetText", $el[val]());
        $el[val](data[state] || this.options[state]);
        setTimeout(function() {
            state == "loadingText" ? $el.addClass(d).attr(d, d) : $el.removeClass(d).removeAttr(d);
        }, 0);
    };
    Button.prototype.toggle = function() {
        var $parent = this.$element.closest('[data-toggle="buttons"]');
        if ($parent.length) {
            var $input = this.$element.find("input").prop("checked", !this.$element.hasClass("active")).trigger("change");
            if ($input.prop("type") === "radio") $parent.find(".active").removeClass("active");
        }
        this.$element.toggleClass("active");
    };
    var old = $.fn.button;
    $.fn.button = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.button");
            var options = typeof option == "object" && option;
            if (!data) $this.data("bs.button", data = new Button(this, options));
            if (option == "toggle") data.toggle(); else if (option) data.setState(option);
        });
    };
    $.fn.button.Constructor = Button;
    $.fn.button.noConflict = function() {
        $.fn.button = old;
        return this;
    };
    $(document).on("click.bs.button.data-api", "[data-toggle^=button]", function(e) {
        var $btn = $(e.target);
        if (!$btn.hasClass("btn")) $btn = $btn.closest(".btn");
        $btn.button("toggle");
        e.preventDefault();
    });
}(window.jQuery);

+function($) {
    "use strict";
    var Carousel = function(element, options) {
        this.$element = $(element);
        this.$indicators = this.$element.find(".carousel-indicators");
        this.options = options;
        this.paused = this.sliding = this.interval = this.$active = this.$items = null;
        this.options.pause == "hover" && this.$element.on("mouseenter", $.proxy(this.pause, this)).on("mouseleave", $.proxy(this.cycle, this));
    };
    Carousel.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: true
    };
    Carousel.prototype.cycle = function(e) {
        e || (this.paused = false);
        this.interval && clearInterval(this.interval);
        this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));
        return this;
    };
    Carousel.prototype.getActiveIndex = function() {
        this.$active = this.$element.find(".item.active");
        this.$items = this.$active.parent().children();
        return this.$items.index(this.$active);
    };
    Carousel.prototype.to = function(pos) {
        var that = this;
        var activeIndex = this.getActiveIndex();
        if (pos > this.$items.length - 1 || pos < 0) return;
        if (this.sliding) return this.$element.one("slid", function() {
            that.to(pos);
        });
        if (activeIndex == pos) return this.pause().cycle();
        return this.slide(pos > activeIndex ? "next" : "prev", $(this.$items[pos]));
    };
    Carousel.prototype.pause = function(e) {
        e || (this.paused = true);
        if (this.$element.find(".next, .prev").length && $.support.transition.end) {
            this.$element.trigger($.support.transition.end);
            this.cycle(true);
        }
        this.interval = clearInterval(this.interval);
        return this;
    };
    Carousel.prototype.next = function() {
        if (this.sliding) return;
        return this.slide("next");
    };
    Carousel.prototype.prev = function() {
        if (this.sliding) return;
        return this.slide("prev");
    };
    Carousel.prototype.slide = function(type, next) {
        var $active = this.$element.find(".item.active");
        var $next = next || $active[type]();
        var isCycling = this.interval;
        var direction = type == "next" ? "left" : "right";
        var fallback = type == "next" ? "first" : "last";
        var that = this;
        if (!$next.length) {
            if (!this.options.wrap) return;
            $next = this.$element.find(".item")[fallback]();
        }
        this.sliding = true;
        isCycling && this.pause();
        var e = $.Event("slide.bs.carousel", {
            relatedTarget: $next[0],
            direction: direction
        });
        if ($next.hasClass("active")) return;
        if (this.$indicators.length) {
            this.$indicators.find(".active").removeClass("active");
            this.$element.one("slid", function() {
                var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()]);
                $nextIndicator && $nextIndicator.addClass("active");
            });
        }
        if ($.support.transition && this.$element.hasClass("slide")) {
            this.$element.trigger(e);
            if (e.isDefaultPrevented()) return;
            $next.addClass(type);
            $next[0].offsetWidth;
            $active.addClass(direction);
            $next.addClass(direction);
            $active.one($.support.transition.end, function() {
                $next.removeClass([ type, direction ].join(" ")).addClass("active");
                $active.removeClass([ "active", direction ].join(" "));
                that.sliding = false;
                setTimeout(function() {
                    that.$element.trigger("slid");
                }, 0);
            }).emulateTransitionEnd(600);
        } else {
            this.$element.trigger(e);
            if (e.isDefaultPrevented()) return;
            $active.removeClass("active");
            $next.addClass("active");
            this.sliding = false;
            this.$element.trigger("slid");
        }
        isCycling && this.cycle();
        return this;
    };
    var old = $.fn.carousel;
    $.fn.carousel = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.carousel");
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == "object" && option);
            var action = typeof option == "string" ? option : options.slide;
            if (!data) $this.data("bs.carousel", data = new Carousel(this, options));
            if (typeof option == "number") data.to(option); else if (action) data[action](); else if (options.interval) data.pause().cycle();
        });
    };
    $.fn.carousel.Constructor = Carousel;
    $.fn.carousel.noConflict = function() {
        $.fn.carousel = old;
        return this;
    };
    $(document).on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]", function(e) {
        var $this = $(this), href;
        var $target = $($this.attr("data-target") || (href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, ""));
        var options = $.extend({}, $target.data(), $this.data());
        var slideIndex = $this.attr("data-slide-to");
        if (slideIndex) options.interval = false;
        $target.carousel(options);
        if (slideIndex = $this.attr("data-slide-to")) {
            $target.data("bs.carousel").to(slideIndex);
        }
        e.preventDefault();
    });
    $(window).on("load", function() {
        $('[data-ride="carousel"]').each(function() {
            var $carousel = $(this);
            $carousel.carousel($carousel.data());
        });
    });
}(window.jQuery);

+function($) {
    "use strict";
    var Collapse = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Collapse.DEFAULTS, options);
        this.transitioning = null;
        if (this.options.parent) this.$parent = $(this.options.parent);
        if (this.options.toggle) this.toggle();
    };
    Collapse.DEFAULTS = {
        toggle: true
    };
    Collapse.prototype.dimension = function() {
        var hasWidth = this.$element.hasClass("width");
        return hasWidth ? "width" : "height";
    };
    Collapse.prototype.show = function() {
        if (this.transitioning || this.$element.hasClass("in")) return;
        var startEvent = $.Event("show.bs.collapse");
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented()) return;
        var actives = this.$parent && this.$parent.find("> .panel > .in");
        if (actives && actives.length) {
            var hasData = actives.data("bs.collapse");
            if (hasData && hasData.transitioning) return;
            actives.collapse("hide");
            hasData || actives.data("bs.collapse", null);
        }
        var dimension = this.dimension();
        this.$element.removeClass("collapse").addClass("collapsing")[dimension](0);
        this.transitioning = 1;
        var complete = function() {
            this.$element.removeClass("collapsing").addClass("in")[dimension]("auto");
            this.transitioning = 0;
            this.$element.trigger("shown.bs.collapse");
        };
        if (!$.support.transition) return complete.call(this);
        var scrollSize = $.camelCase([ "scroll", dimension ].join("-"));
        this.$element.one($.support.transition.end, $.proxy(complete, this)).emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize]);
    };
    Collapse.prototype.hide = function() {
        if (this.transitioning || !this.$element.hasClass("in")) return;
        var startEvent = $.Event("hide.bs.collapse");
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented()) return;
        var dimension = this.dimension();
        this.$element[dimension](this.$element[dimension]())[0].offsetHeight;
        this.$element.addClass("collapsing").removeClass("collapse").removeClass("in");
        this.transitioning = 1;
        var complete = function() {
            this.transitioning = 0;
            this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse");
        };
        if (!$.support.transition) return complete.call(this);
        this.$element[dimension](0).one($.support.transition.end, $.proxy(complete, this)).emulateTransitionEnd(350);
    };
    Collapse.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]();
    };
    var old = $.fn.collapse;
    $.fn.collapse = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.collapse");
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == "object" && option);
            if (!data) $this.data("bs.collapse", data = new Collapse(this, options));
            if (typeof option == "string") data[option]();
        });
    };
    $.fn.collapse.Constructor = Collapse;
    $.fn.collapse.noConflict = function() {
        $.fn.collapse = old;
        return this;
    };
    $(document).on("click.bs.collapse.data-api", "[data-toggle=collapse]", function(e) {
        var $this = $(this), href;
        var target = $this.attr("data-target") || e.preventDefault() || (href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, "");
        var $target = $(target);
        var data = $target.data("bs.collapse");
        var option = data ? "toggle" : $this.data();
        var parent = $this.attr("data-parent");
        var $parent = parent && $(parent);
        if (!data || !data.transitioning) {
            if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass("collapsed");
            $this[$target.hasClass("in") ? "addClass" : "removeClass"]("collapsed");
        }
        $target.collapse(option);
    });
}(window.jQuery);

+function($) {
    "use strict";
    var backdrop = ".dropdown-backdrop";
    var toggle = "[data-toggle=dropdown]";
    var Dropdown = function(element) {
        var $el = $(element).on("click.bs.dropdown", this.toggle);
    };
    Dropdown.prototype.toggle = function(e) {
        var $this = $(this);
        if ($this.is(".disabled, :disabled")) return;
        var $parent = getParent($this);
        var isActive = $parent.hasClass("open");
        clearMenus();
        if (!isActive) {
            if ("ontouchstart" in document.documentElement && !$parent.closest(".navbar-nav").length) {
                $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on("click", clearMenus);
            }
            $parent.trigger(e = $.Event("show.bs.dropdown"));
            if (e.isDefaultPrevented()) return;
            $parent.toggleClass("open").trigger("shown.bs.dropdown");
            $this.focus();
        }
        return false;
    };
    Dropdown.prototype.keydown = function(e) {
        if (!/(38|40|27)/.test(e.keyCode)) return;
        var $this = $(this);
        e.preventDefault();
        e.stopPropagation();
        if ($this.is(".disabled, :disabled")) return;
        var $parent = getParent($this);
        var isActive = $parent.hasClass("open");
        if (!isActive || isActive && e.keyCode == 27) {
            if (e.which == 27) $parent.find(toggle).focus();
            return $this.click();
        }
        var $items = $("[role=menu] li:not(.divider):visible a", $parent);
        if (!$items.length) return;
        var index = $items.index($items.filter(":focus"));
        if (e.keyCode == 38 && index > 0) index--;
        if (e.keyCode == 40 && index < $items.length - 1) index++;
        if (!~index) index = 0;
        $items.eq(index).focus();
    };
    function clearMenus() {
        $(backdrop).remove();
        $(toggle).each(function(e) {
            var $parent = getParent($(this));
            if (!$parent.hasClass("open")) return;
            $parent.trigger(e = $.Event("hide.bs.dropdown"));
            if (e.isDefaultPrevented()) return;
            $parent.removeClass("open").trigger("hidden.bs.dropdown");
        });
    }
    function getParent($this) {
        var selector = $this.attr("data-target");
        if (!selector) {
            selector = $this.attr("href");
            selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, "");
        }
        var $parent = selector && $(selector);
        return $parent && $parent.length ? $parent : $this.parent();
    }
    var old = $.fn.dropdown;
    $.fn.dropdown = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("dropdown");
            if (!data) $this.data("dropdown", data = new Dropdown(this));
            if (typeof option == "string") data[option].call($this);
        });
    };
    $.fn.dropdown.Constructor = Dropdown;
    $.fn.dropdown.noConflict = function() {
        $.fn.dropdown = old;
        return this;
    };
    $(document).on("click.bs.dropdown.data-api", clearMenus).on("click.bs.dropdown.data-api", ".dropdown form", function(e) {
        e.stopPropagation();
    }).on("click.bs.dropdown.data-api", toggle, Dropdown.prototype.toggle).on("keydown.bs.dropdown.data-api", toggle + ", [role=menu]", Dropdown.prototype.keydown);
}(window.jQuery);

+function($) {
    "use strict";
    var Modal = function(element, options) {
        this.options = options;
        this.$element = $(element);
        this.$backdrop = this.isShown = null;
        if (this.options.remote) this.$element.load(this.options.remote);
    };
    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    };
    Modal.prototype.toggle = function(_relatedTarget) {
        return this[!this.isShown ? "show" : "hide"](_relatedTarget);
    };
    Modal.prototype.show = function(_relatedTarget) {
        var that = this;
        var e = $.Event("show.bs.modal", {
            relatedTarget: _relatedTarget
        });
        this.$element.trigger(e);
        if (this.isShown || e.isDefaultPrevented()) return;
        this.isShown = true;
        this.escape();
        this.$element.on("click.dismiss.modal", '[data-dismiss="modal"]', $.proxy(this.hide, this));
        this.backdrop(function() {
            var transition = $.support.transition && that.$element.hasClass("fade");
            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body);
            }
            that.$element.show();
            if (transition) {
                that.$element[0].offsetWidth;
            }
            that.$element.addClass("in").attr("aria-hidden", false);
            that.enforceFocus();
            var e = $.Event("shown.bs.modal", {
                relatedTarget: _relatedTarget
            });
            transition ? that.$element.find(".modal-dialog").one($.support.transition.end, function() {
                that.$element.focus().trigger(e);
            }).emulateTransitionEnd(300) : that.$element.focus().trigger(e);
        });
    };
    Modal.prototype.hide = function(e) {
        if (e) e.preventDefault();
        e = $.Event("hide.bs.modal");
        this.$element.trigger(e);
        if (!this.isShown || e.isDefaultPrevented()) return;
        this.isShown = false;
        this.escape();
        $(document).off("focusin.bs.modal");
        this.$element.removeClass("in").attr("aria-hidden", true).off("click.dismiss.modal");
        $.support.transition && this.$element.hasClass("fade") ? this.$element.one($.support.transition.end, $.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal();
    };
    Modal.prototype.enforceFocus = function() {
        $(document).off("focusin.bs.modal").on("focusin.bs.modal", $.proxy(function(e) {
            if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                this.$element.focus();
            }
        }, this));
    };
    Modal.prototype.escape = function() {
        if (this.isShown && this.options.keyboard) {
            this.$element.on("keyup.dismiss.bs.modal", $.proxy(function(e) {
                e.which == 27 && this.hide();
            }, this));
        } else if (!this.isShown) {
            this.$element.off("keyup.dismiss.bs.modal");
        }
    };
    Modal.prototype.hideModal = function() {
        var that = this;
        this.$element.hide();
        this.backdrop(function() {
            that.removeBackdrop();
            that.$element.trigger("hidden.bs.modal");
        });
    };
    Modal.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
    };
    Modal.prototype.backdrop = function(callback) {
        var that = this;
        var animate = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate;
            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo(document.body);
            this.$element.on("click.dismiss.modal", $.proxy(function(e) {
                if (e.target !== e.currentTarget) return;
                this.options.backdrop == "static" ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this);
            }, this));
            if (doAnimate) this.$backdrop[0].offsetWidth;
            this.$backdrop.addClass("in");
            if (!callback) return;
            doAnimate ? this.$backdrop.one($.support.transition.end, callback).emulateTransitionEnd(150) : callback();
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            $.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one($.support.transition.end, callback).emulateTransitionEnd(150) : callback();
        } else if (callback) {
            callback();
        }
    };
    var old = $.fn.modal;
    $.fn.modal = function(option, _relatedTarget) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.modal");
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == "object" && option);
            if (!data) $this.data("bs.modal", data = new Modal(this, options));
            if (typeof option == "string") data[option](_relatedTarget); else if (options.show) data.show(_relatedTarget);
        });
    };
    $.fn.modal.Constructor = Modal;
    $.fn.modal.noConflict = function() {
        $.fn.modal = old;
        return this;
    };
    $(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(e) {
        var $this = $(this);
        var href = $this.attr("href");
        var $target = $($this.attr("data-target") || href && href.replace(/.*(?=#[^\s]+$)/, ""));
        var option = $target.data("modal") ? "toggle" : $.extend({
            remote: !/#/.test(href) && href
        }, $target.data(), $this.data());
        e.preventDefault();
        $target.modal(option, this).one("hide", function() {
            $this.is(":visible") && $this.focus();
        });
    });
    $(document).on("show.bs.modal", ".modal", function() {
        $(document.body).addClass("modal-open");
    }).on("hidden.bs.modal", ".modal", function() {
        $(document.body).removeClass("modal-open");
    });
}(window.jQuery);

+function($) {
    "use strict";
    var Tooltip = function(element, options) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null;
        this.init("tooltip", element, options);
    };
    Tooltip.DEFAULTS = {
        animation: true,
        placement: "top",
        selector: false,
        template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: false,
        container: false
    };
    Tooltip.prototype.init = function(type, element, options) {
        this.enabled = true;
        this.type = type;
        this.$element = $(element);
        this.options = this.getOptions(options);
        var triggers = this.options.trigger.split(" ");
        for (var i = triggers.length; i--; ) {
            var trigger = triggers[i];
            if (trigger == "click") {
                this.$element.on("click." + this.type, this.options.selector, $.proxy(this.toggle, this));
            } else if (trigger != "manual") {
                var eventIn = trigger == "hover" ? "mouseenter" : "focus";
                var eventOut = trigger == "hover" ? "mouseleave" : "blur";
                this.$element.on(eventIn + "." + this.type, this.options.selector, $.proxy(this.enter, this));
                this.$element.on(eventOut + "." + this.type, this.options.selector, $.proxy(this.leave, this));
            }
        }
        this.options.selector ? this._options = $.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle();
    };
    Tooltip.prototype.getDefaults = function() {
        return Tooltip.DEFAULTS;
    };
    Tooltip.prototype.getOptions = function(options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);
        if (options.delay && typeof options.delay == "number") {
            options.delay = {
                show: options.delay,
                hide: options.delay
            };
        }
        return options;
    };
    Tooltip.prototype.getDelegateOptions = function() {
        var options = {};
        var defaults = this.getDefaults();
        this._options && $.each(this._options, function(key, value) {
            if (defaults[key] != value) options[key] = value;
        });
        return options;
    };
    Tooltip.prototype.enter = function(obj) {
        var self = obj instanceof this.constructor ? obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type);
        clearTimeout(self.timeout);
        self.hoverState = "in";
        if (!self.options.delay || !self.options.delay.show) return self.show();
        self.timeout = setTimeout(function() {
            if (self.hoverState == "in") self.show();
        }, self.options.delay.show);
    };
    Tooltip.prototype.leave = function(obj) {
        var self = obj instanceof this.constructor ? obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type);
        clearTimeout(self.timeout);
        self.hoverState = "out";
        if (!self.options.delay || !self.options.delay.hide) return self.hide();
        self.timeout = setTimeout(function() {
            if (self.hoverState == "out") self.hide();
        }, self.options.delay.hide);
    };
    Tooltip.prototype.show = function() {
        var e = $.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e);
            if (e.isDefaultPrevented()) return;
            var $tip = this.tip();
            this.setContent();
            if (this.options.animation) $tip.addClass("fade");
            var placement = typeof this.options.placement == "function" ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;
            var autoToken = /\s?auto?\s?/i;
            var autoPlace = autoToken.test(placement);
            if (autoPlace) placement = placement.replace(autoToken, "") || "top";
            $tip.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(placement);
            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
            var pos = this.getPosition();
            var actualWidth = $tip[0].offsetWidth;
            var actualHeight = $tip[0].offsetHeight;
            if (autoPlace) {
                var $parent = this.$element.parent();
                var orgPlacement = placement;
                var docScroll = document.documentElement.scrollTop || document.body.scrollTop;
                var parentWidth = this.options.container == "body" ? window.innerWidth : $parent.outerWidth();
                var parentHeight = this.options.container == "body" ? window.innerHeight : $parent.outerHeight();
                var parentLeft = this.options.container == "body" ? 0 : $parent.offset().left;
                placement = placement == "bottom" && pos.top + pos.height + actualHeight - docScroll > parentHeight ? "top" : placement == "top" && pos.top - docScroll - actualHeight < 0 ? "bottom" : placement == "right" && pos.right + actualWidth > parentWidth ? "left" : placement == "left" && pos.left - actualWidth < parentLeft ? "right" : placement;
                $tip.removeClass(orgPlacement).addClass(placement);
            }
            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
            this.applyPlacement(calculatedOffset, placement);
            this.$element.trigger("shown.bs." + this.type);
        }
    };
    Tooltip.prototype.applyPlacement = function(offset, placement) {
        var replace;
        var $tip = this.tip();
        var width = $tip[0].offsetWidth;
        var height = $tip[0].offsetHeight;
        var marginTop = parseInt($tip.css("margin-top"), 10);
        var marginLeft = parseInt($tip.css("margin-left"), 10);
        if (isNaN(marginTop)) marginTop = 0;
        if (isNaN(marginLeft)) marginLeft = 0;
        offset.top = offset.top + marginTop;
        offset.left = offset.left + marginLeft;
        $tip.offset(offset).addClass("in");
        var actualWidth = $tip[0].offsetWidth;
        var actualHeight = $tip[0].offsetHeight;
        if (placement == "top" && actualHeight != height) {
            replace = true;
            offset.top = offset.top + height - actualHeight;
        }
        if (/bottom|top/.test(placement)) {
            var delta = 0;
            if (offset.left < 0) {
                delta = offset.left * -2;
                offset.left = 0;
                $tip.offset(offset);
                actualWidth = $tip[0].offsetWidth;
                actualHeight = $tip[0].offsetHeight;
            }
            this.replaceArrow(delta - width + actualWidth, actualWidth, "left");
        } else {
            this.replaceArrow(actualHeight - height, actualHeight, "top");
        }
        if (replace) $tip.offset(offset);
    };
    Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
        this.arrow().css(position, delta ? 50 * (1 - delta / dimension) + "%" : "");
    };
    Tooltip.prototype.setContent = function() {
        var $tip = this.tip();
        var title = this.getTitle();
        $tip.find(".tooltip-inner")[this.options.html ? "html" : "text"](title);
        $tip.removeClass("fade in top bottom left right");
    };
    Tooltip.prototype.hide = function() {
        var that = this;
        var $tip = this.tip();
        var e = $.Event("hide.bs." + this.type);
        function complete() {
            if (that.hoverState != "in") $tip.detach();
        }
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;
        $tip.removeClass("in");
        $.support.transition && this.$tip.hasClass("fade") ? $tip.one($.support.transition.end, complete).emulateTransitionEnd(150) : complete();
        this.$element.trigger("hidden.bs." + this.type);
        return this;
    };
    Tooltip.prototype.fixTitle = function() {
        var $e = this.$element;
        if ($e.attr("title") || typeof $e.attr("data-original-title") != "string") {
            $e.attr("data-original-title", $e.attr("title") || "").attr("title", "");
        }
    };
    Tooltip.prototype.hasContent = function() {
        return this.getTitle();
    };
    Tooltip.prototype.getPosition = function() {
        var el = this.$element[0];
        return $.extend({}, typeof el.getBoundingClientRect == "function" ? el.getBoundingClientRect() : {
            width: el.offsetWidth,
            height: el.offsetHeight
        }, this.$element.offset());
    };
    Tooltip.prototype.getCalculatedOffset = function(placement, pos, actualWidth, actualHeight) {
        return placement == "bottom" ? {
            top: pos.top + pos.height,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : placement == "top" ? {
            top: pos.top - actualHeight,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : placement == "left" ? {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left - actualWidth
        } : {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left + pos.width
        };
    };
    Tooltip.prototype.getTitle = function() {
        var title;
        var $e = this.$element;
        var o = this.options;
        title = $e.attr("data-original-title") || (typeof o.title == "function" ? o.title.call($e[0]) : o.title);
        return title;
    };
    Tooltip.prototype.tip = function() {
        return this.$tip = this.$tip || $(this.options.template);
    };
    Tooltip.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow");
    };
    Tooltip.prototype.validate = function() {
        if (!this.$element[0].parentNode) {
            this.hide();
            this.$element = null;
            this.options = null;
        }
    };
    Tooltip.prototype.enable = function() {
        this.enabled = true;
    };
    Tooltip.prototype.disable = function() {
        this.enabled = false;
    };
    Tooltip.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled;
    };
    Tooltip.prototype.toggle = function(e) {
        var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type) : this;
        self.tip().hasClass("in") ? self.leave(self) : self.enter(self);
    };
    Tooltip.prototype.destroy = function() {
        this.hide().$element.off("." + this.type).removeData("bs." + this.type);
    };
    var old = $.fn.tooltip;
    $.fn.tooltip = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.tooltip");
            var options = typeof option == "object" && option;
            if (!data) $this.data("bs.tooltip", data = new Tooltip(this, options));
            if (typeof option == "string") data[option]();
        });
    };
    $.fn.tooltip.Constructor = Tooltip;
    $.fn.tooltip.noConflict = function() {
        $.fn.tooltip = old;
        return this;
    };
}(window.jQuery);

+function($) {
    "use strict";
    var Popover = function(element, options) {
        this.init("popover", element, options);
    };
    if (!$.fn.tooltip) throw new Error("Popover requires tooltip.js");
    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });
    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);
    Popover.prototype.constructor = Popover;
    Popover.prototype.getDefaults = function() {
        return Popover.DEFAULTS;
    };
    Popover.prototype.setContent = function() {
        var $tip = this.tip();
        var title = this.getTitle();
        var content = this.getContent();
        $tip.find(".popover-title")[this.options.html ? "html" : "text"](title);
        $tip.find(".popover-content")[this.options.html ? "html" : "text"](content);
        $tip.removeClass("fade top bottom left right in");
        if (!$tip.find(".popover-title").html()) $tip.find(".popover-title").hide();
    };
    Popover.prototype.hasContent = function() {
        return this.getTitle() || this.getContent();
    };
    Popover.prototype.getContent = function() {
        var $e = this.$element;
        var o = this.options;
        return $e.attr("data-content") || (typeof o.content == "function" ? o.content.call($e[0]) : o.content);
    };
    Popover.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow");
    };
    Popover.prototype.tip = function() {
        if (!this.$tip) this.$tip = $(this.options.template);
        return this.$tip;
    };
    var old = $.fn.popover;
    $.fn.popover = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.popover");
            var options = typeof option == "object" && option;
            if (!data) $this.data("bs.popover", data = new Popover(this, options));
            if (typeof option == "string") data[option]();
        });
    };
    $.fn.popover.Constructor = Popover;
    $.fn.popover.noConflict = function() {
        $.fn.popover = old;
        return this;
    };
}(window.jQuery);

+function($) {
    "use strict";
    function ScrollSpy(element, options) {
        var href;
        var process = $.proxy(this.process, this);
        this.$element = $(element).is("body") ? $(window) : $(element);
        this.$body = $("body");
        this.$scrollElement = this.$element.on("scroll.bs.scroll-spy.data-api", process);
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
        this.selector = (this.options.target || (href = $(element).attr("href")) && href.replace(/.*(?=#[^\s]+$)/, "") || "") + " .nav li > a";
        this.offsets = $([]);
        this.targets = $([]);
        this.activeTarget = null;
        this.refresh();
        this.process();
    }
    ScrollSpy.DEFAULTS = {
        offset: 10
    };
    ScrollSpy.prototype.refresh = function() {
        var offsetMethod = this.$element[0] == window ? "offset" : "position";
        this.offsets = $([]);
        this.targets = $([]);
        var self = this;
        var $targets = this.$body.find(this.selector).map(function() {
            var $el = $(this);
            var href = $el.data("target") || $el.attr("href");
            var $href = /^#\w/.test(href) && $(href);
            return $href && $href.length && [ [ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ] ] || null;
        }).sort(function(a, b) {
            return a[0] - b[0];
        }).each(function() {
            self.offsets.push(this[0]);
            self.targets.push(this[1]);
        });
    };
    ScrollSpy.prototype.process = function() {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
        var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight;
        var maxScroll = scrollHeight - this.$scrollElement.height();
        var offsets = this.offsets;
        var targets = this.targets;
        var activeTarget = this.activeTarget;
        var i;
        if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets.last()[0]) && this.activate(i);
        }
        for (i = offsets.length; i--; ) {
            activeTarget != targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1]) && this.activate(targets[i]);
        }
    };
    ScrollSpy.prototype.activate = function(target) {
        this.activeTarget = target;
        $(this.selector).parents(".active").removeClass("active");
        var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';
        var active = $(selector).parents("li").addClass("active");
        if (active.parent(".dropdown-menu").length) {
            active = active.closest("li.dropdown").addClass("active");
        }
        active.trigger("activate");
    };
    var old = $.fn.scrollspy;
    $.fn.scrollspy = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.scrollspy");
            var options = typeof option == "object" && option;
            if (!data) $this.data("bs.scrollspy", data = new ScrollSpy(this, options));
            if (typeof option == "string") data[option]();
        });
    };
    $.fn.scrollspy.Constructor = ScrollSpy;
    $.fn.scrollspy.noConflict = function() {
        $.fn.scrollspy = old;
        return this;
    };
    $(window).on("load", function() {
        $('[data-spy="scroll"]').each(function() {
            var $spy = $(this);
            $spy.scrollspy($spy.data());
        });
    });
}(window.jQuery);

+function($) {
    "use strict";
    var Tab = function(element) {
        this.element = $(element);
    };
    Tab.prototype.show = function() {
        var $this = this.element;
        var $ul = $this.closest("ul:not(.dropdown-menu)");
        var selector = $this.attr("data-target");
        if (!selector) {
            selector = $this.attr("href");
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, "");
        }
        if ($this.parent("li").hasClass("active")) return;
        var previous = $ul.find(".active:last a")[0];
        var e = $.Event("show.bs.tab", {
            relatedTarget: previous
        });
        $this.trigger(e);
        if (e.isDefaultPrevented()) return;
        var $target = $(selector);
        this.activate($this.parent("li"), $ul);
        this.activate($target, $target.parent(), function() {
            $this.trigger({
                type: "shown.bs.tab",
                relatedTarget: previous
            });
        });
    };
    Tab.prototype.activate = function(element, container, callback) {
        var $active = container.find("> .active");
        var transition = callback && $.support.transition && $active.hasClass("fade");
        function next() {
            $active.removeClass("active").find("> .dropdown-menu > .active").removeClass("active");
            element.addClass("active");
            if (transition) {
                element[0].offsetWidth;
                element.addClass("in");
            } else {
                element.removeClass("fade");
            }
            if (element.parent(".dropdown-menu")) {
                element.closest("li.dropdown").addClass("active");
            }
            callback && callback();
        }
        transition ? $active.one($.support.transition.end, next).emulateTransitionEnd(150) : next();
        $active.removeClass("in");
    };
    var old = $.fn.tab;
    $.fn.tab = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.tab");
            if (!data) $this.data("bs.tab", data = new Tab(this));
            if (typeof option == "string") data[option]();
        });
    };
    $.fn.tab.Constructor = Tab;
    $.fn.tab.noConflict = function() {
        $.fn.tab = old;
        return this;
    };
    $(document).on("click.bs.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]', function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
}(window.jQuery);

+function($) {
    "use strict";
    var Affix = function(element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options);
        this.$window = $(window).on("scroll.bs.affix.data-api", $.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", $.proxy(this.checkPositionWithEventLoop, this));
        this.$element = $(element);
        this.affixed = this.unpin = null;
        this.checkPosition();
    };
    Affix.RESET = "affix affix-top affix-bottom";
    Affix.DEFAULTS = {
        offset: 0
    };
    Affix.prototype.checkPositionWithEventLoop = function() {
        setTimeout($.proxy(this.checkPosition, this), 1);
    };
    Affix.prototype.checkPosition = function() {
        if (!this.$element.is(":visible")) return;
        var scrollHeight = $(document).height();
        var scrollTop = this.$window.scrollTop();
        var position = this.$element.offset();
        var offset = this.options.offset;
        var offsetTop = offset.top;
        var offsetBottom = offset.bottom;
        if (typeof offset != "object") offsetBottom = offsetTop = offset;
        if (typeof offsetTop == "function") offsetTop = offset.top();
        if (typeof offsetBottom == "function") offsetBottom = offset.bottom();
        var affix = this.unpin != null && scrollTop + this.unpin <= position.top ? false : offsetBottom != null && position.top + this.$element.height() >= scrollHeight - offsetBottom ? "bottom" : offsetTop != null && scrollTop <= offsetTop ? "top" : false;
        if (this.affixed === affix) return;
        if (this.unpin) this.$element.css("top", "");
        this.affixed = affix;
        this.unpin = affix == "bottom" ? position.top - scrollTop : null;
        this.$element.removeClass(Affix.RESET).addClass("affix" + (affix ? "-" + affix : ""));
        if (affix == "bottom") {
            this.$element.offset({
                top: document.body.offsetHeight - offsetBottom - this.$element.height()
            });
        }
    };
    var old = $.fn.affix;
    $.fn.affix = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.affix");
            var options = typeof option == "object" && option;
            if (!data) $this.data("bs.affix", data = new Affix(this, options));
            if (typeof option == "string") data[option]();
        });
    };
    $.fn.affix.Constructor = Affix;
    $.fn.affix.noConflict = function() {
        $.fn.affix = old;
        return this;
    };
    $(window).on("load", function() {
        $('[data-spy="affix"]').each(function() {
            var $spy = $(this);
            var data = $spy.data();
            data.offset = data.offset || {};
            if (data.offsetBottom) data.offset.bottom = data.offsetBottom;
            if (data.offsetTop) data.offset.top = data.offsetTop;
            $spy.affix(data);
        });
    });
}(window.jQuery);

(function() {
    var t = [].indexOf || function(t) {
        for (var e = 0, n = this.length; e < n; e++) {
            if (e in this && this[e] === t) return e;
        }
        return -1;
    }, e = [].slice;
    (function(t, e) {
        if (typeof define === "function" && define.amd) {
            return define("waypoints", [ "jquery" ], function(n) {
                return e(n, t);
            });
        } else {
            return e(t.jQuery, t);
        }
    })(window, function(n, r) {
        var i, o, l, s, f, u, c, a, h, d, p, y, v, w, g, m;
        i = n(r);
        a = t.call(r, "ontouchstart") >= 0;
        s = {
            horizontal: {},
            vertical: {}
        };
        f = 1;
        c = {};
        u = "waypoints-context-id";
        p = "resize.waypoints";
        y = "scroll.waypoints";
        v = 1;
        w = "waypoints-waypoint-ids";
        g = "waypoint";
        m = "waypoints";
        o = function() {
            function t(t) {
                var e = this;
                this.$element = t;
                this.element = t[0];
                this.didResize = false;
                this.didScroll = false;
                this.id = "context" + f++;
                this.oldScroll = {
                    x: t.scrollLeft(),
                    y: t.scrollTop()
                };
                this.waypoints = {
                    horizontal: {},
                    vertical: {}
                };
                this.element[u] = this.id;
                c[this.id] = this;
                t.bind(y, function() {
                    var t;
                    if (!(e.didScroll || a)) {
                        e.didScroll = true;
                        t = function() {
                            e.doScroll();
                            return e.didScroll = false;
                        };
                        return r.setTimeout(t, n[m].settings.scrollThrottle);
                    }
                });
                t.bind(p, function() {
                    var t;
                    if (!e.didResize) {
                        e.didResize = true;
                        t = function() {
                            n[m]("refresh");
                            return e.didResize = false;
                        };
                        return r.setTimeout(t, n[m].settings.resizeThrottle);
                    }
                });
            }
            t.prototype.doScroll = function() {
                var t, e = this;
                t = {
                    horizontal: {
                        newScroll: this.$element.scrollLeft(),
                        oldScroll: this.oldScroll.x,
                        forward: "right",
                        backward: "left"
                    },
                    vertical: {
                        newScroll: this.$element.scrollTop(),
                        oldScroll: this.oldScroll.y,
                        forward: "down",
                        backward: "up"
                    }
                };
                if (a && (!t.vertical.oldScroll || !t.vertical.newScroll)) {
                    n[m]("refresh");
                }
                n.each(t, function(t, r) {
                    var i, o, l;
                    l = [];
                    o = r.newScroll > r.oldScroll;
                    i = o ? r.forward : r.backward;
                    n.each(e.waypoints[t], function(t, e) {
                        var n, i;
                        if (r.oldScroll < (n = e.offset) && n <= r.newScroll) {
                            return l.push(e);
                        } else if (r.newScroll < (i = e.offset) && i <= r.oldScroll) {
                            return l.push(e);
                        }
                    });
                    l.sort(function(t, e) {
                        return t.offset - e.offset;
                    });
                    if (!o) {
                        l.reverse();
                    }
                    return n.each(l, function(t, e) {
                        if (e.options.continuous || t === l.length - 1) {
                            return e.trigger([ i ]);
                        }
                    });
                });
                return this.oldScroll = {
                    x: t.horizontal.newScroll,
                    y: t.vertical.newScroll
                };
            };
            t.prototype.refresh = function() {
                var t, e, r, i = this;
                r = n.isWindow(this.element);
                e = this.$element.offset();
                this.doScroll();
                t = {
                    horizontal: {
                        contextOffset: r ? 0 : e.left,
                        contextScroll: r ? 0 : this.oldScroll.x,
                        contextDimension: this.$element.width(),
                        oldScroll: this.oldScroll.x,
                        forward: "right",
                        backward: "left",
                        offsetProp: "left"
                    },
                    vertical: {
                        contextOffset: r ? 0 : e.top,
                        contextScroll: r ? 0 : this.oldScroll.y,
                        contextDimension: r ? n[m]("viewportHeight") : this.$element.height(),
                        oldScroll: this.oldScroll.y,
                        forward: "down",
                        backward: "up",
                        offsetProp: "top"
                    }
                };
                return n.each(t, function(t, e) {
                    return n.each(i.waypoints[t], function(t, r) {
                        var i, o, l, s, f;
                        i = r.options.offset;
                        l = r.offset;
                        o = n.isWindow(r.element) ? 0 : r.$element.offset()[e.offsetProp];
                        if (n.isFunction(i)) {
                            i = i.apply(r.element);
                        } else if (typeof i === "string") {
                            i = parseFloat(i);
                            if (r.options.offset.indexOf("%") > -1) {
                                i = Math.ceil(e.contextDimension * i / 100);
                            }
                        }
                        r.offset = o - e.contextOffset + e.contextScroll - i;
                        if (r.options.onlyOnScroll && l != null || !r.enabled) {
                            return;
                        }
                        if (l !== null && l < (s = e.oldScroll) && s <= r.offset) {
                            return r.trigger([ e.backward ]);
                        } else if (l !== null && l > (f = e.oldScroll) && f >= r.offset) {
                            return r.trigger([ e.forward ]);
                        } else if (l === null && e.oldScroll >= r.offset) {
                            return r.trigger([ e.forward ]);
                        }
                    });
                });
            };
            t.prototype.checkEmpty = function() {
                if (n.isEmptyObject(this.waypoints.horizontal) && n.isEmptyObject(this.waypoints.vertical)) {
                    this.$element.unbind([ p, y ].join(" "));
                    return delete c[this.id];
                }
            };
            return t;
        }();
        l = function() {
            function t(t, e, r) {
                var i, o;
                if (r.offset === "bottom-in-view") {
                    r.offset = function() {
                        var t;
                        t = n[m]("viewportHeight");
                        if (!n.isWindow(e.element)) {
                            t = e.$element.height();
                        }
                        return t - n(this).outerHeight();
                    };
                }
                this.$element = t;
                this.element = t[0];
                this.axis = r.horizontal ? "horizontal" : "vertical";
                this.callback = r.handler;
                this.context = e;
                this.enabled = r.enabled;
                this.id = "waypoints" + v++;
                this.offset = null;
                this.options = r;
                e.waypoints[this.axis][this.id] = this;
                s[this.axis][this.id] = this;
                i = (o = this.element[w]) != null ? o : [];
                i.push(this.id);
                this.element[w] = i;
            }
            t.prototype.trigger = function(t) {
                if (!this.enabled) {
                    return;
                }
                if (this.callback != null) {
                    this.callback.apply(this.element, t);
                }
                if (this.options.triggerOnce) {
                    return this.destroy();
                }
            };
            t.prototype.disable = function() {
                return this.enabled = false;
            };
            t.prototype.enable = function() {
                this.context.refresh();
                return this.enabled = true;
            };
            t.prototype.destroy = function() {
                delete s[this.axis][this.id];
                delete this.context.waypoints[this.axis][this.id];
                return this.context.checkEmpty();
            };
            t.getWaypointsByElement = function(t) {
                var e, r;
                r = t[w];
                if (!r) {
                    return [];
                }
                e = n.extend({}, s.horizontal, s.vertical);
                return n.map(r, function(t) {
                    return e[t];
                });
            };
            return t;
        }();
        d = {
            init: function(t, e) {
                var r;
                e = n.extend({}, n.fn[g].defaults, e);
                if ((r = e.handler) == null) {
                    e.handler = t;
                }
                this.each(function() {
                    var t, r, i, s;
                    t = n(this);
                    i = (s = e.context) != null ? s : n.fn[g].defaults.context;
                    if (!n.isWindow(i)) {
                        i = t.closest(i);
                    }
                    i = n(i);
                    r = c[i[0][u]];
                    if (!r) {
                        r = new o(i);
                    }
                    return new l(t, r, e);
                });
                n[m]("refresh");
                return this;
            },
            disable: function() {
                return d._invoke.call(this, "disable");
            },
            enable: function() {
                return d._invoke.call(this, "enable");
            },
            destroy: function() {
                return d._invoke.call(this, "destroy");
            },
            prev: function(t, e) {
                return d._traverse.call(this, t, e, function(t, e, n) {
                    if (e > 0) {
                        return t.push(n[e - 1]);
                    }
                });
            },
            next: function(t, e) {
                return d._traverse.call(this, t, e, function(t, e, n) {
                    if (e < n.length - 1) {
                        return t.push(n[e + 1]);
                    }
                });
            },
            _traverse: function(t, e, i) {
                var o, l;
                if (t == null) {
                    t = "vertical";
                }
                if (e == null) {
                    e = r;
                }
                l = h.aggregate(e);
                o = [];
                this.each(function() {
                    var e;
                    e = n.inArray(this, l[t]);
                    return i(o, e, l[t]);
                });
                return this.pushStack(o);
            },
            _invoke: function(t) {
                this.each(function() {
                    var e;
                    e = l.getWaypointsByElement(this);
                    return n.each(e, function(e, n) {
                        n[t]();
                        return true;
                    });
                });
                return this;
            }
        };
        n.fn[g] = function() {
            var t, r;
            r = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
            if (d[r]) {
                return d[r].apply(this, t);
            } else if (n.isFunction(r)) {
                return d.init.apply(this, arguments);
            } else if (n.isPlainObject(r)) {
                return d.init.apply(this, [ null, r ]);
            } else if (!r) {
                return n.error("jQuery Waypoints needs a callback function or handler option.");
            } else {
                return n.error("The " + r + " method does not exist in jQuery Waypoints.");
            }
        };
        n.fn[g].defaults = {
            context: r,
            continuous: true,
            enabled: true,
            horizontal: false,
            offset: 0,
            triggerOnce: false
        };
        h = {
            refresh: function() {
                return n.each(c, function(t, e) {
                    return e.refresh();
                });
            },
            viewportHeight: function() {
                var t;
                return (t = r.innerHeight) != null ? t : i.height();
            },
            aggregate: function(t) {
                var e, r, i;
                e = s;
                if (t) {
                    e = (i = c[n(t)[0][u]]) != null ? i.waypoints : void 0;
                }
                if (!e) {
                    return [];
                }
                r = {
                    horizontal: [],
                    vertical: []
                };
                n.each(r, function(t, i) {
                    n.each(e[t], function(t, e) {
                        return i.push(e);
                    });
                    i.sort(function(t, e) {
                        return t.offset - e.offset;
                    });
                    r[t] = n.map(i, function(t) {
                        return t.element;
                    });
                    return r[t] = n.unique(r[t]);
                });
                return r;
            },
            above: function(t) {
                if (t == null) {
                    t = r;
                }
                return h._filter(t, "vertical", function(t, e) {
                    return e.offset <= t.oldScroll.y;
                });
            },
            below: function(t) {
                if (t == null) {
                    t = r;
                }
                return h._filter(t, "vertical", function(t, e) {
                    return e.offset > t.oldScroll.y;
                });
            },
            left: function(t) {
                if (t == null) {
                    t = r;
                }
                return h._filter(t, "horizontal", function(t, e) {
                    return e.offset <= t.oldScroll.x;
                });
            },
            right: function(t) {
                if (t == null) {
                    t = r;
                }
                return h._filter(t, "horizontal", function(t, e) {
                    return e.offset > t.oldScroll.x;
                });
            },
            enable: function() {
                return h._invoke("enable");
            },
            disable: function() {
                return h._invoke("disable");
            },
            destroy: function() {
                return h._invoke("destroy");
            },
            extendFn: function(t, e) {
                return d[t] = e;
            },
            _invoke: function(t) {
                var e;
                e = n.extend({}, s.vertical, s.horizontal);
                return n.each(e, function(e, n) {
                    n[t]();
                    return true;
                });
            },
            _filter: function(t, e, r) {
                var i, o;
                i = c[n(t)[0][u]];
                if (!i) {
                    return [];
                }
                o = [];
                n.each(i.waypoints[e], function(t, e) {
                    if (r(i, e)) {
                        return o.push(e);
                    }
                });
                o.sort(function(t, e) {
                    return t.offset - e.offset;
                });
                return n.map(o, function(t) {
                    return t.element;
                });
            }
        };
        n[m] = function() {
            var t, n;
            n = arguments[0], t = 2 <= arguments.length ? e.call(arguments, 1) : [];
            if (h[n]) {
                return h[n].apply(null, t);
            } else {
                return h.aggregate.call(null, n);
            }
        };
        n[m].settings = {
            resizeThrottle: 100,
            scrollThrottle: 30
        };
        return i.on("load.waypoints", function() {
            return n[m]("refresh");
        });
    });
}).call(this);

(function(a) {
    var b = "Close", c = "BeforeClose", d = "AfterClose", e = "BeforeAppend", f = "MarkupParse", g = "Open", h = "Change", i = "mfp", j = "." + i, k = "mfp-ready", l = "mfp-removing", m = "mfp-prevent-close", n, o = function() {}, p = !!window.jQuery, q, r = a(window), s, t, u, v, w, x = function(a, b) {
        n.ev.on(i + a + j, b);
    }, y = function(b, c, d, e) {
        var f = document.createElement("div");
        return f.className = "mfp-" + b, d && (f.innerHTML = d), e ? c && c.appendChild(f) : (f = a(f), 
        c && f.appendTo(c)), f;
    }, z = function(b, c) {
        n.ev.triggerHandler(i + b, c), n.st.callbacks && (b = b.charAt(0).toLowerCase() + b.slice(1), 
        n.st.callbacks[b] && n.st.callbacks[b].apply(n, a.isArray(c) ? c : [ c ]));
    }, A = function(b) {
        if (b !== w || !n.currTemplate.closeBtn) n.currTemplate.closeBtn = a(n.st.closeMarkup.replace("%title%", n.st.tClose)), 
        w = b;
        return n.currTemplate.closeBtn;
    }, B = function() {
        a.magnificPopup.instance || (n = new o(), n.init(), a.magnificPopup.instance = n);
    }, C = function() {
        var a = document.createElement("p").style, b = [ "ms", "O", "Moz", "Webkit" ];
        if (a.transition !== undefined) return !0;
        while (b.length) if (b.pop() + "Transition" in a) return !0;
        return !1;
    };
    o.prototype = {
        constructor: o,
        init: function() {
            var b = navigator.appVersion;
            n.isIE7 = b.indexOf("MSIE 7.") !== -1, n.isIE8 = b.indexOf("MSIE 8.") !== -1, n.isLowIE = n.isIE7 || n.isIE8, 
            n.isAndroid = /android/gi.test(b), n.isIOS = /iphone|ipad|ipod/gi.test(b), n.supportsTransition = C(), 
            n.probablyMobile = n.isAndroid || n.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), 
            t = a(document), n.popupsCache = {};
        },
        open: function(b) {
            s || (s = a(document.body));
            var c;
            if (b.isObj === !1) {
                n.items = b.items.toArray(), n.index = 0;
                var d = b.items, e;
                for (c = 0; c < d.length; c++) {
                    e = d[c], e.parsed && (e = e.el[0]);
                    if (e === b.el[0]) {
                        n.index = c;
                        break;
                    }
                }
            } else n.items = a.isArray(b.items) ? b.items : [ b.items ], n.index = b.index || 0;
            if (n.isOpen) {
                n.updateItemHTML();
                return;
            }
            n.types = [], v = "", b.mainEl && b.mainEl.length ? n.ev = b.mainEl.eq(0) : n.ev = t, 
            b.key ? (n.popupsCache[b.key] || (n.popupsCache[b.key] = {}), n.currTemplate = n.popupsCache[b.key]) : n.currTemplate = {}, 
            n.st = a.extend(!0, {}, a.magnificPopup.defaults, b), n.fixedContentPos = n.st.fixedContentPos === "auto" ? !n.probablyMobile : n.st.fixedContentPos, 
            n.st.modal && (n.st.closeOnContentClick = !1, n.st.closeOnBgClick = !1, n.st.showCloseBtn = !1, 
            n.st.enableEscapeKey = !1), n.bgOverlay || (n.bgOverlay = y("bg").on("click" + j, function() {
                n.close();
            }), n.wrap = y("wrap").attr("tabindex", -1).on("click" + j, function(a) {
                n._checkIfClose(a.target) && n.close();
            }), n.container = y("container", n.wrap)), n.contentContainer = y("content"), n.st.preloader && (n.preloader = y("preloader", n.container, n.st.tLoading));
            var h = a.magnificPopup.modules;
            for (c = 0; c < h.length; c++) {
                var i = h[c];
                i = i.charAt(0).toUpperCase() + i.slice(1), n["init" + i].call(n);
            }
            z("BeforeOpen"), n.st.showCloseBtn && (n.st.closeBtnInside ? (x(f, function(a, b, c, d) {
                c.close_replaceWith = A(d.type);
            }), v += " mfp-close-btn-in") : n.wrap.append(A())), n.st.alignTop && (v += " mfp-align-top"), 
            n.fixedContentPos ? n.wrap.css({
                overflow: n.st.overflowY,
                overflowX: "hidden",
                overflowY: n.st.overflowY
            }) : n.wrap.css({
                top: r.scrollTop(),
                position: "absolute"
            }), (n.st.fixedBgPos === !1 || n.st.fixedBgPos === "auto" && !n.fixedContentPos) && n.bgOverlay.css({
                height: t.height(),
                position: "absolute"
            }), n.st.enableEscapeKey && t.on("keyup" + j, function(a) {
                a.keyCode === 27 && n.close();
            }), r.on("resize" + j, function() {
                n.updateSize();
            }), n.st.closeOnContentClick || (v += " mfp-auto-cursor"), v && n.wrap.addClass(v);
            var l = n.wH = r.height(), m = {};
            if (n.fixedContentPos && n._hasScrollBar(l)) {
                var o = n._getScrollbarSize();
                o && (m.marginRight = o);
            }
            n.fixedContentPos && (n.isIE7 ? a("body, html").css("overflow", "hidden") : m.overflow = "hidden");
            var p = n.st.mainClass;
            return n.isIE7 && (p += " mfp-ie7"), p && n._addClassToMFP(p), n.updateItemHTML(), 
            z("BuildControls"), a("html").css(m), n.bgOverlay.add(n.wrap).prependTo(n.st.prependTo || s), 
            n._lastFocusedEl = document.activeElement, setTimeout(function() {
                n.content ? (n._addClassToMFP(k), n._setFocus()) : n.bgOverlay.addClass(k), t.on("focusin" + j, n._onFocusIn);
            }, 16), n.isOpen = !0, n.updateSize(l), z(g), b;
        },
        close: function() {
            if (!n.isOpen) return;
            z(c), n.isOpen = !1, n.st.removalDelay && !n.isLowIE && n.supportsTransition ? (n._addClassToMFP(l), 
            setTimeout(function() {
                n._close();
            }, n.st.removalDelay)) : n._close();
        },
        _close: function() {
            z(b);
            var c = l + " " + k + " ";
            n.bgOverlay.detach(), n.wrap.detach(), n.container.empty(), n.st.mainClass && (c += n.st.mainClass + " "), 
            n._removeClassFromMFP(c);
            if (n.fixedContentPos) {
                var e = {
                    marginRight: ""
                };
                n.isIE7 ? a("body, html").css("overflow", "") : e.overflow = "", a("html").css(e);
            }
            t.off("keyup" + j + " focusin" + j), n.ev.off(j), n.wrap.attr("class", "mfp-wrap").removeAttr("style"), 
            n.bgOverlay.attr("class", "mfp-bg"), n.container.attr("class", "mfp-container"), 
            n.st.showCloseBtn && (!n.st.closeBtnInside || n.currTemplate[n.currItem.type] === !0) && n.currTemplate.closeBtn && n.currTemplate.closeBtn.detach(), 
            n._lastFocusedEl && a(n._lastFocusedEl).focus(), n.currItem = null, n.content = null, 
            n.currTemplate = null, n.prevHeight = 0, z(d);
        },
        updateSize: function(a) {
            if (n.isIOS) {
                var b = document.documentElement.clientWidth / window.innerWidth, c = window.innerHeight * b;
                n.wrap.css("height", c), n.wH = c;
            } else n.wH = a || r.height();
            n.fixedContentPos || n.wrap.css("height", n.wH), z("Resize");
        },
        updateItemHTML: function() {
            var b = n.items[n.index];
            n.contentContainer.detach(), n.content && n.content.detach(), b.parsed || (b = n.parseEl(n.index));
            var c = b.type;
            z("BeforeChange", [ n.currItem ? n.currItem.type : "", c ]), n.currItem = b;
            if (!n.currTemplate[c]) {
                var d = n.st[c] ? n.st[c].markup : !1;
                z("FirstMarkupParse", d), d ? n.currTemplate[c] = a(d) : n.currTemplate[c] = !0;
            }
            u && u !== b.type && n.container.removeClass("mfp-" + u + "-holder");
            var e = n["get" + c.charAt(0).toUpperCase() + c.slice(1)](b, n.currTemplate[c]);
            n.appendContent(e, c), b.preloaded = !0, z(h, b), u = b.type, n.container.prepend(n.contentContainer), 
            z("AfterChange");
        },
        appendContent: function(a, b) {
            n.content = a, a ? n.st.showCloseBtn && n.st.closeBtnInside && n.currTemplate[b] === !0 ? n.content.find(".mfp-close").length || n.content.append(A()) : n.content = a : n.content = "", 
            z(e), n.container.addClass("mfp-" + b + "-holder"), n.contentContainer.append(n.content);
        },
        parseEl: function(b) {
            var c = n.items[b], d;
            c.tagName ? c = {
                el: a(c)
            } : (d = c.type, c = {
                data: c,
                src: c.src
            });
            if (c.el) {
                var e = n.types;
                for (var f = 0; f < e.length; f++) if (c.el.hasClass("mfp-" + e[f])) {
                    d = e[f];
                    break;
                }
                c.src = c.el.attr("data-mfp-src"), c.src || (c.src = c.el.attr("href"));
            }
            return c.type = d || n.st.type || "inline", c.index = b, c.parsed = !0, n.items[b] = c, 
            z("ElementParse", c), n.items[b];
        },
        addGroup: function(a, b) {
            var c = function(c) {
                c.mfpEl = this, n._openClick(c, a, b);
            };
            b || (b = {});
            var d = "click.magnificPopup";
            b.mainEl = a, b.items ? (b.isObj = !0, a.off(d).on(d, c)) : (b.isObj = !1, b.delegate ? a.off(d).on(d, b.delegate, c) : (b.items = a, 
            a.off(d).on(d, c)));
        },
        _openClick: function(b, c, d) {
            var e = d.midClick !== undefined ? d.midClick : a.magnificPopup.defaults.midClick;
            if (!e && (b.which === 2 || b.ctrlKey || b.metaKey)) return;
            var f = d.disableOn !== undefined ? d.disableOn : a.magnificPopup.defaults.disableOn;
            if (f) if (a.isFunction(f)) {
                if (!f.call(n)) return !0;
            } else if (r.width() < f) return !0;
            b.type && (b.preventDefault(), n.isOpen && b.stopPropagation()), d.el = a(b.mfpEl), 
            d.delegate && (d.items = c.find(d.delegate)), n.open(d);
        },
        updateStatus: function(a, b) {
            if (n.preloader) {
                q !== a && n.container.removeClass("mfp-s-" + q), !b && a === "loading" && (b = n.st.tLoading);
                var c = {
                    status: a,
                    text: b
                };
                z("UpdateStatus", c), a = c.status, b = c.text, n.preloader.html(b), n.preloader.find("a").on("click", function(a) {
                    a.stopImmediatePropagation();
                }), n.container.addClass("mfp-s-" + a), q = a;
            }
        },
        _checkIfClose: function(b) {
            if (a(b).hasClass(m)) return;
            var c = n.st.closeOnContentClick, d = n.st.closeOnBgClick;
            if (c && d) return !0;
            if (!n.content || a(b).hasClass("mfp-close") || n.preloader && b === n.preloader[0]) return !0;
            if (b !== n.content[0] && !a.contains(n.content[0], b)) {
                if (d && a.contains(document, b)) return !0;
            } else if (c) return !0;
            return !1;
        },
        _addClassToMFP: function(a) {
            n.bgOverlay.addClass(a), n.wrap.addClass(a);
        },
        _removeClassFromMFP: function(a) {
            this.bgOverlay.removeClass(a), n.wrap.removeClass(a);
        },
        _hasScrollBar: function(a) {
            return (n.isIE7 ? t.height() : document.body.scrollHeight) > (a || r.height());
        },
        _setFocus: function() {
            (n.st.focus ? n.content.find(n.st.focus).eq(0) : n.wrap).focus();
        },
        _onFocusIn: function(b) {
            if (b.target !== n.wrap[0] && !a.contains(n.wrap[0], b.target)) return n._setFocus(), 
            !1;
        },
        _parseMarkup: function(b, c, d) {
            var e;
            d.data && (c = a.extend(d.data, c)), z(f, [ b, c, d ]), a.each(c, function(a, c) {
                if (c === undefined || c === !1) return !0;
                e = a.split("_");
                if (e.length > 1) {
                    var d = b.find(j + "-" + e[0]);
                    if (d.length > 0) {
                        var f = e[1];
                        f === "replaceWith" ? d[0] !== c[0] && d.replaceWith(c) : f === "img" ? d.is("img") ? d.attr("src", c) : d.replaceWith('<img src="' + c + '" class="' + d.attr("class") + '" />') : d.attr(e[1], c);
                    }
                } else b.find(j + "-" + a).html(c);
            });
        },
        _getScrollbarSize: function() {
            if (n.scrollbarSize === undefined) {
                var a = document.createElement("div");
                a.id = "mfp-sbm", a.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", 
                document.body.appendChild(a), n.scrollbarSize = a.offsetWidth - a.clientWidth, document.body.removeChild(a);
            }
            return n.scrollbarSize;
        }
    }, a.magnificPopup = {
        instance: null,
        proto: o.prototype,
        modules: [],
        open: function(b, c) {
            return B(), b ? b = a.extend(!0, {}, b) : b = {}, b.isObj = !0, b.index = c || 0, 
            this.instance.open(b);
        },
        close: function() {
            return a.magnificPopup.instance && a.magnificPopup.instance.close();
        },
        registerModule: function(b, c) {
            c.options && (a.magnificPopup.defaults[b] = c.options), a.extend(this.proto, c.proto), 
            this.modules.push(b);
        },
        defaults: {
            disableOn: 0,
            key: null,
            midClick: !1,
            mainClass: "",
            preloader: !0,
            focus: "",
            closeOnContentClick: !1,
            closeOnBgClick: !0,
            closeBtnInside: !0,
            showCloseBtn: !0,
            enableEscapeKey: !0,
            modal: !1,
            alignTop: !1,
            removalDelay: 0,
            prependTo: null,
            fixedContentPos: "auto",
            fixedBgPos: "auto",
            overflowY: "auto",
            closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>',
            tClose: "Close (Esc)",
            tLoading: "Loading..."
        }
    }, a.fn.magnificPopup = function(b) {
        B();
        var c = a(this);
        if (typeof b == "string") if (b === "open") {
            var d, e = p ? c.data("magnificPopup") : c[0].magnificPopup, f = parseInt(arguments[1], 10) || 0;
            e.items ? d = e.items[f] : (d = c, e.delegate && (d = d.find(e.delegate)), d = d.eq(f)), 
            n._openClick({
                mfpEl: d
            }, c, e);
        } else n.isOpen && n[b].apply(n, Array.prototype.slice.call(arguments, 1)); else b = a.extend(!0, {}, b), 
        p ? c.data("magnificPopup", b) : c[0].magnificPopup = b, n.addGroup(c, b);
        return c;
    };
    var D = "inline", E, F, G, H = function() {
        G && (F.after(G.addClass(E)).detach(), G = null);
    };
    a.magnificPopup.registerModule(D, {
        options: {
            hiddenClass: "hide",
            markup: "",
            tNotFound: "Content not found"
        },
        proto: {
            initInline: function() {
                n.types.push(D), x(b + "." + D, function() {
                    H();
                });
            },
            getInline: function(b, c) {
                H();
                if (b.src) {
                    var d = n.st.inline, e = a(b.src);
                    if (e.length) {
                        var f = e[0].parentNode;
                        f && f.tagName && (F || (E = d.hiddenClass, F = y(E), E = "mfp-" + E), G = e.after(F).detach().removeClass(E)), 
                        n.updateStatus("ready");
                    } else n.updateStatus("error", d.tNotFound), e = a("<div>");
                    return b.inlineElement = e, e;
                }
                return n.updateStatus("ready"), n._parseMarkup(c, {}, b), c;
            }
        }
    });
    var I = "ajax", J, K = function() {
        J && s.removeClass(J);
    }, L = function() {
        K(), n.req && n.req.abort();
    };
    a.magnificPopup.registerModule(I, {
        options: {
            settings: null,
            cursor: "mfp-ajax-cur",
            tError: '<a href="%url%">The content</a> could not be loaded.'
        },
        proto: {
            initAjax: function() {
                n.types.push(I), J = n.st.ajax.cursor, x(b + "." + I, L), x("BeforeChange." + I, L);
            },
            getAjax: function(b) {
                J && s.addClass(J), n.updateStatus("loading");
                var c = a.extend({
                    url: b.src,
                    success: function(c, d, e) {
                        var f = {
                            data: c,
                            xhr: e
                        };
                        z("ParseAjax", f), n.appendContent(a(f.data), I), b.finished = !0, K(), n._setFocus(), 
                        setTimeout(function() {
                            n.wrap.addClass(k);
                        }, 16), n.updateStatus("ready"), z("AjaxContentAdded");
                    },
                    error: function() {
                        K(), b.finished = b.loadError = !0, n.updateStatus("error", n.st.ajax.tError.replace("%url%", b.src));
                    }
                }, n.st.ajax.settings);
                return n.req = a.ajax(c), "";
            }
        }
    });
    var M, N = function(b) {
        if (b.data && b.data.title !== undefined) return b.data.title;
        var c = n.st.image.titleSrc;
        if (c) {
            if (a.isFunction(c)) return c.call(n, b);
            if (b.el) return b.el.attr(c) || "";
        }
        return "";
    };
    a.magnificPopup.registerModule("image", {
        options: {
            markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
            cursor: "mfp-zoom-out-cur",
            titleSrc: "title",
            verticalFit: !0,
            tError: '<a href="%url%">The image</a> could not be loaded.'
        },
        proto: {
            initImage: function() {
                var a = n.st.image, c = ".image";
                n.types.push("image"), x(g + c, function() {
                    n.currItem.type === "image" && a.cursor && s.addClass(a.cursor);
                }), x(b + c, function() {
                    a.cursor && s.removeClass(a.cursor), r.off("resize" + j);
                }), x("Resize" + c, n.resizeImage), n.isLowIE && x("AfterChange", n.resizeImage);
            },
            resizeImage: function() {
                var a = n.currItem;
                if (!a || !a.img) return;
                if (n.st.image.verticalFit) {
                    var b = 0;
                    n.isLowIE && (b = parseInt(a.img.css("padding-top"), 10) + parseInt(a.img.css("padding-bottom"), 10)), 
                    a.img.css("max-height", n.wH - b);
                }
            },
            _onImageHasSize: function(a) {
                a.img && (a.hasSize = !0, M && clearInterval(M), a.isCheckingImgSize = !1, z("ImageHasSize", a), 
                a.imgHidden && (n.content && n.content.removeClass("mfp-loading"), a.imgHidden = !1));
            },
            findImageSize: function(a) {
                var b = 0, c = a.img[0], d = function(e) {
                    M && clearInterval(M), M = setInterval(function() {
                        if (c.naturalWidth > 0) {
                            n._onImageHasSize(a);
                            return;
                        }
                        b > 200 && clearInterval(M), b++, b === 3 ? d(10) : b === 40 ? d(50) : b === 100 && d(500);
                    }, e);
                };
                d(1);
            },
            getImage: function(b, c) {
                var d = 0, e = function() {
                    b && (b.img[0].complete ? (b.img.off(".mfploader"), b === n.currItem && (n._onImageHasSize(b), 
                    n.updateStatus("ready")), b.hasSize = !0, b.loaded = !0, z("ImageLoadComplete")) : (d++, 
                    d < 200 ? setTimeout(e, 100) : f()));
                }, f = function() {
                    b && (b.img.off(".mfploader"), b === n.currItem && (n._onImageHasSize(b), n.updateStatus("error", g.tError.replace("%url%", b.src))), 
                    b.hasSize = !0, b.loaded = !0, b.loadError = !0);
                }, g = n.st.image, h = c.find(".mfp-img");
                if (h.length) {
                    var i = document.createElement("img");
                    i.className = "mfp-img", b.img = a(i).on("load.mfploader", e).on("error.mfploader", f), 
                    i.src = b.src, h.is("img") && (b.img = b.img.clone()), i = b.img[0], i.naturalWidth > 0 ? b.hasSize = !0 : i.width || (b.hasSize = !1);
                }
                return n._parseMarkup(c, {
                    title: N(b),
                    img_replaceWith: b.img
                }, b), n.resizeImage(), b.hasSize ? (M && clearInterval(M), b.loadError ? (c.addClass("mfp-loading"), 
                n.updateStatus("error", g.tError.replace("%url%", b.src))) : (c.removeClass("mfp-loading"), 
                n.updateStatus("ready")), c) : (n.updateStatus("loading"), b.loading = !0, b.hasSize || (b.imgHidden = !0, 
                c.addClass("mfp-loading"), n.findImageSize(b)), c);
            }
        }
    });
    var O, P = function() {
        return O === undefined && (O = document.createElement("p").style.MozTransform !== undefined), 
        O;
    };
    a.magnificPopup.registerModule("zoom", {
        options: {
            enabled: !1,
            easing: "ease-in-out",
            duration: 300,
            opener: function(a) {
                return a.is("img") ? a : a.find("img");
            }
        },
        proto: {
            initZoom: function() {
                var a = n.st.zoom, d = ".zoom", e;
                if (!a.enabled || !n.supportsTransition) return;
                var f = a.duration, g = function(b) {
                    var c = b.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"), d = "all " + a.duration / 1e3 + "s " + a.easing, e = {
                        position: "fixed",
                        zIndex: 9999,
                        left: 0,
                        top: 0,
                        "-webkit-backface-visibility": "hidden"
                    }, f = "transition";
                    return e["-webkit-" + f] = e["-moz-" + f] = e["-o-" + f] = e[f] = d, c.css(e), c;
                }, h = function() {
                    n.content.css("visibility", "visible");
                }, i, j;
                x("BuildControls" + d, function() {
                    if (n._allowZoom()) {
                        clearTimeout(i), n.content.css("visibility", "hidden"), e = n._getItemToZoom();
                        if (!e) {
                            h();
                            return;
                        }
                        j = g(e), j.css(n._getOffset()), n.wrap.append(j), i = setTimeout(function() {
                            j.css(n._getOffset(!0)), i = setTimeout(function() {
                                h(), setTimeout(function() {
                                    j.remove(), e = j = null, z("ZoomAnimationEnded");
                                }, 16);
                            }, f);
                        }, 16);
                    }
                }), x(c + d, function() {
                    if (n._allowZoom()) {
                        clearTimeout(i), n.st.removalDelay = f;
                        if (!e) {
                            e = n._getItemToZoom();
                            if (!e) return;
                            j = g(e);
                        }
                        j.css(n._getOffset(!0)), n.wrap.append(j), n.content.css("visibility", "hidden"), 
                        setTimeout(function() {
                            j.css(n._getOffset());
                        }, 16);
                    }
                }), x(b + d, function() {
                    n._allowZoom() && (h(), j && j.remove(), e = null);
                });
            },
            _allowZoom: function() {
                return n.currItem.type === "image";
            },
            _getItemToZoom: function() {
                return n.currItem.hasSize ? n.currItem.img : !1;
            },
            _getOffset: function(b) {
                var c;
                b ? c = n.currItem.img : c = n.st.zoom.opener(n.currItem.el || n.currItem);
                var d = c.offset(), e = parseInt(c.css("padding-top"), 10), f = parseInt(c.css("padding-bottom"), 10);
                d.top -= a(window).scrollTop() - e;
                var g = {
                    width: c.width(),
                    height: (p ? c.innerHeight() : c[0].offsetHeight) - f - e
                };
                return P() ? g["-moz-transform"] = g.transform = "translate(" + d.left + "px," + d.top + "px)" : (g.left = d.left, 
                g.top = d.top), g;
            }
        }
    });
    var Q = "iframe", R = "//about:blank", S = function(a) {
        if (n.currTemplate[Q]) {
            var b = n.currTemplate[Q].find("iframe");
            b.length && (a || (b[0].src = R), n.isIE8 && b.css("display", a ? "block" : "none"));
        }
    };
    a.magnificPopup.registerModule(Q, {
        options: {
            markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
            srcAction: "iframe_src",
            patterns: {
                youtube: {
                    index: "youtube.com",
                    id: "v=",
                    src: "//www.youtube.com/embed/%id%?autoplay=1"
                },
                vimeo: {
                    index: "vimeo.com/",
                    id: "/",
                    src: "//player.vimeo.com/video/%id%?autoplay=1"
                },
                gmaps: {
                    index: "//maps.google.",
                    src: "%id%&output=embed"
                }
            }
        },
        proto: {
            initIframe: function() {
                n.types.push(Q), x("BeforeChange", function(a, b, c) {
                    b !== c && (b === Q ? S() : c === Q && S(!0));
                }), x(b + "." + Q, function() {
                    S();
                });
            },
            getIframe: function(b, c) {
                var d = b.src, e = n.st.iframe;
                a.each(e.patterns, function() {
                    if (d.indexOf(this.index) > -1) return this.id && (typeof this.id == "string" ? d = d.substr(d.lastIndexOf(this.id) + this.id.length, d.length) : d = this.id.call(this, d)), 
                    d = this.src.replace("%id%", d), !1;
                });
                var f = {};
                return e.srcAction && (f[e.srcAction] = d), n._parseMarkup(c, f, b), n.updateStatus("ready"), 
                c;
            }
        }
    });
    var T = function(a) {
        var b = n.items.length;
        return a > b - 1 ? a - b : a < 0 ? b + a : a;
    }, U = function(a, b, c) {
        return a.replace(/%curr%/gi, b + 1).replace(/%total%/gi, c);
    };
    a.magnificPopup.registerModule("gallery", {
        options: {
            enabled: !1,
            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
            preload: [ 0, 2 ],
            navigateByImgClick: !0,
            arrows: !0,
            tPrev: "Previous (Left arrow key)",
            tNext: "Next (Right arrow key)",
            tCounter: "%curr% of %total%"
        },
        proto: {
            initGallery: function() {
                var c = n.st.gallery, d = ".mfp-gallery", e = Boolean(a.fn.mfpFastClick);
                n.direction = !0;
                if (!c || !c.enabled) return !1;
                v += " mfp-gallery", x(g + d, function() {
                    c.navigateByImgClick && n.wrap.on("click" + d, ".mfp-img", function() {
                        if (n.items.length > 1) return n.next(), !1;
                    }), t.on("keydown" + d, function(a) {
                        a.keyCode === 37 ? n.prev() : a.keyCode === 39 && n.next();
                    });
                }), x("UpdateStatus" + d, function(a, b) {
                    b.text && (b.text = U(b.text, n.currItem.index, n.items.length));
                }), x(f + d, function(a, b, d, e) {
                    var f = n.items.length;
                    d.counter = f > 1 ? U(c.tCounter, e.index, f) : "";
                }), x("BuildControls" + d, function() {
                    if (n.items.length > 1 && c.arrows && !n.arrowLeft) {
                        var b = c.arrowMarkup, d = n.arrowLeft = a(b.replace(/%title%/gi, c.tPrev).replace(/%dir%/gi, "left")).addClass(m), f = n.arrowRight = a(b.replace(/%title%/gi, c.tNext).replace(/%dir%/gi, "right")).addClass(m), g = e ? "mfpFastClick" : "click";
                        d[g](function() {
                            n.prev();
                        }), f[g](function() {
                            n.next();
                        }), n.isIE7 && (y("b", d[0], !1, !0), y("a", d[0], !1, !0), y("b", f[0], !1, !0), 
                        y("a", f[0], !1, !0)), n.container.append(d.add(f));
                    }
                }), x(h + d, function() {
                    n._preloadTimeout && clearTimeout(n._preloadTimeout), n._preloadTimeout = setTimeout(function() {
                        n.preloadNearbyImages(), n._preloadTimeout = null;
                    }, 16);
                }), x(b + d, function() {
                    t.off(d), n.wrap.off("click" + d), n.arrowLeft && e && n.arrowLeft.add(n.arrowRight).destroyMfpFastClick(), 
                    n.arrowRight = n.arrowLeft = null;
                });
            },
            next: function() {
                n.direction = !0, n.index = T(n.index + 1), n.updateItemHTML();
            },
            prev: function() {
                n.direction = !1, n.index = T(n.index - 1), n.updateItemHTML();
            },
            goTo: function(a) {
                n.direction = a >= n.index, n.index = a, n.updateItemHTML();
            },
            preloadNearbyImages: function() {
                var a = n.st.gallery.preload, b = Math.min(a[0], n.items.length), c = Math.min(a[1], n.items.length), d;
                for (d = 1; d <= (n.direction ? c : b); d++) n._preloadItem(n.index + d);
                for (d = 1; d <= (n.direction ? b : c); d++) n._preloadItem(n.index - d);
            },
            _preloadItem: function(b) {
                b = T(b);
                if (n.items[b].preloaded) return;
                var c = n.items[b];
                c.parsed || (c = n.parseEl(b)), z("LazyLoad", c), c.type === "image" && (c.img = a('<img class="mfp-img" />').on("load.mfploader", function() {
                    c.hasSize = !0;
                }).on("error.mfploader", function() {
                    c.hasSize = !0, c.loadError = !0, z("LazyLoadError", c);
                }).attr("src", c.src)), c.preloaded = !0;
            }
        }
    }), function() {
        var b = 1e3, c = "ontouchstart" in window, d = function() {
            r.off("touchmove" + f + " touchend" + f);
        }, e = "mfpFastClick", f = "." + e;
        a.fn.mfpFastClick = function(e) {
            return a(this).each(function() {
                var g = a(this), h;
                if (c) {
                    var i, j, k, l, m, n;
                    g.on("touchstart" + f, function(a) {
                        l = !1, n = 1, m = a.originalEvent ? a.originalEvent.touches[0] : a.touches[0], 
                        j = m.clientX, k = m.clientY, r.on("touchmove" + f, function(a) {
                            m = a.originalEvent ? a.originalEvent.touches : a.touches, n = m.length, m = m[0];
                            if (Math.abs(m.clientX - j) > 10 || Math.abs(m.clientY - k) > 10) l = !0, d();
                        }).on("touchend" + f, function(a) {
                            d();
                            if (l || n > 1) return;
                            h = !0, a.preventDefault(), clearTimeout(i), i = setTimeout(function() {
                                h = !1;
                            }, b), e();
                        });
                    });
                }
                g.on("click" + f, function() {
                    h || e();
                });
            });
        }, a.fn.destroyMfpFastClick = function() {
            a(this).off("touchstart" + f + " click" + f), c && r.off("touchmove" + f + " touchend" + f);
        };
    }(), B();
})(window.jQuery || window.Zepto);

eval(function(p, a, c, k, e, r) {
    e = function(c) {
        return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
    };
    if (!"".replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [ function(e) {
            return r[e];
        } ];
        e = function() {
            return "\\w+";
        };
        c = 1;
    }
    while (c--) if (k[c]) p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
    return p;
}("(u($){8($.X.1C){C}$.X.7u=$.X.1C=u(2n,3d){8(1q.Q==0){1b(E,'7v 65 7w 1o \"'+1q.5c+'\".');C 1q}8(1q.Q>1){C 1q.2c(u(){$(1q).1C(2n,3d)})}A $z=1q,$12=1q[0],66=G;8($z.1w('68')){66=$z.22('3Y','5d');$z.R('3Y',['5e',E])}A 1P={};1P.69=u(o,7x,2V){o=4B($12,o);o.y=7y($12,o.y);o.1X=7z($12,o.1X);o.I=7A($12,o.I);o.14=6a($12,o.14);o.17=6a($12,o.17);o.1d=7B($12,o.1d);o.1x=7C($12,o.1x);o.23=7D($12,o.23);8(7x){3D=$.1Y(E,{},$.X.1C.6b,o)}7=$.1Y(E,{},$.X.1C.6b,o);7.d=7E(7);16.2F=(7.2F=='6c'||7.2F=='1r')?'17':'14';A P=$z.13(),2G=6d($1s,7,'K');8(3Z(7.2o)){7.2o='99'+B.4C}7.4D=6e(7,2G);7.y=7F(7.y,7,P,2V);7[7.d['K']]=7G(7[7.d['K']],7,P);7[7.d['1g']]=7H(7[7.d['1g']],7,P);8(7.3e){8(!4E(7[7.d['K']])){7[7.d['K']]='3f%'}}8(4E(7[7.d['K']])){16.7I=E;16.5f=7[7.d['K']];7[7.d['K']]=5g(2G,16.5f);8(!7.y.H){7.y.S.1f=E}}8(7.3e){7.25=G;7.1l=[0,0,0,0];7.1J=G;7.y.S.1f=G}J{8(!7.y.H){7=7J(7,2G)}8(!7[7.d['K']]){8(!7.y.S.1f&&Y(7.y[7.d['K']])&&7.y.1z=='*'){7[7.d['K']]=7.y.H*7.y[7.d['K']];7.1J=G}J{7[7.d['K']]='1f'}}8(1H(7.1J)){7.1J=(Y(7[7.d['K']]))?'6f':G}8(7.y.S.1f){7.y.H=3E(P,7,0)}}8(7.y.1z!='*'&&!7.y.S.1f){7.y.S.1t=7.y.H;7.y.H=4F(P,7,0)}7.y.H=2W(7.y.H,7,7.y.S.2x,$12);7.y.S.2h=7.y.H;8(7.3e){8(!7.y.S.3F){7.y.S.3F=7.y.H}8(!7.y.S.2d){7.y.S.2d=7.y.H}7=6g(7,P,2G)}J{7.1l=7K(7.1l);8(7.1J=='41'){7.1J='1r'}J 8(7.1J=='6h'){7.1J='3G'}1Q(7.1J){O'6f':O'1r':O'3G':8(7[7.d['K']]!='1f'){7=6i(7,P);7.25=E}19;3g:7.1J=G;7.25=(7.1l[0]==0&&7.1l[1]==0&&7.1l[2]==0&&7.1l[3]==0)?G:E;19}}8(!Y(7.1X.1Z)){7.1X.1Z=7L}8(1H(7.1X.y)){7.1X.y=(7.3e||7.y.S.1f||7.y.1z!='*')?'H':7.y.H}7.I=$.1Y(E,{},7.1X,7.I);7.14=$.1Y(E,{},7.1X,7.14);7.17=$.1Y(E,{},7.1X,7.17);7.1d=$.1Y(E,{},7.1X,7.1d);7.I=7M($12,7.I);7.14=6j($12,7.14);7.17=6j($12,7.17);7.1d=7N($12,7.1d);7.1x=7O($12,7.1x);7.23=7P($12,7.23);8(7.2H){7.2H=6k(7.2H)}8(7.I.6l){7.I.5h=7.I.6l;4G('I.6l','I.5h')}8(7.I.6m){7.I.5i=7.I.6m;4G('I.6m','I.5i')}8(7.I.6n){7.I.5j=7.I.6n;4G('I.6n','I.5j')}8(7.I.6o){7.I.3h=7.I.6o;4G('I.6o','I.3h')}};1P.7Q=u(){$z.1w('68',E);A P=$z.13(),4H=7R($z,['7S','7T','42','41','3G','6h','1r','4I','K','1g','7U','26','6p','7V']),6q='9a';1Q(4H.42){O'7W':O'9b':6q=4H.42;19}8(B.1R=='3H'){4J($1s)}J{$1s.U(4H)}$1s.U({'9c':'43','42':6q});4J($z);$z.1w('7X',4H.4I);$z.U({'7S':'1r','7T':'4K','42':'7W','41':0,'3G':'I','6h':'I','1r':0,'7U':0,'26':0,'6p':0,'7V':0});5k(P,7);4J(P);8(7.3e){6r(7,P)}};1P.7Y=u(){1P.6s();$z.Z(D('7Z',B),u(e,5l){e.1j();8(!16.2y){8(7.I.V){7.I.V.3I(2X('5m',B))}}16.2y=E;8(7.I.1S){7.I.1S=G;$z.R(D('3J',B),5l)}C E});$z.Z(D('2Y',B),u(e){e.1j();8(16.2p){4L(T)}C E});$z.Z(D('3J',B),u(e,5l,3i){e.1j();1A=44(1A);8(5l&&16.2p){T.2y=E;A 5n=2I()-T.3j;T.1Z-=5n;8(T.5o){T.5o.1Z-=5n}8(T.5p){T.5p.1Z-=5n}4L(T,G)}8(!16.2q&&!16.2p){8(3i){1A.45+=2I()-1A.3j}}8(!16.2q){8(7.I.V){7.I.V.3I(2X('80',B))}}16.2q=E;8(7.I.5i){A 3K=7.I.3h-1A.45,2Z=3f-1T.30(3K*3f/7.I.3h);7.I.5i.1k($12,2Z,3K)}C E});$z.Z(D('1S',B),u(e,1n,46,3i){e.1j();1A=44(1A);A v=[1n,46,3i],t=['3k','2r','3L'],a=3M(v,t);1n=a[0];46=a[1];3i=a[2];8(1n!='14'&&1n!='17'){1n=16.2F}8(!Y(46)){46=0}8(!1p(3i)){3i=G}8(3i){16.2y=G;7.I.1S=E}8(!7.I.1S){e.2z();C 1b(B,'47 5m: 2J 3N.')}8(16.2q){8(7.I.V){7.I.V.3l(2X('5m',B));7.I.V.3l(2X('80',B))}}16.2q=G;1A.3j=2I();A 3K=7.I.3h+46;4M=3K-1A.45;2Z=3f-1T.30(4M*3f/3K);8(7.I.1h){1A.1h=9d(u(){A 81=2I()-1A.3j+1A.45,2Z=1T.30(81*3f/3K);7.I.1h.5q.1k(7.I.1h.2K[0],2Z)},7.I.1h.6t)}1A.I=9e(u(){8(7.I.1h){7.I.1h.5q.1k(7.I.1h.2K[0],3f)}8(7.I.5j){7.I.5j.1k($12,2Z,4M)}8(16.2p){$z.R(D('1S',B),1n)}J{$z.R(D(1n,B),7.I)}},4M);8(7.I.5h){7.I.5h.1k($12,2Z,4M)}C E});$z.Z(D('3O',B),u(e){e.1j();8(T.2y){T.2y=G;16.2q=G;16.2p=E;T.3j=2I();48(T,B)}J{$z.R(D('1S',B))}C E});$z.Z(D('14',B)+' '+D('17',B),u(e,g,L,1K,4N){e.1j();8(16.2y||$z.2A(':43')){e.2z();C 1b(B,'47 5m 9f 43: 2J 3N.')}A 2L=(Y(7.y.2L))?7.y.2L:7.y.H+1;8(2L>F.M){e.2z();C 1b(B,'2J 82 y ('+F.M+' M, '+2L+' 83): 2J 3N.')}A v=[g,L,1K,4N],t=['31','2r/3k','u','3L'],a=3M(v,t);g=a[0];L=a[1];1K=a[2];4N=a[3];A 27=e.6u.1a(B.4a.4O.Q);8(!28(g)){g={}}8(1u(1K)){g.3P=1K}8(1p(4N)){g.3m=4N}g=$.1Y(E,{},7[27],g);8(g.6v&&!g.6v.1k($12,27)){e.2z();C 1b(B,'9g \"6v\" 9h G.')}8(!Y(L)){8(7.y.1z!='*'){L='H'}J{A 2M=[L,g.y,7[27].y];1o(A a=0,l=2M.Q;a<l;a++){8(Y(2M[a])||2M[a]=='84'||2M[a]=='H'){L=2M[a];19}}}1Q(L){O'84':e.2z();C $z.22(D(27+'9i',B),[g,1K]);19;O'H':8(!7.y.S.1f&&7.y.1z=='*'){L=7.y.H}19}}8(T.2y){$z.R(D('3O',B));$z.R(D('3m',B),[27,[g,L,1K]]);e.2z();C 1b(B,'47 9j 3N.')}8(g.1Z>0){8(16.2p){8(g.3m){8(g.3m=='3n'){2B=[]}8(g.3m!='W'||2B.Q==0){$z.R(D('3m',B),[27,[g,L,1K]])}}e.2z();C 1b(B,'47 9k 3N.')}}1A.45=0;$z.R(D('85'+27,B),[g,L]);8(7.2H){A s=7.2H,c=[g,L];1o(A j=0,l=s.Q;j<l;j++){A d=27;8(!s[j][2]){d=(d=='14')?'17':'14'}8(!s[j][1]){c[0]=s[j][0].22('3Y',['86',d])}c[1]=L+s[j][3];s[j][0].R('3Y',['85'+d,c])}}C E});$z.Z(D('9l',B),u(e,18,N){e.1j();A P=$z.13();8(!7.29){8(F.W==0){8(7.4b){$z.R(D('17',B),F.M-1)}C e.2z()}}2e(P,7);8(!Y(N)){8(7.y.S.1f){N=5r(P,7,F.M-1)}J 8(7.y.1z!='*'){A 3Q=(Y(18.y))?18.y:6w($z,7);N=87(P,7,F.M-1,3Q)}J{N=7.y.H}N=5s(N,7,18.y,$12)}8(!7.29){8(F.M-N<F.W){N=F.M-F.W}}7.y.S.2h=7.y.H;8(7.y.S.1f){A 1B=2W(3E(P,7,F.M-N),7,7.y.S.2x,$12);8(7.y.H+N<=1B&&N<F.M){N++;1B=2W(3E(P,7,F.M-N),7,7.y.S.2x,$12)}7.y.H=1B}J 8(7.y.1z!='*'){A 1B=4F(P,7,F.M-N);7.y.H=2W(1B,7,7.y.S.2x,$12)}2e(P,7,E);8(N==0){e.2z();C 1b(B,'0 y 4P 1X: 2J 3N.')}1b(B,'88 '+N+' y 6x.');F.W+=N;2C(F.W>=F.M){F.W-=F.M}8(!7.29){8(F.W==0&&18.5t){18.5t.1k($12,'14')}8(!7.4b){4c(7,F.W,B)}}$z.13().1a(F.M-N,F.M).9m($z);8(F.M<7.y.H+N){$z.13().1a(0,(7.y.H+N)-F.M).5u(E).4Q($z)}A P=$z.13(),32=89(P,7,N),2i=8a(P,7),1U=P.20(N-1),2j=32.3n(),2N=2i.3n();2e(P,7);A 2s=0,34=0;8(7.1J){A p=5v(2i,7);2s=p[0];34=p[1]}A 6y=(2s<0)?7.1l[7.d[3]]:0;A 2a=G,2O=$();8(7.y.H<N){2O=P.1a(7.y.S.2h,N);8(18.1D=='8b'){A 5w=7.y[7.d['K']];2a=2O;1U=2N;6z(2a);7.y[7.d['K']]='1f'}}A $1y=G,4d=3o(P.1a(0,N),7,'K'),2f=5x(5y(2i,7,E),7,!7.25),4e=0,2t={},5z={},2P={},3p={},5A={},3q={},6A={},3r=6B(18,7,N,4d);1Q(18.1D){O'1V':O'1V-1E':4e=3o(P.1a(0,7.y.H),7,'K');19}8(2a){7.y[7.d['K']]=5w}2e(P,7,E);8(34>=0){2e(2j,7,7.1l[7.d[1]])}8(2s>=0){2e(1U,7,7.1l[7.d[3]])}8(7.1J){7.1l[7.d[1]]=34;7.1l[7.d[3]]=2s}3q[7.d['1r']]=-(4d-6y);6A[7.d['1r']]=-(4e-6y);5z[7.d['1r']]=2f[7.d['K']];A 3s=u(){},21=u(){},1L=u(){},4f=u(){},35=u(){},6C=u(){},1M=u(){},4g=u(){},1F=u(){},1G=u(){},1W=u(){};1Q(18.1D){O'3R':O'1V':O'1V-1E':O'2k':O'2k-1E':$1y=$z.5u(E).4Q($1s);19}1Q(18.1D){O'3R':O'2k':O'2k-1E':$1y.13().1a(0,N).2Q();$1y.13().1a(7.y.S.2h).2Q();19;O'1V':O'1V-1E':$1y.13().1a(7.y.H).2Q();$1y.U(6A);19}$z.U(3q);T=4R(3r,18.2R,B);2t[7.d['1r']]=(7.25)?7.1l[7.d[3]]:0;8(7[7.d['K']]=='1f'||7[7.d['1g']]=='1f'){3s=u(){$1s.U(2f)};21=u(){T.1c.1e([$1s,2f])}}8(7.25){8(2N.5B(1U).Q){2P[7.d['26']]=1U.1w('2u');8(2s<0){1U.U(2P)}J{1M=u(){1U.U(2P)};4g=u(){T.1c.1e([1U,2P])}}}1Q(18.1D){O'1V':O'1V-1E':$1y.13().20(N-1).U(2P);19}8(2N.5B(2j).Q){3p[7.d['26']]=2j.1w('2u');1L=u(){2j.U(3p)};4f=u(){T.1c.1e([2j,3p])}}8(34>=0){5A[7.d['26']]=2N.1w('2u')+7.1l[7.d[1]];35=u(){2N.U(5A)};6C=u(){T.1c.1e([2N,5A])}}}1W=u(){$z.U(2t)};A 3S=7.y.H+N-F.M;1G=u(){8(3S>0){$z.13().1a(F.M).2Q();32=$($z.13().1a(F.M-(7.y.H-3S)).4h().8c($z.13().1a(0,3S).4h()))}6D(2a);8(7.25){A 4i=$z.13().20(7.y.H+N-1);4i.U(7.d['26'],4i.1w('2u'))}};A 4j=6E(32,2O,2i,N,'14',3r,2f);1F=u(){6F($z,$1y,18);16.2p=G;2v.3P=4S($12,18,'3P',4j,2v);2B=6G($z,2B,B);8(!16.2q){$z.R(D('1S',B))}};16.2p=E;1A=44(1A);2v.4k=4S($12,18,'4k',4j,2v);1Q(18.1D){O'4K':$z.U(2t);3s();1L();35();1M();1W();1G();1F();19;O'1E':T.1c.1e([$z,{'1N':0},u(){3s();1L();35();1M();1W();1G();T=4R(3r,18.2R,B);T.1c.1e([$z,{'1N':1},1F]);48(T,B)}]);19;O'3R':$z.U({'1N':0});T.1c.1e([$1y,{'1N':0}]);T.1c.1e([$z,{'1N':1},1F]);21();1L();35();1M();1W();1G();19;O'1V':T.1c.1e([$1y,2t,u(){1L();35();1M();1W();1G();1F()}]);21();19;O'1V-1E':T.1c.1e([$z,{'1N':0}]);T.1c.1e([$1y,2t,u(){$z.U({'1N':1});1L();35();1M();1W();1G();1F()}]);21();19;O'2k':T.1c.1e([$1y,5z,1F]);21();1L();35();1M();1W();1G();19;O'2k-1E':$z.U({'1N':0});T.1c.1e([$z,{'1N':1}]);T.1c.1e([$1y,5z,1F]);21();1L();35();1M();1W();1G();19;3g:T.1c.1e([$z,2t,u(){1G();1F()}]);21();4f();6C();4g();19}48(T,B);6H(7.2o,$z,B);$z.R(D('4l',B),[G,2f]);C E});$z.Z(D('9n',B),u(e,18,N){e.1j();A P=$z.13();8(!7.29){8(F.W==7.y.H){8(7.4b){$z.R(D('14',B),F.M-1)}C e.2z()}}2e(P,7);8(!Y(N)){8(7.y.1z!='*'){A 3Q=(Y(18.y))?18.y:6w($z,7);N=8d(P,7,0,3Q)}J{N=7.y.H}N=5s(N,7,18.y,$12)}A 4m=(F.W==0)?F.M:F.W;8(!7.29){8(7.y.S.1f){A 1B=3E(P,7,N),3Q=5r(P,7,4m-1)}J{A 1B=7.y.H,3Q=7.y.H}8(N+1B>4m){N=4m-3Q}}7.y.S.2h=7.y.H;8(7.y.S.1f){A 1B=2W(6I(P,7,N,4m),7,7.y.S.2x,$12);2C(7.y.H-N>=1B&&N<F.M){N++;1B=2W(6I(P,7,N,4m),7,7.y.S.2x,$12)}7.y.H=1B}J 8(7.y.1z!='*'){A 1B=4F(P,7,N);7.y.H=2W(1B,7,7.y.S.2x,$12)}2e(P,7,E);8(N==0){e.2z();C 1b(B,'0 y 4P 1X: 2J 3N.')}1b(B,'88 '+N+' y 8e.');F.W-=N;2C(F.W<0){F.W+=F.M}8(!7.29){8(F.W==7.y.H&&18.5t){18.5t.1k($12,'17')}8(!7.4b){4c(7,F.W,B)}}8(F.M<7.y.H+N){$z.13().1a(0,(7.y.H+N)-F.M).5u(E).4Q($z)}A P=$z.13(),32=8f(P,7),2i=8g(P,7,N),1U=P.20(N-1),2j=32.3n(),2N=2i.3n();2e(P,7);A 2s=0,34=0;8(7.1J){A p=5v(2i,7);2s=p[0];34=p[1]}A 2a=G,2O=$();8(7.y.S.2h<N){2O=P.1a(7.y.S.2h,N);8(18.1D=='8b'){A 5w=7.y[7.d['K']];2a=2O;1U=2j;6z(2a);7.y[7.d['K']]='1f'}}A $1y=G,4d=3o(P.1a(0,N),7,'K'),2f=5x(5y(2i,7,E),7,!7.25),4e=0,2t={},5C={},2P={},3p={},3q={},3r=6B(18,7,N,4d);1Q(18.1D){O'2k':O'2k-1E':4e=3o(P.1a(0,7.y.S.2h),7,'K');19}8(2a){7.y[7.d['K']]=5w}8(7.1J){8(7.1l[7.d[1]]<0){7.1l[7.d[1]]=0}}2e(P,7,E);2e(2j,7,7.1l[7.d[1]]);8(7.1J){7.1l[7.d[1]]=34;7.1l[7.d[3]]=2s}3q[7.d['1r']]=(7.25)?7.1l[7.d[3]]:0;A 3s=u(){},21=u(){},1L=u(){},4f=u(){},1M=u(){},4g=u(){},1F=u(){},1G=u(){},1W=u(){};1Q(18.1D){O'3R':O'1V':O'1V-1E':O'2k':O'2k-1E':$1y=$z.5u(E).4Q($1s);$1y.13().1a(7.y.S.2h).2Q();19}1Q(18.1D){O'3R':O'1V':O'1V-1E':$z.U('4I',1);$1y.U('4I',0);19}T=4R(3r,18.2R,B);2t[7.d['1r']]=-4d;5C[7.d['1r']]=-4e;8(2s<0){2t[7.d['1r']]+=2s}8(7[7.d['K']]=='1f'||7[7.d['1g']]=='1f'){3s=u(){$1s.U(2f)};21=u(){T.1c.1e([$1s,2f])}}8(7.25){A 6J=2N.1w('2u');8(34>=0){6J+=7.1l[7.d[1]]}2N.U(7.d['26'],6J);8(1U.5B(2j).Q){3p[7.d['26']]=2j.1w('2u')}1L=u(){2j.U(3p)};4f=u(){T.1c.1e([2j,3p])};A 6K=1U.1w('2u');8(2s>0){6K+=7.1l[7.d[3]]}2P[7.d['26']]=6K;1M=u(){1U.U(2P)};4g=u(){T.1c.1e([1U,2P])}}1W=u(){$z.U(3q)};A 3S=7.y.H+N-F.M;1G=u(){8(3S>0){$z.13().1a(F.M).2Q()}A 4i=$z.13().1a(0,N).4Q($z).3n();8(3S>0){2i=4n(P,7)}6D(2a);8(7.25){8(F.M<7.y.H+N){A 1U=$z.13().20(7.y.H-1);1U.U(7.d['26'],1U.1w('2u')+7.1l[7.d[1]])}4i.U(7.d['26'],4i.1w('2u'))}};A 4j=6E(32,2O,2i,N,'17',3r,2f);1F=u(){$z.U('4I',$z.1w('7X'));6F($z,$1y,18);16.2p=G;2v.3P=4S($12,18,'3P',4j,2v);2B=6G($z,2B,B);8(!16.2q){$z.R(D('1S',B))}};16.2p=E;1A=44(1A);2v.4k=4S($12,18,'4k',4j,2v);1Q(18.1D){O'4K':$z.U(2t);3s();1L();1M();1W();1G();1F();19;O'1E':T.1c.1e([$z,{'1N':0},u(){3s();1L();1M();1W();1G();T=4R(3r,18.2R,B);T.1c.1e([$z,{'1N':1},1F]);48(T,B)}]);19;O'3R':$z.U({'1N':0});T.1c.1e([$1y,{'1N':0}]);T.1c.1e([$z,{'1N':1},1F]);21();1L();1M();1W();1G();19;O'1V':$z.U(7.d['1r'],$1s[7.d['K']]());T.1c.1e([$z,3q,1F]);21();1L();1M();1G();19;O'1V-1E':$z.U(7.d['1r'],$1s[7.d['K']]());T.1c.1e([$1y,{'1N':0}]);T.1c.1e([$z,3q,1F]);21();1L();1M();1G();19;O'2k':T.1c.1e([$1y,5C,1F]);21();1L();1M();1W();1G();19;O'2k-1E':$z.U({'1N':0});T.1c.1e([$z,{'1N':1}]);T.1c.1e([$1y,5C,1F]);21();1L();1M();1W();1G();19;3g:T.1c.1e([$z,2t,u(){1W();1G();1F()}]);21();4f();4g();19}48(T,B);6H(7.2o,$z,B);$z.R(D('4l',B),[G,2f]);C E});$z.Z(D('3T',B),u(e,L,2b,1t,g,1n,1K){e.1j();A v=[L,2b,1t,g,1n,1K],t=['3k/2r/31','2r','3L','31','3k','u'],a=3M(v,t);g=a[3];1n=a[4];1K=a[5];L=4o(a[0],a[1],a[2],F,$z);8(L==0){C G}8(!28(g)){g=G}8(1n!='14'&&1n!='17'){8(7.29){1n=(L<=F.M/2)?'17':'14'}J{1n=(F.W==0||F.W>L)?'17':'14'}}8(1n=='14'){L=F.M-L}$z.R(D(1n,B),[g,L,1K]);C E});$z.Z(D('9o',B),u(e,g,1K){e.1j();A 5D=$z.22(D('4T',B));C $z.22(D('6L',B),[5D-1,g,'14',1K])});$z.Z(D('9p',B),u(e,g,1K){e.1j();A 5D=$z.22(D('4T',B));C $z.22(D('6L',B),[5D+1,g,'17',1K])});$z.Z(D('6L',B),u(e,3t,g,1n,1K){e.1j();8(!Y(3t)){3t=$z.22(D('4T',B))}A 2w=7.1d.y||7.y.H,2d=1T.30(F.M/2w)-1;8(3t<0){3t=2d}8(3t>2d){3t=0}C $z.22(D('3T',B),[3t*2w,0,E,g,1n,1K])});$z.Z(D('8h',B),u(e,s){e.1j();8(s){s=4o(s,0,E,F,$z)}J{s=0}s+=F.W;8(s!=0){8(F.M>0){2C(s>F.M){s-=F.M}}$z.9q($z.13().1a(s,F.M))}C E});$z.Z(D('2H',B),u(e,s){e.1j();8(s){s=6k(s)}J 8(7.2H){s=7.2H}J{C 1b(B,'7v 9r 4P 2H.')}A n=$z.22(D('5d',B)),x=E;1o(A j=0,l=s.Q;j<l;j++){8(!s[j][0].22(D('3T',B),[n,s[j][3],E])){x=G}}C x});$z.Z(D('3m',B),u(e,1n,11){e.1j();8(1u(1n)){1n.1k($12,2B)}J 8(3u(1n)){2B=1n}J 8(!1H(1n)){2B.1e([1n,11])}C 2B});$z.Z(D('9s',B),u(e,1i,L,1t,2b){e.1j();A v=[1i,L,1t,2b],t=['3k/31','3k/2r/31','3L','2r'],a=3M(v,t);1i=a[0];L=a[1];1t=a[2];2b=a[3];8(28(1i)&&!2S(1i)){1i=$(1i)}J 8(1v(1i)){1i=$(1i)}8(!2S(1i)||1i.Q==0){C 1b(B,'2J a 6M 31.')}8(1H(L)){L='4U'}5k(1i,7);4J(1i);A 8i=L,4V='4V';8(L=='4U'){8(1t){8(F.W==0){L=F.M-1;4V='8j'}J{L=F.W;F.W+=1i.Q}8(L<0){L=0}}J{L=F.M-1;4V='8j'}}J{L=4o(L,2b,1t,F,$z)}A $6N=$z.13().20(L);8($6N.Q){$6N[4V](1i)}J{1b(B,'9t 9u-42 5B 7w! 9v 9w 4P 9x 4U.');$z.8k(1i)}8(8i!='4U'&&!1t){8(L<F.W){F.W+=1i.Q}}F.M=$z.13().Q;8(F.W>=F.M){F.W-=F.M}$z.R(D('5E',B));$z.R(D('6O',B));C E});$z.Z(D('8l',B),u(e,L,1t,2b){e.1j();A v=[L,1t,2b],t=['3k/2r/31','3L','2r'],a=3M(v,t);L=a[0];1t=a[1];2b=a[2];A 2g=G;8(L 3v $&&L.Q>1){$2g=$();L.2c(u(i,9y){A $6P=$z.R(D('8l',B),[$(1q),1t,2b]);8($6P){$2g=$2g.9z($6P)}});C $2g}8(1H(L)||L=='4U'){$2g=$z.13().3n()}J{L=4o(L,2b,1t,F,$z);A $2g=$z.13().20(L);8($2g.Q){8(L<F.W){F.W-=$2g.Q}}}8($2g&&$2g.Q){$2g.9A();F.M=$z.13().Q;$z.R(D('5E',B))}C $2g});$z.Z(D('4k',B)+' '+D('3P',B),u(e,X){e.1j();A 27=e.6u.1a(B.4a.4O.Q);8(3u(X)){2v[27]=X}8(1u(X)){2v[27].1e(X)}C 2v[27]});$z.Z(D('5d',B),u(e,X){e.1j();8(F.W==0){A 3w=0}J{A 3w=F.M-F.W}8(1u(X)){X.1k($12,3w)}C 3w});$z.Z(D('4T',B),u(e,X){e.1j();A 2w=7.1d.y||7.y.H,2d=1T.30(F.M/2w-1),2l;8(F.W==0){2l=0}J 8(F.W<F.M%2w){2l=0}J 8(F.W==2w&&!7.29){2l=2d}J{2l=1T.8m((F.M-F.W)/2w)}8(2l<0){2l=0}8(2l>2d){2l=2d}8(1u(X)){X.1k($12,2l)}C 2l});$z.Z(D('9B',B),u(e,X){e.1j();A $i=4n($z.13(),7);8(1u(X)){X.1k($12,$i)}C $i});$z.Z(D('1a',B),u(e,f,l,X){e.1j();8(F.M==0){C G}A v=[f,l,X],t=['2r','2r','u'],a=3M(v,t);f=(Y(a[0]))?a[0]:0;l=(Y(a[1]))?a[1]:F.M;X=a[2];f+=F.W;l+=F.W;8(y.M>0){2C(f>F.M){f-=F.M}2C(l>F.M){l-=F.M}2C(f<0){f+=F.M}2C(l<0){l+=F.M}}A $5F=$z.13(),$i;8(l>f){$i=$5F.1a(f,l)}J{$i=$($5F.1a(f,F.M).4h().8c($5F.1a(0,l).4h()))}8(1u(X)){X.1k($12,$i)}C $i});$z.Z(D('2q',B)+' '+D('2y',B)+' '+D('2p',B),u(e,X){e.1j();A 27=e.6u.1a(B.4a.4O.Q),6Q=16[27];8(1u(X)){X.1k($12,6Q)}C 6Q});$z.Z(D('86',B),u(e,a,b,c){e.1j();A 5G=G;8(1u(a)){a.1k($12,7)}J 8(28(a)){3D=$.1Y(E,{},3D,a);8(b!==G)5G=E;J 7=$.1Y(E,{},7,a)}J 8(!1H(a)){8(1u(b)){A 3w=5H('7.'+a);8(1H(3w)){3w=''}b.1k($12,3w)}J 8(!1H(b)){8(3x c!=='3L')c=E;5H('3D.'+a+' = b');8(c!==G)5G=E;J 5H('7.'+a+' = b')}J{C 5H('7.'+a)}}8(5G){2e($z.13(),7);1P.69(3D);1P.6R();A 36=5I($z,7);$z.R(D('4l',B),[E,36])}C 7});$z.Z(D('6O',B),u(e,$3a,5J){e.1j();8(1H($3a)){$3a=$('9C')}J 8(1v($3a)){$3a=$($3a)}8(!2S($3a)||$3a.Q==0){C 1b(B,'2J a 6M 31.')}8(!1v(5J)){5J='a.7u'}$3a.9D(5J).2c(u(){A h=1q.8n||'';8(h.Q>0&&$z.13().8o($(h))!=-1){$(1q).2m('6S').6S(u(e){e.3b();$z.R(D('3T',B),h)})}});C E});$z.Z(D('4l',B),u(e,8p,9E){e.1j();8(!7.1d.1I){C}A 2w=7.1d.y||7.y.H,5K=1T.30(F.M/2w);8(8p){8(7.1d.4p){7.1d.1I.13().2Q();7.1d.1I.2c(u(){1o(A a=0;a<5K;a++){A i=$z.13().20(4o(a*2w,0,E,F,$z));$(1q).8k(7.1d.4p.1k(i[0],a+1))}})}7.1d.1I.2c(u(){$(1q).13().2m(7.1d.4q).2c(u(a){$(1q).Z(7.1d.4q,u(e){e.3b();$z.R(D('3T',B),[a*2w,-7.1d.5L,E,7.1d])})})})}A 3y=$z.22(D('4T',B))+7.1d.5L;8(3y>=5K){3y=0}8(3y<0){3y=5K-1}7.1d.1I.2c(u(){$(1q).13().3l(2X('3y',B)).20(3y).3I(2X('3y',B))});C E});$z.Z(D('5E',B),u(e){A 1B=7.y.H,P=$z.13(),2G=6d($1s,7,'K');F.M=P.Q;8(16.5f){7.4D=2G;7[7.d['K']]=5g(2G,16.5f)}J{7.4D=6e(7,2G)}8(7.3e){7.y.K=7.y.4r.K;7.y.1g=7.y.4r.1g;7=6g(7,P,2G);1B=7.y.H;6r(7,P)}J 8(7.y.S.1f){1B=3E(P,7,0)}J 8(7.y.1z!='*'){1B=4F(P,7,0)}8(!7.29&&F.W!=0&&1B>F.W){8(7.y.S.1f){A N=5r(P,7,F.W)-F.W}J 8(7.y.1z!='*'){A N=8q(P,7,F.W)-F.W}J{A N=7.y.H-F.W}1b(B,'9F 9G-29: 9H '+N+' y 6x.');$z.R(D('14',B),N)}7.y.H=2W(1B,7,7.y.S.2x,$12);7.y.S.2h=7.y.H;7=6i(7,P);A 36=5I($z,7);$z.R(D('4l',B),[E,36]);5M(7,F.M,B);4c(7,F.W,B);C 36});$z.Z(D('5e',B),u(e,8r){e.1j();1A=44(1A);$z.1w('68',G);$z.R(D('2Y',B));8(8r){$z.R(D('8h',B))}5N($z.13());5N($z);1P.6s();1P.6T();8(B.1R=='3H'){5N($1s)}J{$1s.9I($z)}C E});$z.Z(D('1b',B),u(e){1b(B,'47 K: '+7.K);1b(B,'47 1g: '+7.1g);1b(B,'8s 9J: '+7.y.K);1b(B,'8s 9K: '+7.y.1g);1b(B,'4W 4X y H: '+7.y.H);8(7.I.1S){1b(B,'4W 4X y 6U 9L: '+7.I.y)}8(7.14.V){1b(B,'4W 4X y 6U 6x: '+7.14.y)}8(7.17.V){1b(B,'4W 4X y 6U 8e: '+7.17.y)}C B.1b});$z.Z('3Y',u(e,n,o){e.1j();C $z.22(D(n,B),o)})};1P.6s=u(){$z.2m(D('',B));$z.2m(D('',B,G));$z.2m('3Y')};1P.6R=u(){1P.6T();5M(7,F.M,B);4c(7,F.W,B);8(7.I.3c){A 2D=4s(7.I.3c);$1s.Z(D('5O',B,G),u(){$z.R(D('3J',B),2D)}).Z(D('5P',B,G),u(){$z.R(D('3O',B))})}8(7.I.V){7.I.V.Z(D(7.I.4q,B,G),u(e){e.3b();A 4Y=G,2D=4t;8(16.2q){4Y='1S'}J 8(7.I.5Q){4Y='3J';2D=4s(7.I.5Q)}8(4Y){$z.R(D(4Y,B),2D)}})}8(7.14.V){7.14.V.Z(D(7.14.4q,B,G),u(e){e.3b();$z.R(D('14',B))});8(7.14.3c){A 2D=4s(7.14.3c);7.14.V.Z(D('5O',B,G),u(){$z.R(D('3J',B),2D)}).Z(D('5P',B,G),u(){$z.R(D('3O',B))})}}8(7.17.V){7.17.V.Z(D(7.17.4q,B,G),u(e){e.3b();$z.R(D('17',B))});8(7.17.3c){A 2D=4s(7.17.3c);7.17.V.Z(D('5O',B,G),u(){$z.R(D('3J',B),2D)}).Z(D('5P',B,G),u(){$z.R(D('3O',B))})}}8(7.1d.1I){8(7.1d.3c){A 2D=4s(7.1d.3c);7.1d.1I.Z(D('5O',B,G),u(){$z.R(D('3J',B),2D)}).Z(D('5P',B,G),u(){$z.R(D('3O',B))})}}8(7.14.3z||7.17.3z){$(4Z).Z(D('8t',B,G,E,E),u(e){A k=e.8u;8(k==7.17.3z){e.3b();$z.R(D('17',B))}8(k==7.14.3z){e.3b();$z.R(D('14',B))}})}8(7.1d.5R){$(4Z).Z(D('8t',B,G,E,E),u(e){A k=e.8u;8(k>=49&&k<58){k=(k-49)*7.y.H;8(k<=F.M){e.3b();$z.R(D('3T',B),[k,0,E,7.1d])}}})}8($.X.1x){A 6V='9M'9N 3U;8((6V&&7.1x.51)||(!6V&&7.1x.6W)){A 8v=$.1Y(E,{},7.14,7.1x),8w=$.1Y(E,{},7.17,7.1x),6X=u(){$z.R(D('14',B),[8v])},6Y=u(){$z.R(D('17',B),[8w])};1Q(7.2F){O'6c':O'8x':7.1x.2n.9O=6Y;7.1x.2n.9P=6X;19;3g:7.1x.2n.9Q=6Y;7.1x.2n.9R=6X}8(16.1x){$z.1x('5e')}$1s.1x(7.1x.2n);$1s.U('8y','9S');16.1x=E}}8($.X.23){8(7.23){A 8z=$.1Y(E,{},7.14,7.23),8A=$.1Y(E,{},7.17,7.23);8(16.23){$1s.2m(D('23',B,G))}$1s.Z(D('23',B,G),u(e,8B){e.3b();8(8B>0){$z.R(D('14',B),[8z])}J{$z.R(D('17',B),[8A])}});16.23=E}}8(7.I.1S){$z.R(D('1S',B),7.I.6Z)}8(16.7I){A 5S=u(e){$z.R(D('2Y',B));8(7.I.70&&!16.2q){$z.R(D('1S',B))}2e($z.13(),7);$z.R(D('5E',B))};A $w=$(3U),52=4t;8($.71&&B.72=='71'){52=$.71(9T,5S)}J 8($.5T&&B.72=='5T'){52=$.5T(9U,5S)}J{A 73=0,74=0;52=u(){A 4u=$w.K(),75=$w.1g();8(4u!=73||75!=74){5S();73=4u;74=75}}}$w.Z(D('9V',B,G,E,E),52)}};1P.6T=u(){A 9W=D('',B),4v=D('',B,G);76=D('',B,G,E,E);$(4Z).2m(76);$(3U).2m(76);$1s.2m(4v);8(7.I.V){7.I.V.2m(4v)}8(7.14.V){7.14.V.2m(4v)}8(7.17.V){7.17.V.2m(4v)}8(7.1d.1I){7.1d.1I.2m(4v);8(7.1d.4p){7.1d.1I.13().2Q()}}8(16.1x){$z.1x('5e');$1s.U('8y','3g');16.1x=G}8(16.23){16.23=G}5M(7,'53',B);4c(7,'3l',B)};8(1p(3d)){3d={'1b':3d}}A 16={'2F':'17','2q':E,'2p':G,'2y':G,'23':G,'1x':G},F={'M':$z.13().Q,'W':0},1A={'I':4t,'1h':4t,'3j':2I(),'45':0},T={'2y':G,'1Z':0,'3j':0,'2R':'','1c':[]},2v={'4k':[],'3P':[]},2B=[],B=$.1Y(E,{},$.X.1C.3d,3d),7={},3D=$.1Y(E,{},2n),$1s=(B.1R=='3H')?$z.3H():$z.9X('<'+B.1R.65+' 9Y=\"'+B.1R.8C+'\" />').3H();B.5c=$z.5c;B.4C=$.X.1C.4C++;B.3A=(B.3A&&$.X.3A)?'3A':'9Z';1P.69(3D,E,66);1P.7Q();1P.7Y();1P.6R();8(3u(7.y.2V)){A 3V=7.y.2V}J{A 3V=[];8(7.y.2V!=0){3V.1e(7.y.2V)}}8(7.2o){3V.a0(54(8D(7.2o),10))}8(3V.Q>0){1o(A a=0,l=3V.Q;a<l;a++){A s=3V[a];8(s==0){77}8(s===E){s=3U.a1.8n;8(s.Q<1){77}}J 8(s==='8E'){s=1T.55(1T.8E()*F.M)}8($z.22(D('3T',B),[s,0,E,{1D:'4K'}])){19}}}A 4w=5I($z,7),1i=4n($z.13(),7);8(7.8F){7.8F.1k($12,{'K':4w.K,'1g':4w.1g,'y':1i})}$z.R(D('4l',B),[E,4w]);$z.R(D('6O',B));8(B.1b){$z.R(D('1b',B))}C $z};$.X.1C.4C=1;$.X.1C.6b={'2H':G,'4b':E,'29':E,'3e':G,'2F':'1r','y':{'2V':0},'1X':{'2R':'8G','1Z':7L,'3c':G,'4q':'6S','3m':G}};$.X.1C.3d={'1b':G,'3A':G,'72':'5T','4a':{'4O':'','8H':'z'},'1R':{'65':'a2','8C':'a3'},'78':{}};$.X.1C.8I=u(2l){C'<a a4=\"#\"><8J>'+2l+'</8J></a>'};$.X.1C.8K=u(2Z){$(1q).U('K',2Z+'%')};$.X.1C.2o={4h:u(n){n+='=';A 79=4Z.2o.4x(';');1o(A a=0,l=79.Q;a<l;a++){A c=79[a];2C(c.a5(0)==' '){c=c.1a(1)}8(c.4y(n)==0){C c.1a(n.Q)}}C 0},7a:u(n,v,d){A e=\"\";8(d){A 5U=8L 8M();5U.a6(5U.2I()+(d*24*60*60*a7));e=\"; a8=\"+5U.a9()}4Z.2o=n+'='+v+e+'; aa=/'},2Q:u(n){$.X.1C.2o.7a(n,\"\",-1)}};u 4R(d,e,c){8(c.3A=='3A'){8(e=='8G'){e='ab'}}C{1c:[],1Z:d,ac:d,2R:e,3j:2I()}}u 48(s,c){1o(A a=0,l=s.1c.Q;a<l;a++){A b=s.1c[a];8(!b){77}b[0][c.3A](b[1],s.1Z,s.2R,b[2])}}u 4L(s,2Y){8(!1p(2Y)){2Y=E}8(28(s.5o)){4L(s.5o,2Y)}1o(A a=0,l=s.1c.Q;a<l;a++){A b=s.1c[a];b[0].7Z(E);8(2Y){b[0].U(b[1]);8(1u(b[2])){b[2]()}}}8(28(s.5p)){4L(s.5p,2Y)}}u 6F($c,$7b,o){8($7b){$7b.2Q()}1Q(o.1D){O'1E':O'3R':O'1V-1E':O'2k-1E':$c.U('1z','');$c.U('1N',1);19}}u 4S($t,o,b,a,c){8(o[b]){o[b].1k($t,a)}8(c[b].Q){1o(A i=0,l=c[b].Q;i<l;i++){c[b][i].1k($t,a)}}C[]}u 6G($c,q,c){8(q.Q){$c.R(D(q[0][0],c),q[0][1]);q.ad()}C q}u 6z(2a){2a.2c(u(){A 4z=$(1q);4z.1w('8N',4z.2A(':43')).53()})}u 6D(2a){8(2a){2a.2c(u(){A 4z=$(1q);8(!4z.1w('8N')){4z.56()}})}}u 44(t){8(t.I){ae(t.I)}8(t.1h){af(t.1h)}C t}u 6E(32,2O,2i,8O,8P,8Q,2f){C{'K':2f.K,'1g':2f.1g,'y':{'2h':32,'ag':2O,'H':2i},'1X':{'y':8O,'2F':8P,'1Z':8Q}}}u 6B(18,o,N,4w){A 2T=18.1Z;8(18.1D=='4K'){C 0}8(2T=='I'){2T=o.1X.1Z/o.1X.y*N}J 8(2T<10){2T=4w/2T}8(2T<1){C 0}8(18.1D=='1E'){2T=2T/2}C 1T.8m(2T)}u 5M(o,t,c){A 2L=(Y(o.y.2L))?o.y.2L:o.y.H+1;8(t=='56'||t=='53'){A f=t}J 8(2L>t){1b(c,'2J 82 y ('+t+' M, '+2L+' 83): ah ai.');A f='53'}J{A f='56'}A s=(f=='56')?'3l':'3I',h=2X('43',c);8(o.I.V){o.I.V[f]()[s](h)}8(o.14.V){o.14.V[f]()[s](h)}8(o.17.V){o.17.V[f]()[s](h)}8(o.1d.1I){o.1d.1I[f]()[s](h)}}u 4c(o,f,c){8(o.29||o.4b)C;A 1D=(f=='3l'||f=='3I')?f:G,5V=2X('aj',c);8(o.I.V&&1D){o.I.V[1D](5V)}8(o.14.V){A X=1D||(f==0)?'3I':'3l';o.14.V[X](5V)}8(o.17.V){A X=1D||(f==o.y.H)?'3I':'3l';o.17.V[X](5V)}}u 4B($1m,g){8(1u(g)){g=g.1k($1m)}J 8(1H(g)){g={}}C g}u 7y($1m,g){g=4B($1m,g);8(Y(g)){g={'H':g}}J 8(g=='1f'){g={'H':g,'K':g,'1g':g}}J 8(!28(g)){g={}}C g}u 7z($1m,g){g=4B($1m,g);8(Y(g)){8(g<=50){g={'y':g}}J{g={'1Z':g}}}J 8(1v(g)){g={'2R':g}}J 8(!28(g)){g={}}C g}u 5W($1m,g){g=4B($1m,g);8(1v(g)){A 7c=7d(g);8(7c==-1){g=$(g)}J{g=7c}}C g}u 7A($1m,g){g=5W($1m,g);8(2S(g)){g={'V':g}}J 8(1p(g)){g={'1S':g}}J 8(Y(g)){g={'3h':g}}8(g.1h){8(1v(g.1h)||2S(g.1h)){g.1h={'2K':g.1h}}}C g}u 7M($1m,g){8(1u(g.V)){g.V=g.V.1k($1m)}8(1v(g.V)){g.V=$(g.V)}8(!1p(g.1S)){g.1S=E}8(!Y(g.6Z)){g.6Z=0}8(1H(g.5Q)){g.5Q=E}8(!1p(g.70)){g.70=E}8(!Y(g.3h)){g.3h=(g.1Z<10)?ak:g.1Z*5}8(g.1h){8(1u(g.1h.2K)){g.1h.2K=g.1h.2K.1k($1m)}8(1v(g.1h.2K)){g.1h.2K=$(g.1h.2K)}8(g.1h.2K){8(!1u(g.1h.5q)){g.1h.5q=$.X.1C.8K}8(!Y(g.1h.6t)){g.1h.6t=50}}J{g.1h=G}}C g}u 6a($1m,g){g=5W($1m,g);8(2S(g)){g={'V':g}}J 8(Y(g)){g={'3z':g}}C g}u 6j($1m,g){8(1u(g.V)){g.V=g.V.1k($1m)}8(1v(g.V)){g.V=$(g.V)}8(1v(g.3z)){g.3z=7d(g.3z)}C g}u 7B($1m,g){g=5W($1m,g);8(2S(g)){g={'1I':g}}J 8(1p(g)){g={'5R':g}}C g}u 7N($1m,g){8(1u(g.1I)){g.1I=g.1I.1k($1m)}8(1v(g.1I)){g.1I=$(g.1I)}8(!Y(g.y)){g.y=G}8(!1p(g.5R)){g.5R=G}8(!1u(g.4p)&&!5X(g.4p)){g.4p=$.X.1C.8I}8(!Y(g.5L)){g.5L=0}C g}u 7C($1m,g){8(1u(g)){g=g.1k($1m)}8(1H(g)){g={'51':G}}8(3Z(g)){g={'51':g}}J 8(Y(g)){g={'y':g}}C g}u 7O($1m,g){8(!1p(g.51)){g.51=E}8(!1p(g.6W)){g.6W=G}8(!28(g.2n)){g.2n={}}8(!1p(g.2n.8R)){g.2n.8R=G}C g}u 7D($1m,g){8(1u(g)){g=g.1k($1m)}8(3Z(g)){g={}}J 8(Y(g)){g={'y':g}}J 8(1H(g)){g=G}C g}u 7P($1m,g){C g}u 4o(L,2b,1t,y,$z){8(1v(L)){L=$(L,$z)}8(28(L)){L=$(L,$z)}8(2S(L)){L=$z.13().8o(L);8(!1p(1t)){1t=G}}J{8(!1p(1t)){1t=E}}8(!Y(L)){L=0}8(!Y(2b)){2b=0}8(1t){L+=y.W}L+=2b;8(y.M>0){2C(L>=y.M){L-=y.M}2C(L<0){L+=y.M}}C L}u 5r(i,o,s){A t=0,x=0;1o(A a=s;a>=0;a--){A j=i.20(a);t+=(j.2A(':H'))?j[o.d['2U']](E):0;8(t>o.4D){C x}8(a==0){a=i.Q}x++}}u 8q(i,o,s){C 7e(i,o.y.1z,o.y.S.1t,s)}u 87(i,o,s,m){C 7e(i,o.y.1z,m,s)}u 7e(i,f,m,s){A t=0,x=0;1o(A a=s,l=i.Q;a>=0;a--){x++;8(x==l){C x}A j=i.20(a);8(j.2A(f)){t++;8(t==m){C x}}8(a==0){a=l}}}u 6w($c,o){C o.y.S.1t||$c.13().1a(0,o.y.H).1z(o.y.1z).Q}u 3E(i,o,s){A t=0,x=0;1o(A a=s,l=i.Q-1;a<=l;a++){A j=i.20(a);t+=(j.2A(':H'))?j[o.d['2U']](E):0;8(t>o.4D){C x}x++;8(x==l+1){C x}8(a==l){a=-1}}}u 6I(i,o,s,l){A v=3E(i,o,s);8(!o.29){8(s+v>l){v=l-s}}C v}u 4F(i,o,s){C 7f(i,o.y.1z,o.y.S.1t,s,o.29)}u 8d(i,o,s,m){C 7f(i,o.y.1z,m+1,s,o.29)-1}u 7f(i,f,m,s,c){A t=0,x=0;1o(A a=s,l=i.Q-1;a<=l;a++){x++;8(x>=l){C x}A j=i.20(a);8(j.2A(f)){t++;8(t==m){C x}}8(a==l){a=-1}}}u 4n(i,o){C i.1a(0,o.y.H)}u 89(i,o,n){C i.1a(n,o.y.S.2h+n)}u 8a(i,o){C i.1a(0,o.y.H)}u 8f(i,o){C i.1a(0,o.y.S.2h)}u 8g(i,o,n){C i.1a(n,o.y.H+n)}u 5k(i,o,d){8(o.25){8(!1v(d)){d='2u'}i.2c(u(){A j=$(1q),m=54(j.U(o.d['26']),10);8(!Y(m)){m=0}j.1w(d,m)})}}u 2e(i,o,m){8(o.25){A x=(1p(m))?m:G;8(!Y(m)){m=0}5k(i,o,'8S');i.2c(u(){A j=$(1q);j.U(o.d['26'],((x)?j.1w('8S'):m+j.1w('2u')))})}}u 4J(i){i.2c(u(){A j=$(1q);j.1w('8T',j.8U('8V')||'')})}u 5N(i){i.2c(u(){A j=$(1q);j.8U('8V',j.1w('8T')||'')})}u 6r(o,2E){A 3W=o.y.H,57=o.y[o.d['K']],7g=o[o.d['1g']],8W=4E(7g);2E.2c(u(){A $t=$(1q),4u=57-8X($t,o,'al');$t[o.d['K']](4u);8(8W){$t[o.d['1g']](5g(4u,7g))}})}u 5I($c,o){A $w=$c.3H(),$i=$c.13(),$v=4n($i,o),36=5x(5y($v,o,E),o,G);$w.U(36);8(o.25){A p=o.1l,r=p[o.d[1]];8(o.1J&&r<0){r=0}A $l=$v.3n();$l.U(o.d['26'],$l.1w('2u')+r);$c.U(o.d['41'],p[o.d[0]]);$c.U(o.d['1r'],p[o.d[3]])}$c.U(o.d['K'],36[o.d['K']]+(3o($i,o,'K')*2));$c.U(o.d['1g'],7h($i,o,'1g'));C 36}u 5y(i,o,1R){C[3o(i,o,'K',1R),7h(i,o,'1g',1R)]}u 7h(i,o,1O,1R){8(!1p(1R)){1R=G}8(Y(o[o.d[1O]])&&1R){C o[o.d[1O]]}8(Y(o.y[o.d[1O]])){C o.y[o.d[1O]]}1O=(1O.7i().4y('K')>-1)?'2U':'3X';C 59(i,o,1O)}u 59(i,o,1O){A s=0;1o(A a=0,l=i.Q;a<l;a++){A j=i.20(a);A m=(j.2A(':H'))?j[o.d[1O]](E):0;8(s<m){s=m}}C s}u 3o(i,o,1O,1R){8(!1p(1R)){1R=G}8(Y(o[o.d[1O]])&&1R){C o[o.d[1O]]}8(Y(o.y[o.d[1O]])){C o.y[o.d[1O]]*i.Q}A d=(1O.7i().4y('K')>-1)?'2U':'3X',s=0;1o(A a=0,l=i.Q;a<l;a++){A j=i.20(a);s+=(j.2A(':H'))?j[o.d[d]](E):0}C s}u 6d($w,o,d){A 7j=$w.2A(':H');8(7j){$w.53()}A s=$w.3H()[o.d[d]]();8(7j){$w.56()}C s}u 6e(o,a){C(Y(o[o.d['K']]))?o[o.d['K']]:a}u 7k(i,o,1O){A s=G,v=G;1o(A a=0,l=i.Q;a<l;a++){A j=i.20(a);A c=(j.2A(':H'))?j[o.d[1O]](E):0;8(s===G){s=c}J 8(s!=c){v=E}8(s==0){v=E}}C v}u 8X(i,o,d){C i[o.d['am'+d]](E)-i[o.d[d.7i()]]()}u 5g(s,o){8(4E(o)){o=54(o.1a(0,-1),10);8(!Y(o)){C s}s*=o/3f}C s}u D(n,c,5Y,5a,5Z){8(!1p(5Y)){5Y=E}8(!1p(5a)){5a=E}8(!1p(5Z)){5Z=G}8(5Y){n=c.4a.4O+n}8(5a){n=n+'.'+c.4a.8H}8(5a&&5Z){n+=c.4C}C n}u 2X(n,c){C(1v(c.78[n]))?c.78[n]:n}u 5x(7l,o,p){8(!1p(p)){p=E}A 5b=(o.25&&p)?o.1l:[0,0,0,0];A 61={};61[o.d['K']]=7l[0]+5b[1]+5b[3];61[o.d['1g']]=7l[1]+5b[0]+5b[2];C 61}u 3M(62,7m){A 2M=[];1o(A a=0,8Y=62.Q;a<8Y;a++){1o(A b=0,8Z=7m.Q;b<8Z;b++){8(7m[b].4y(3x 62[a])>-1&&1H(2M[b])){2M[b]=62[a];19}}}C 2M}u 7K(p){8(1H(p)){C[0,0,0,0]}8(Y(p)){C[p,p,p,p]}8(1v(p)){p=p.4x('an').90('').4x('ao').90('').4x(' ')}8(!3u(p)){C[0,0,0,0]}1o(A i=0;i<4;i++){p[i]=54(p[i],10)}1Q(p.Q){O 0:C[0,0,0,0];O 1:C[p[0],p[0],p[0],p[0]];O 2:C[p[0],p[1],p[0],p[1]];O 3:C[p[0],p[1],p[2],p[1]];3g:C[p[0],p[1],p[2],p[3]]}}u 5v(1i,o){A x=(Y(o[o.d['K']]))?1T.30(o[o.d['K']]-3o(1i,o,'K')):0;1Q(o.1J){O'1r':C[0,x];O'3G':C[x,0];O'6f':3g:C[1T.30(x/2),1T.55(x/2)]}}u 7E(o){A 63=[['K','91','2U','1g','92','3X','1r','41','26',0,1,2,3],['1g','92','3X','K','91','2U','41','1r','6p',3,2,1,0]];A 93=63[0].Q,94=(o.2F=='3G'||o.2F=='1r')?0:1;A 7n={};1o(A d=0;d<93;d++){7n[63[0][d]]=63[94][d]}C 7n}u 5s(x,o,a,$t){A v=x;8(1u(a)){v=a.1k($t,v)}J 8(1v(a)){A p=a.4x('+'),m=a.4x('-');8(m.Q>p.Q){A 7o=E,4A=m[0],3B=m[1]}J{A 7o=G,4A=p[0],3B=p[1]}1Q(4A){O'ap':v=(x%2==1)?x-1:x;19;O'aq':v=(x%2==0)?x-1:x;19;3g:v=x;19}3B=54(3B,10);8(Y(3B)){8(7o){3B=-3B}v+=3B}}8(!Y(v)||v<1){v=1}C v}u 2W(x,o,a,$t){C 7p(5s(x,o,a,$t),o.y.S)}u 7p(v,i){8(Y(i.3F)&&v<i.3F){v=i.3F}8(Y(i.2d)&&v>i.2d){v=i.2d}8(v<1){v=1}C v}u 6k(s){8(!3u(s)){s=[[s]]}8(!3u(s[0])){s=[s]}1o(A j=0,l=s.Q;j<l;j++){8(1v(s[j][0])){s[j][0]=$(s[j][0])}8(!1p(s[j][1])){s[j][1]=E}8(!1p(s[j][2])){s[j][2]=E}8(!Y(s[j][3])){s[j][3]=0}}C s}u 7d(k){8(k=='3G'){C 39}8(k=='1r'){C 37}8(k=='6c'){C 38}8(k=='8x'){C 40}C-1}u 6H(n,$c,c){8(n){A v=$c.22(D('5d',c));$.X.1C.2o.7a(n,v)}}u 8D(n){A c=$.X.1C.2o.4h(n);C(c=='')?0:c}u 7R($95,64){A U={};1o(A p=0,l=64.Q;p<l;p++){U[64[p]]=$95.U(64[p])}C U}u 7F(g,11,1i,4A){8(!28(g.S)){g.S={}}8(!28(g.4r)){g.4r={}}8(g.2V==0&&Y(4A)){g.2V=4A}8(28(g.H)){g.S.3F=g.H.3F;g.S.2d=g.H.2d;g.H=G}J 8(1v(g.H)){8(g.H=='1f'){g.S.1f=E}J{g.S.2x=g.H}g.H=G}J 8(1u(g.H)){g.S.2x=g.H;g.H=G}8(!1v(g.1z)){g.1z=(1i.1z(':43').Q>0)?':H':'*'}8(!g[11.d['K']]){8(11.3e){g[11.d['K']]=59(1i,11,'2U')}J{g[11.d['K']]=(7k(1i,11,'2U'))?'1f':1i[11.d['2U']](E)}}8(!g[11.d['1g']]){g[11.d['1g']]=(7k(1i,11,'3X'))?'1f':1i[11.d['3X']](E)}g.4r.K=g.K;g.4r.1g=g.1g;C g}u 7J(11,7q){8(11.y[11.d['K']]=='1f'){11.y.S.1f=E}8(!11.y.S.1f){8(Y(11[11.d['K']])){11.y.H=1T.55(11[11.d['K']]/11.y[11.d['K']])}J{11.y.H=1T.55(7q/11.y[11.d['K']]);11[11.d['K']]=11.y.H*11.y[11.d['K']];8(!11.y.S.2x){11.1J=G}}8(11.y.H=='ar'||11.y.H<1){1b(E,'2J a 6M 2r 4X H y: as 4P \"1f\".');11.y.S.1f=E}}C 11}u 7G(g,11,2E){8(g=='I'){g=59(2E,11,'2U')}C g}u 7H(g,11,2E){8(g=='I'){g=59(2E,11,'3X')}8(!g){g=11.y[11.d['1g']]}C g}u 6i(o,2E){A p=5v(4n(2E,o),o);o.1l[o.d[1]]=p[1];o.1l[o.d[3]]=p[0];C o}u 6g(o,2E,7q){A 3W=7p(1T.30(o[o.d['K']]/o.y[o.d['K']]),o.y.S);8(3W>2E.Q){3W=2E.Q}A 57=1T.55(o[o.d['K']]/3W);o.y.H=3W;o.y[o.d['K']]=57;o[o.d['K']]=3W*57;C o}u 4s(p){8(1v(p)){A i=(p.4y('at')>-1)?E:G,r=(p.4y('3O')>-1)?E:G}J{A i=r=G}C[i,r]}u au(7r){C(Y(7r))?7r:4t}u 7s(a){C(a===4t)}u 1H(a){C(7s(a)||3x a=='96'||a===''||a==='96')}u 3u(a){C(a 3v av)}u 2S(a){C(a 3v 97)}u 28(a){C((a 3v aw||3x a=='31')&&!7s(a)&&!2S(a)&&!3u(a))}u Y(a){C((a 3v 4W||3x a=='2r')&&!ax(a))}u 1v(a){C((a 3v ay||3x a=='3k')&&!1H(a)&&!3Z(a)&&!5X(a))}u 1u(a){C(a 3v az||3x a=='u')}u 1p(a){C(a 3v aA||3x a=='3L'||3Z(a)||5X(a))}u 3Z(a){C(a===E||a==='E')}u 5X(a){C(a===G||a==='G')}u 4E(x){C(1v(x)&&x.1a(-1)=='%')}u 2I(){C 8L 8M().2I()}u 4G(o,n){1b(E,o+' 2A aB, aC 1o aD aE aF 2g. aG '+n+' aH.')}u 1b(d,m){8(!1H(3U.7t)&&!1H(3U.7t.98)){8(28(d)){A s=' ('+d.5c+')';d=d.1b}J{A s=''}8(!d){C G}8(1v(m)){m='1C'+s+': '+m}J{m=['1C'+s+':',m]}3U.7t.98(m)}C G}$.1Y($.2R,{'aI':u(t){A 3C=t*t;C t*(-3C*t+4*3C-6*t+4)},'aJ':u(t){C t*(4*t*t-9*t+6)},'aK':u(t){A 3C=t*t;C t*(33*3C*3C-aL*3C*t+aM*3C-67*t+15)}})})(97);", 62, 669, "|||||||opts|if||||||||obj||||||||||||||function||||items|cfs|var|conf|return|cf_e|true|itms|false|visible|auto|else|width|num|total|nI|case|a_itm|length|trigger|visibleConf|scrl|css|button|first|fn|is_number|bind||opt|tt0|children|prev||crsl|next|sO|break|slice|debug|anims|pagination|push|variable|height|progress|itm|stopPropagation|call|padding|tt|dir|for|is_boolean|this|left|wrp|org|is_function|is_string|data|swipe|cf2|filter|tmrs|vI|carouFredSel|fx|fade|_onafter|_moveitems|is_undefined|container|align|clb|_s_paddingold|_s_paddingcur|opacity|dim|FN|switch|wrapper|play|Math|i_cur_l|cover|_position|scroll|extend|duration|eq|_a_wrapper|triggerHandler|mousewheel||usePadding|marginRight|eType|is_object|circular|hiddenitems|dev|each|max|sz_resetMargin|w_siz|removed|old|i_new|i_old_l|uncover|nr|unbind|options|cookie|isScrolling|isPaused|number|pL|a_cfs|_cfs_origCssMargin|clbk|ipp|adjust|isStopped|stopImmediatePropagation|is|queu|while|pC|all|direction|avail_primary|synchronise|getTime|Not|bar|minimum|arr|i_new_l|i_skp|a_cur|remove|easing|is_jquery|dur|outerWidth|start|cf_getItemsAdjust|cf_c|finish|perc|ceil|object|i_old||pR|_s_paddingnew|sz||||con|preventDefault|pauseOnHover|configs|responsive|100|default|timeoutDuration|res|startTime|string|removeClass|queue|last|ms_getTotalSize|a_old|a_lef|a_dur|_s_wrapper|pag|is_array|instanceof|val|typeof|selected|key|transition|adj|t2|opts_orig|gn_getVisibleItemsNext|min|right|parent|addClass|pause|dur1|boolean|cf_sortParams|scrolling|resume|onAfter|xI|crossfade|overFill|slideTo|window|start_arr|visb|outerHeight|_cfs_triggerEvent|is_true||top|position|hidden|sc_clearTimers|timePassed|del|Carousel|sc_startScroll||events|infinite|nv_enableNavi|i_siz|i_siz_vis|_a_paddingold|_a_paddingcur|get|l_itm|cb_arguments|onBefore|updatePageStatus|lastItemNr|gi_getCurrentItems|gn_getItemIndex|anchorBuilder|event|sizesConf|bt_pauseOnHoverConfig|null|nw|ns2|siz|split|indexOf|hi|sta|go_getObject|serialNumber|maxDimension|is_percentage|gn_getVisibleItemsNextFilter|deprecated|orgCSS|zIndex|sz_storeOrigCss|none|sc_stopScroll|dur2|que|prefix|to|appendTo|sc_setScroll|sc_fireCallbacks|currentPage|end|before|Number|of|ev|document||onTouch|onResize|hide|parseInt|floor|show|newS||ms_getTrueLargestSize|ns|pad|selector|currentPosition|destroy|primarySizePercentage|ms_getPercentage|onTimeoutStart|onTimeoutPause|onTimeoutEnd|sz_storeMargin|imm|stopped|nst|pre|post|updater|gn_getVisibleItemsPrev|cf_getAdjust|onEnd|clone|cf_getAlignPadding|orgW|cf_mapWrapperSizes|ms_getSizes|a_wsz|a_new|not|a_cfs_vis|cur|updateSizes|iA|reInit|eval|sz_setSizes|sel|pgs|deviation|nv_showNavi|sz_restoreOrigCss|mouseenter|mouseleave|pauseOnEvent|keys|resizeFn|throttle|date|di|go_getNaviObject|is_false|pf|rd||wra|vals|dm|props|element|starting_position||_cfs_isCarousel|_cfs_init|go_getPrevNextObject|defaults|up|ms_getParentSize|ms_getMaxDimension|center|in_getResponsiveValues|bottom|in_getAlignPadding|go_complementPrevNextObject|cf_getSynchArr|onPauseStart|onPausePause|onPauseEnd|pauseDuration|marginBottom|newPosition|sz_setResponsiveSizes|_cfs_unbind_events|interval|type|conditions|gn_getVisibleOrg|backward|oL|sc_hideHiddenItems|a_lef_vis|sc_getDuration|_a_paddingnew|sc_showHiddenItems|sc_mapCallbackArguments|sc_afterScroll|sc_fireQueue|cf_setCookie|gn_getVisibleItemsNextTestCircular|i_new_l_m|i_cur_l_m|slideToPage|valid|cit|linkAnchors|rem|value|_cfs_bind_buttons|click|_cfs_unbind_buttons|scrolled|isTouch|onMouse|swP|swN|delay|pauseOnResize|debounce|onWindowResize|_windowWidth|_windowHeight|nh|ns3|continue|classnames|ca|set|c2|temp|cf_getKeyCode|gn_getItemsPrevFilter|gn_getItemsNextFilter|seco|ms_getLargestSize|toLowerCase|isVisible|ms_hasVariableSizes|ws|typs|dimensions|neg|cf_getItemAdjustMinMax|avl|mw|is_null|console|caroufredsel|No|found|setOrig|go_getItemsObject|go_getScrollObject|go_getAutoObject|go_getPaginationObject|go_getSwipeObject|go_getMousewheelObject|cf_getDimensions|in_complementItems|in_complementPrimarySize|in_complementSecondarySize|upDateOnWindowResize|in_complementVisibleItems|cf_getPadding|500|go_complementAutoObject|go_complementPaginationObject|go_complementSwipeObject|go_complementMousewheelObject|_cfs_build|in_mapCss|textAlign|float|marginTop|marginLeft|absolute|_cfs_origCssZindex|_cfs_bind_events|stop|paused|pasd|enough|needed|page|slide_|configuration|gn_getScrollItemsPrevFilter|Scrolling|gi_getOldItemsPrev|gi_getNewItemsPrev|directscroll|concat|gn_getScrollItemsNextFilter|forward|gi_getOldItemsNext|gi_getNewItemsNext|jumpToStart|orgNum|after|append|removeItem|round|hash|index|build|gn_getVisibleItemsPrevFilter|orgOrder|Item|keyup|keyCode|scP|scN|down|cursor|mcP|mcN|delta|classname|cf_getCookie|random|onCreate|swing|namespace|pageAnchorBuilder|span|progressbarUpdater|new|Date|_cfs_isHidden|s_itm|s_dir|s_dur|triggerOnTouchEnd|_cfs_tempCssMargin|_cfs_origCss|attr|style|secp|ms_getPaddingBorderMargin|l1|l2|join|innerWidth|innerHeight|dl|dx|elem|undefined|jQuery|log|caroufredsel_cookie_|relative|fixed|overflow|setInterval|setTimeout|or|Callback|returned|Page|resumed|currently|slide_prev|prependTo|slide_next|prevPage|nextPage|prepend|carousel|insertItem|Correct|insert|Appending|item|the|el|add|detach|currentVisible|body|find|sizes|Preventing|non|sliding|replaceWith|widths|heights|automatically|ontouchstart|in|swipeUp|swipeDown|swipeLeft|swipeRight|move|200|300|resize|ns1|wrap|class|animate|unshift|location|div|caroufredsel_wrapper|href|charAt|setTime|1000|expires|toGMTString|path|ease|orgDuration|shift|clearTimeout|clearInterval|skipped|Hiding|navigation|disabled|2500|Width|outer|px|em|even|odd|Infinity|Set|immediate|bt_mousesheelNumber|Array|Object|isNaN|String|Function|Boolean|DEPRECATED|support|it|will|be|Use|instead|quadratic|cubic|elastic|106|126".split("|"), 0, {}));

(function(a) {
    if (typeof define === "function" && define.amd && define.amd.jQuery) {
        define([ "jquery" ], a);
    } else {
        a(jQuery);
    }
})(function(f) {
    var y = "1.6.9", p = "left", o = "right", e = "up", x = "down", c = "in", A = "out", m = "none", s = "auto", l = "swipe", t = "pinch", B = "tap", j = "doubletap", b = "longtap", z = "hold", E = "horizontal", u = "vertical", i = "all", r = 10, g = "start", k = "move", h = "end", q = "cancel", a = "ontouchstart" in window, v = window.navigator.msPointerEnabled && !window.navigator.pointerEnabled, d = window.navigator.pointerEnabled || window.navigator.msPointerEnabled, C = "TouchSwipe";
    var n = {
        fingers: 1,
        threshold: 75,
        cancelThreshold: null,
        pinchThreshold: 20,
        maxTimeThreshold: null,
        fingerReleaseThreshold: 250,
        longTapThreshold: 500,
        doubleTapThreshold: 200,
        swipe: null,
        swipeLeft: null,
        swipeRight: null,
        swipeUp: null,
        swipeDown: null,
        swipeStatus: null,
        pinchIn: null,
        pinchOut: null,
        pinchStatus: null,
        click: null,
        tap: null,
        doubleTap: null,
        longTap: null,
        hold: null,
        triggerOnTouchEnd: true,
        triggerOnTouchLeave: false,
        allowPageScroll: "auto",
        fallbackToMouseEvents: true,
        excludedElements: "label, button, input, select, textarea, a, .noSwipe",
        preventDefaultEvents: true
    };
    f.fn.swipe = function(H) {
        var G = f(this), F = G.data(C);
        if (F && typeof H === "string") {
            if (F[H]) {
                return F[H].apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                f.error("Method " + H + " does not exist on jQuery.swipe");
            }
        } else {
            if (!F && (typeof H === "object" || !H)) {
                return w.apply(this, arguments);
            }
        }
        return G;
    };
    f.fn.swipe.version = y;
    f.fn.swipe.defaults = n;
    f.fn.swipe.phases = {
        PHASE_START: g,
        PHASE_MOVE: k,
        PHASE_END: h,
        PHASE_CANCEL: q
    };
    f.fn.swipe.directions = {
        LEFT: p,
        RIGHT: o,
        UP: e,
        DOWN: x,
        IN: c,
        OUT: A
    };
    f.fn.swipe.pageScroll = {
        NONE: m,
        HORIZONTAL: E,
        VERTICAL: u,
        AUTO: s
    };
    f.fn.swipe.fingers = {
        ONE: 1,
        TWO: 2,
        THREE: 3,
        ALL: i
    };
    function w(F) {
        if (F && (F.allowPageScroll === undefined && (F.swipe !== undefined || F.swipeStatus !== undefined))) {
            F.allowPageScroll = m;
        }
        if (F.click !== undefined && F.tap === undefined) {
            F.tap = F.click;
        }
        if (!F) {
            F = {};
        }
        F = f.extend({}, f.fn.swipe.defaults, F);
        return this.each(function() {
            var H = f(this);
            var G = H.data(C);
            if (!G) {
                G = new D(this, F);
                H.data(C, G);
            }
        });
    }
    function D(a5, aw) {
        var aA = a || d || !aw.fallbackToMouseEvents, K = aA ? d ? v ? "MSPointerDown" : "pointerdown" : "touchstart" : "mousedown", az = aA ? d ? v ? "MSPointerMove" : "pointermove" : "touchmove" : "mousemove", V = aA ? d ? v ? "MSPointerUp" : "pointerup" : "touchend" : "mouseup", T = aA ? null : "mouseleave", aE = d ? v ? "MSPointerCancel" : "pointercancel" : "touchcancel";
        var ah = 0, aQ = null, ac = 0, a2 = 0, a0 = 0, H = 1, ar = 0, aK = 0, N = null;
        var aS = f(a5);
        var aa = "start";
        var X = 0;
        var aR = null;
        var U = 0, a3 = 0, a6 = 0, ae = 0, O = 0;
        var aX = null, ag = null;
        try {
            aS.bind(K, aO);
            aS.bind(aE, ba);
        } catch (al) {
            f.error("events not supported " + K + "," + aE + " on jQuery.swipe");
        }
        this.enable = function() {
            aS.bind(K, aO);
            aS.bind(aE, ba);
            return aS;
        };
        this.disable = function() {
            aL();
            return aS;
        };
        this.destroy = function() {
            aL();
            aS.data(C, null);
            aS = null;
        };
        this.option = function(bd, bc) {
            if (aw[bd] !== undefined) {
                if (bc === undefined) {
                    return aw[bd];
                } else {
                    aw[bd] = bc;
                }
            } else {
                f.error("Option " + bd + " does not exist on jQuery.swipe.options");
            }
            return null;
        };
        function aO(be) {
            if (aC()) {
                return;
            }
            if (f(be.target).closest(aw.excludedElements, aS).length > 0) {
                return;
            }
            var bf = be.originalEvent ? be.originalEvent : be;
            var bd, bg = bf.touches, bc = bg ? bg[0] : bf;
            aa = g;
            if (bg) {
                X = bg.length;
            } else {
                be.preventDefault();
            }
            ah = 0;
            aQ = null;
            aK = null;
            ac = 0;
            a2 = 0;
            a0 = 0;
            H = 1;
            ar = 0;
            aR = ak();
            N = ab();
            S();
            if (!bg || (X === aw.fingers || aw.fingers === i) || aY()) {
                aj(0, bc);
                U = au();
                if (X == 2) {
                    aj(1, bg[1]);
                    a2 = a0 = av(aR[0].start, aR[1].start);
                }
                if (aw.swipeStatus || aw.pinchStatus) {
                    bd = P(bf, aa);
                }
            } else {
                bd = false;
            }
            if (bd === false) {
                aa = q;
                P(bf, aa);
                return bd;
            } else {
                if (aw.hold) {
                    ag = setTimeout(f.proxy(function() {
                        aS.trigger("hold", [ bf.target ]);
                        if (aw.hold) {
                            bd = aw.hold.call(aS, bf, bf.target);
                        }
                    }, this), aw.longTapThreshold);
                }
                ap(true);
            }
            return null;
        }
        function a4(bf) {
            var bi = bf.originalEvent ? bf.originalEvent : bf;
            if (aa === h || aa === q || an()) {
                return;
            }
            var be, bj = bi.touches, bd = bj ? bj[0] : bi;
            var bg = aI(bd);
            a3 = au();
            if (bj) {
                X = bj.length;
            }
            if (aw.hold) {
                clearTimeout(ag);
            }
            aa = k;
            if (X == 2) {
                if (a2 == 0) {
                    aj(1, bj[1]);
                    a2 = a0 = av(aR[0].start, aR[1].start);
                } else {
                    aI(bj[1]);
                    a0 = av(aR[0].end, aR[1].end);
                    aK = at(aR[0].end, aR[1].end);
                }
                H = a8(a2, a0);
                ar = Math.abs(a2 - a0);
            }
            if (X === aw.fingers || aw.fingers === i || !bj || aY()) {
                aQ = aM(bg.start, bg.end);
                am(bf, aQ);
                ah = aT(bg.start, bg.end);
                ac = aN();
                aJ(aQ, ah);
                if (aw.swipeStatus || aw.pinchStatus) {
                    be = P(bi, aa);
                }
                if (!aw.triggerOnTouchEnd || aw.triggerOnTouchLeave) {
                    var bc = true;
                    if (aw.triggerOnTouchLeave) {
                        var bh = aZ(this);
                        bc = F(bg.end, bh);
                    }
                    if (!aw.triggerOnTouchEnd && bc) {
                        aa = aD(k);
                    } else {
                        if (aw.triggerOnTouchLeave && !bc) {
                            aa = aD(h);
                        }
                    }
                    if (aa == q || aa == h) {
                        P(bi, aa);
                    }
                }
            } else {
                aa = q;
                P(bi, aa);
            }
            if (be === false) {
                aa = q;
                P(bi, aa);
            }
        }
        function M(bc) {
            var bd = bc.originalEvent ? bc.originalEvent : bc, be = bd.touches;
            if (be) {
                if (be.length) {
                    G();
                    return true;
                }
            }
            if (an()) {
                X = ae;
            }
            a3 = au();
            ac = aN();
            if (bb() || !ao()) {
                aa = q;
                P(bd, aa);
            } else {
                if (aw.triggerOnTouchEnd || aw.triggerOnTouchEnd == false && aa === k) {
                    bc.preventDefault();
                    aa = h;
                    P(bd, aa);
                } else {
                    if (!aw.triggerOnTouchEnd && a7()) {
                        aa = h;
                        aG(bd, aa, B);
                    } else {
                        if (aa === k) {
                            aa = q;
                            P(bd, aa);
                        }
                    }
                }
            }
            ap(false);
            return null;
        }
        function ba() {
            X = 0;
            a3 = 0;
            U = 0;
            a2 = 0;
            a0 = 0;
            H = 1;
            S();
            ap(false);
        }
        function L(bc) {
            var bd = bc.originalEvent ? bc.originalEvent : bc;
            if (aw.triggerOnTouchLeave) {
                aa = aD(h);
                P(bd, aa);
            }
        }
        function aL() {
            aS.unbind(K, aO);
            aS.unbind(aE, ba);
            aS.unbind(az, a4);
            aS.unbind(V, M);
            if (T) {
                aS.unbind(T, L);
            }
            ap(false);
        }
        function aD(bg) {
            var bf = bg;
            var be = aB();
            var bd = ao();
            var bc = bb();
            if (!be || bc) {
                bf = q;
            } else {
                if (bd && bg == k && (!aw.triggerOnTouchEnd || aw.triggerOnTouchLeave)) {
                    bf = h;
                } else {
                    if (!bd && bg == h && aw.triggerOnTouchLeave) {
                        bf = q;
                    }
                }
            }
            return bf;
        }
        function P(be, bc) {
            var bd, bf = be.touches;
            if (J() || W() || (Q() || aY())) {
                if (J() || W()) {
                    bd = aG(be, bc, l);
                }
                if ((Q() || aY()) && bd !== false) {
                    bd = aG(be, bc, t);
                }
            } else {
                if (aH() && bd !== false) {
                    bd = aG(be, bc, j);
                } else {
                    if (aq() && bd !== false) {
                        bd = aG(be, bc, b);
                    } else {
                        if (ai() && bd !== false) {
                            bd = aG(be, bc, B);
                        }
                    }
                }
            }
            if (bc === q) {
                ba(be);
            }
            if (bc === h) {
                if (bf) {
                    if (!bf.length) {
                        ba(be);
                    }
                } else {
                    ba(be);
                }
            }
            return bd;
        }
        function aG(bf, bc, be) {
            var bd;
            if (be == l) {
                aS.trigger("swipeStatus", [ bc, aQ || null, ah || 0, ac || 0, X, aR ]);
                if (aw.swipeStatus) {
                    bd = aw.swipeStatus.call(aS, bf, bc, aQ || null, ah || 0, ac || 0, X, aR);
                    if (bd === false) {
                        return false;
                    }
                }
                if (bc == h && aW()) {
                    aS.trigger("swipe", [ aQ, ah, ac, X, aR ]);
                    if (aw.swipe) {
                        bd = aw.swipe.call(aS, bf, aQ, ah, ac, X, aR);
                        if (bd === false) {
                            return false;
                        }
                    }
                    switch (aQ) {
                      case p:
                        aS.trigger("swipeLeft", [ aQ, ah, ac, X, aR ]);
                        if (aw.swipeLeft) {
                            bd = aw.swipeLeft.call(aS, bf, aQ, ah, ac, X, aR);
                        }
                        break;

                      case o:
                        aS.trigger("swipeRight", [ aQ, ah, ac, X, aR ]);
                        if (aw.swipeRight) {
                            bd = aw.swipeRight.call(aS, bf, aQ, ah, ac, X, aR);
                        }
                        break;

                      case e:
                        aS.trigger("swipeUp", [ aQ, ah, ac, X, aR ]);
                        if (aw.swipeUp) {
                            bd = aw.swipeUp.call(aS, bf, aQ, ah, ac, X, aR);
                        }
                        break;

                      case x:
                        aS.trigger("swipeDown", [ aQ, ah, ac, X, aR ]);
                        if (aw.swipeDown) {
                            bd = aw.swipeDown.call(aS, bf, aQ, ah, ac, X, aR);
                        }
                        break;
                    }
                }
            }
            if (be == t) {
                aS.trigger("pinchStatus", [ bc, aK || null, ar || 0, ac || 0, X, H, aR ]);
                if (aw.pinchStatus) {
                    bd = aw.pinchStatus.call(aS, bf, bc, aK || null, ar || 0, ac || 0, X, H, aR);
                    if (bd === false) {
                        return false;
                    }
                }
                if (bc == h && a9()) {
                    switch (aK) {
                      case c:
                        aS.trigger("pinchIn", [ aK || null, ar || 0, ac || 0, X, H, aR ]);
                        if (aw.pinchIn) {
                            bd = aw.pinchIn.call(aS, bf, aK || null, ar || 0, ac || 0, X, H, aR);
                        }
                        break;

                      case A:
                        aS.trigger("pinchOut", [ aK || null, ar || 0, ac || 0, X, H, aR ]);
                        if (aw.pinchOut) {
                            bd = aw.pinchOut.call(aS, bf, aK || null, ar || 0, ac || 0, X, H, aR);
                        }
                        break;
                    }
                }
            }
            if (be == B) {
                if (bc === q || bc === h) {
                    clearTimeout(aX);
                    clearTimeout(ag);
                    if (Z() && !I()) {
                        O = au();
                        aX = setTimeout(f.proxy(function() {
                            O = null;
                            aS.trigger("tap", [ bf.target ]);
                            if (aw.tap) {
                                bd = aw.tap.call(aS, bf, bf.target);
                            }
                        }, this), aw.doubleTapThreshold);
                    } else {
                        O = null;
                        aS.trigger("tap", [ bf.target ]);
                        if (aw.tap) {
                            bd = aw.tap.call(aS, bf, bf.target);
                        }
                    }
                }
            } else {
                if (be == j) {
                    if (bc === q || bc === h) {
                        clearTimeout(aX);
                        O = null;
                        aS.trigger("doubletap", [ bf.target ]);
                        if (aw.doubleTap) {
                            bd = aw.doubleTap.call(aS, bf, bf.target);
                        }
                    }
                } else {
                    if (be == b) {
                        if (bc === q || bc === h) {
                            clearTimeout(aX);
                            O = null;
                            aS.trigger("longtap", [ bf.target ]);
                            if (aw.longTap) {
                                bd = aw.longTap.call(aS, bf, bf.target);
                            }
                        }
                    }
                }
            }
            return bd;
        }
        function ao() {
            var bc = true;
            if (aw.threshold !== null) {
                bc = ah >= aw.threshold;
            }
            return bc;
        }
        function bb() {
            var bc = false;
            if (aw.cancelThreshold !== null && aQ !== null) {
                bc = aU(aQ) - ah >= aw.cancelThreshold;
            }
            return bc;
        }
        function af() {
            if (aw.pinchThreshold !== null) {
                return ar >= aw.pinchThreshold;
            }
            return true;
        }
        function aB() {
            var bc;
            if (aw.maxTimeThreshold) {
                if (ac >= aw.maxTimeThreshold) {
                    bc = false;
                } else {
                    bc = true;
                }
            } else {
                bc = true;
            }
            return bc;
        }
        function am(bc, bd) {
            if (aw.preventDefaultEvents === false) {
                return;
            }
            if (aw.allowPageScroll === m) {
                bc.preventDefault();
            } else {
                var be = aw.allowPageScroll === s;
                switch (bd) {
                  case p:
                    if (aw.swipeLeft && be || !be && aw.allowPageScroll != E) {
                        bc.preventDefault();
                    }
                    break;

                  case o:
                    if (aw.swipeRight && be || !be && aw.allowPageScroll != E) {
                        bc.preventDefault();
                    }
                    break;

                  case e:
                    if (aw.swipeUp && be || !be && aw.allowPageScroll != u) {
                        bc.preventDefault();
                    }
                    break;

                  case x:
                    if (aw.swipeDown && be || !be && aw.allowPageScroll != u) {
                        bc.preventDefault();
                    }
                    break;
                }
            }
        }
        function a9() {
            var bd = aP();
            var bc = Y();
            var be = af();
            return bd && bc && be;
        }
        function aY() {
            return !!(aw.pinchStatus || aw.pinchIn || aw.pinchOut);
        }
        function Q() {
            return !!(a9() && aY());
        }
        function aW() {
            var bf = aB();
            var bh = ao();
            var be = aP();
            var bc = Y();
            var bd = bb();
            var bg = !bd && bc && be && bh && bf;
            return bg;
        }
        function W() {
            return !!(aw.swipe || aw.swipeStatus || aw.swipeLeft || aw.swipeRight || aw.swipeUp || aw.swipeDown);
        }
        function J() {
            return !!(aW() && W());
        }
        function aP() {
            return X === aw.fingers || aw.fingers === i || !a;
        }
        function Y() {
            return aR[0].end.x !== 0;
        }
        function a7() {
            return !!aw.tap;
        }
        function Z() {
            return !!aw.doubleTap;
        }
        function aV() {
            return !!aw.longTap;
        }
        function R() {
            if (O == null) {
                return false;
            }
            var bc = au();
            return Z() && bc - O <= aw.doubleTapThreshold;
        }
        function I() {
            return R();
        }
        function ay() {
            return (X === 1 || !a) && (isNaN(ah) || ah < aw.threshold);
        }
        function a1() {
            return ac > aw.longTapThreshold && ah < r;
        }
        function ai() {
            return !!(ay() && a7());
        }
        function aH() {
            return !!(R() && Z());
        }
        function aq() {
            return !!(a1() && aV());
        }
        function G() {
            a6 = au();
            ae = event.touches.length + 1;
        }
        function S() {
            a6 = 0;
            ae = 0;
        }
        function an() {
            var bc = false;
            if (a6) {
                var bd = au() - a6;
                if (bd <= aw.fingerReleaseThreshold) {
                    bc = true;
                }
            }
            return bc;
        }
        function aC() {
            return !!(aS.data(C + "_intouch") === true);
        }
        function ap(bc) {
            if (bc === true) {
                aS.bind(az, a4);
                aS.bind(V, M);
                if (T) {
                    aS.bind(T, L);
                }
            } else {
                aS.unbind(az, a4, false);
                aS.unbind(V, M, false);
                if (T) {
                    aS.unbind(T, L, false);
                }
            }
            aS.data(C + "_intouch", bc === true);
        }
        function aj(bd, bc) {
            var be = bc.identifier !== undefined ? bc.identifier : 0;
            aR[bd].identifier = be;
            aR[bd].start.x = aR[bd].end.x = bc.pageX || bc.clientX;
            aR[bd].start.y = aR[bd].end.y = bc.pageY || bc.clientY;
            return aR[bd];
        }
        function aI(bc) {
            var be = bc.identifier !== undefined ? bc.identifier : 0;
            var bd = ad(be);
            bd.end.x = bc.pageX || bc.clientX;
            bd.end.y = bc.pageY || bc.clientY;
            return bd;
        }
        function ad(bd) {
            for (var bc = 0; bc < aR.length; bc++) {
                if (aR[bc].identifier == bd) {
                    return aR[bc];
                }
            }
        }
        function ak() {
            var bc = [];
            for (var bd = 0; bd <= 5; bd++) {
                bc.push({
                    start: {
                        x: 0,
                        y: 0
                    },
                    end: {
                        x: 0,
                        y: 0
                    },
                    identifier: 0
                });
            }
            return bc;
        }
        function aJ(bc, bd) {
            bd = Math.max(bd, aU(bc));
            N[bc].distance = bd;
        }
        function aU(bc) {
            if (N[bc]) {
                return N[bc].distance;
            }
            return undefined;
        }
        function ab() {
            var bc = {};
            bc[p] = ax(p);
            bc[o] = ax(o);
            bc[e] = ax(e);
            bc[x] = ax(x);
            return bc;
        }
        function ax(bc) {
            return {
                direction: bc,
                distance: 0
            };
        }
        function aN() {
            return a3 - U;
        }
        function av(bf, be) {
            var bd = Math.abs(bf.x - be.x);
            var bc = Math.abs(bf.y - be.y);
            return Math.round(Math.sqrt(bd * bd + bc * bc));
        }
        function a8(bc, bd) {
            var be = bd / bc * 1;
            return be.toFixed(2);
        }
        function at() {
            if (H < 1) {
                return A;
            } else {
                return c;
            }
        }
        function aT(bd, bc) {
            return Math.round(Math.sqrt(Math.pow(bc.x - bd.x, 2) + Math.pow(bc.y - bd.y, 2)));
        }
        function aF(bf, bd) {
            var bc = bf.x - bd.x;
            var bh = bd.y - bf.y;
            var be = Math.atan2(bh, bc);
            var bg = Math.round(be * 180 / Math.PI);
            if (bg < 0) {
                bg = 360 - Math.abs(bg);
            }
            return bg;
        }
        function aM(bd, bc) {
            var be = aF(bd, bc);
            if (be <= 45 && be >= 0) {
                return p;
            } else {
                if (be <= 360 && be >= 315) {
                    return p;
                } else {
                    if (be >= 135 && be <= 225) {
                        return o;
                    } else {
                        if (be > 45 && be < 135) {
                            return x;
                        } else {
                            return e;
                        }
                    }
                }
            }
        }
        function au() {
            var bc = new Date();
            return bc.getTime();
        }
        function aZ(bc) {
            bc = f(bc);
            var be = bc.offset();
            var bd = {
                left: be.left,
                right: be.left + bc.outerWidth(),
                top: be.top,
                bottom: be.top + bc.outerHeight()
            };
            return bd;
        }
        function F(bc, bd) {
            return bc.x > bd.left && bc.x < bd.right && bc.y > bd.top && bc.y < bd.bottom;
        }
    }
});

!function(t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery-bridget", [ "jquery" ], function(i) {
        e(t, i);
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("jquery")) : t.jQueryBridget = e(t, t.jQuery);
}(window, function(t, e) {
    "use strict";
    function i(i, s, a) {
        function u(t, e, n) {
            var o, s = "$()." + i + '("' + e + '")';
            return t.each(function(t, u) {
                var h = a.data(u, i);
                if (!h) return void r(i + " not initialized. Cannot call methods, i.e. " + s);
                var d = h[e];
                if (!d || "_" == e.charAt(0)) return void r(s + " is not a valid method");
                var l = d.apply(h, n);
                o = void 0 === o ? l : o;
            }), void 0 !== o ? o : t;
        }
        function h(t, e) {
            t.each(function(t, n) {
                var o = a.data(n, i);
                o ? (o.option(e), o._init()) : (o = new s(n, e), a.data(n, i, o));
            });
        }
        a = a || e || t.jQuery, a && (s.prototype.option || (s.prototype.option = function(t) {
            a.isPlainObject(t) && (this.options = a.extend(!0, this.options, t));
        }), a.fn[i] = function(t) {
            if ("string" == typeof t) {
                var e = o.call(arguments, 1);
                return u(this, t, e);
            }
            return h(this, t), this;
        }, n(a));
    }
    function n(t) {
        !t || t && t.bridget || (t.bridget = i);
    }
    var o = Array.prototype.slice, s = t.console, r = "undefined" == typeof s ? function() {} : function(t) {
        s.error(t);
    };
    return n(e || t.jQuery), i;
}), function(t, e) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? module.exports = e() : t.EvEmitter = e();
}("undefined" != typeof window ? window : this, function() {
    function t() {}
    var e = t.prototype;
    return e.on = function(t, e) {
        if (t && e) {
            var i = this._events = this._events || {}, n = i[t] = i[t] || [];
            return -1 == n.indexOf(e) && n.push(e), this;
        }
    }, e.once = function(t, e) {
        if (t && e) {
            this.on(t, e);
            var i = this._onceEvents = this._onceEvents || {}, n = i[t] = i[t] || {};
            return n[e] = !0, this;
        }
    }, e.off = function(t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var n = i.indexOf(e);
            return -1 != n && i.splice(n, 1), this;
        }
    }, e.emitEvent = function(t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var n = 0, o = i[n];
            e = e || [];
            for (var s = this._onceEvents && this._onceEvents[t]; o; ) {
                var r = s && s[o];
                r && (this.off(t, o), delete s[o]), o.apply(this, e), n += r ? 0 : 1, o = i[n];
            }
            return this;
        }
    }, t;
}), function(t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("get-size/get-size", [], function() {
        return e();
    }) : "object" == typeof module && module.exports ? module.exports = e() : t.getSize = e();
}(window, function() {
    "use strict";
    function t(t) {
        var e = parseFloat(t), i = -1 == t.indexOf("%") && !isNaN(e);
        return i && e;
    }
    function e() {}
    function i() {
        for (var t = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0
        }, e = 0; h > e; e++) {
            var i = u[e];
            t[i] = 0;
        }
        return t;
    }
    function n(t) {
        var e = getComputedStyle(t);
        return e || a("Style returned " + e + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), 
        e;
    }
    function o() {
        if (!d) {
            d = !0;
            var e = document.createElement("div");
            e.style.width = "200px", e.style.padding = "1px 2px 3px 4px", e.style.borderStyle = "solid", 
            e.style.borderWidth = "1px 2px 3px 4px", e.style.boxSizing = "border-box";
            var i = document.body || document.documentElement;
            i.appendChild(e);
            var o = n(e);
            s.isBoxSizeOuter = r = 200 == t(o.width), i.removeChild(e);
        }
    }
    function s(e) {
        if (o(), "string" == typeof e && (e = document.querySelector(e)), e && "object" == typeof e && e.nodeType) {
            var s = n(e);
            if ("none" == s.display) return i();
            var a = {};
            a.width = e.offsetWidth, a.height = e.offsetHeight;
            for (var d = a.isBorderBox = "border-box" == s.boxSizing, l = 0; h > l; l++) {
                var f = u[l], c = s[f], m = parseFloat(c);
                a[f] = isNaN(m) ? 0 : m;
            }
            var p = a.paddingLeft + a.paddingRight, y = a.paddingTop + a.paddingBottom, g = a.marginLeft + a.marginRight, v = a.marginTop + a.marginBottom, _ = a.borderLeftWidth + a.borderRightWidth, I = a.borderTopWidth + a.borderBottomWidth, z = d && r, x = t(s.width);
            x !== !1 && (a.width = x + (z ? 0 : p + _));
            var S = t(s.height);
            return S !== !1 && (a.height = S + (z ? 0 : y + I)), a.innerWidth = a.width - (p + _), 
            a.innerHeight = a.height - (y + I), a.outerWidth = a.width + g, a.outerHeight = a.height + v, 
            a;
        }
    }
    var r, a = "undefined" == typeof console ? e : function(t) {
        console.error(t);
    }, u = [ "paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth" ], h = u.length, d = !1;
    return s;
}), function(t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("desandro-matches-selector/matches-selector", e) : "object" == typeof module && module.exports ? module.exports = e() : t.matchesSelector = e();
}(window, function() {
    "use strict";
    var t = function() {
        var t = Element.prototype;
        if (t.matches) return "matches";
        if (t.matchesSelector) return "matchesSelector";
        for (var e = [ "webkit", "moz", "ms", "o" ], i = 0; i < e.length; i++) {
            var n = e[i], o = n + "MatchesSelector";
            if (t[o]) return o;
        }
    }();
    return function(e, i) {
        return e[t](i);
    };
}), function(t, e) {
    "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", [ "desandro-matches-selector/matches-selector" ], function(i) {
        return e(t, i);
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("desandro-matches-selector")) : t.fizzyUIUtils = e(t, t.matchesSelector);
}(window, function(t, e) {
    var i = {};
    i.extend = function(t, e) {
        for (var i in e) t[i] = e[i];
        return t;
    }, i.modulo = function(t, e) {
        return (t % e + e) % e;
    }, i.makeArray = function(t) {
        var e = [];
        if (Array.isArray(t)) e = t; else if (t && "number" == typeof t.length) for (var i = 0; i < t.length; i++) e.push(t[i]); else e.push(t);
        return e;
    }, i.removeFrom = function(t, e) {
        var i = t.indexOf(e);
        -1 != i && t.splice(i, 1);
    }, i.getParent = function(t, i) {
        for (;t != document.body; ) if (t = t.parentNode, e(t, i)) return t;
    }, i.getQueryElement = function(t) {
        return "string" == typeof t ? document.querySelector(t) : t;
    }, i.handleEvent = function(t) {
        var e = "on" + t.type;
        this[e] && this[e](t);
    }, i.filterFindElements = function(t, n) {
        t = i.makeArray(t);
        var o = [];
        return t.forEach(function(t) {
            if (t instanceof HTMLElement) {
                if (!n) return void o.push(t);
                e(t, n) && o.push(t);
                for (var i = t.querySelectorAll(n), s = 0; s < i.length; s++) o.push(i[s]);
            }
        }), o;
    }, i.debounceMethod = function(t, e, i) {
        var n = t.prototype[e], o = e + "Timeout";
        t.prototype[e] = function() {
            var t = this[o];
            t && clearTimeout(t);
            var e = arguments, s = this;
            this[o] = setTimeout(function() {
                n.apply(s, e), delete s[o];
            }, i || 100);
        };
    }, i.docReady = function(t) {
        var e = document.readyState;
        "complete" == e || "interactive" == e ? t() : document.addEventListener("DOMContentLoaded", t);
    }, i.toDashed = function(t) {
        return t.replace(/(.)([A-Z])/g, function(t, e, i) {
            return e + "-" + i;
        }).toLowerCase();
    };
    var n = t.console;
    return i.htmlInit = function(e, o) {
        i.docReady(function() {
            var s = i.toDashed(o), r = "data-" + s, a = document.querySelectorAll("[" + r + "]"), u = document.querySelectorAll(".js-" + s), h = i.makeArray(a).concat(i.makeArray(u)), d = r + "-options", l = t.jQuery;
            h.forEach(function(t) {
                var i, s = t.getAttribute(r) || t.getAttribute(d);
                try {
                    i = s && JSON.parse(s);
                } catch (a) {
                    return void (n && n.error("Error parsing " + r + " on " + t.className + ": " + a));
                }
                var u = new e(t, i);
                l && l.data(t, o, u);
            });
        });
    }, i;
}), function(t, e) {
    "function" == typeof define && define.amd ? define("outlayer/item", [ "ev-emitter/ev-emitter", "get-size/get-size" ], e) : "object" == typeof module && module.exports ? module.exports = e(require("ev-emitter"), require("get-size")) : (t.Outlayer = {}, 
    t.Outlayer.Item = e(t.EvEmitter, t.getSize));
}(window, function(t, e) {
    "use strict";
    function i(t) {
        for (var e in t) return !1;
        return e = null, !0;
    }
    function n(t, e) {
        t && (this.element = t, this.layout = e, this.position = {
            x: 0,
            y: 0
        }, this._create());
    }
    function o(t) {
        return t.replace(/([A-Z])/g, function(t) {
            return "-" + t.toLowerCase();
        });
    }
    var s = document.documentElement.style, r = "string" == typeof s.transition ? "transition" : "WebkitTransition", a = "string" == typeof s.transform ? "transform" : "WebkitTransform", u = {
        WebkitTransition: "webkitTransitionEnd",
        transition: "transitionend"
    }[r], h = {
        transform: a,
        transition: r,
        transitionDuration: r + "Duration",
        transitionProperty: r + "Property",
        transitionDelay: r + "Delay"
    }, d = n.prototype = Object.create(t.prototype);
    d.constructor = n, d._create = function() {
        this._transn = {
            ingProperties: {},
            clean: {},
            onEnd: {}
        }, this.css({
            position: "absolute"
        });
    }, d.handleEvent = function(t) {
        var e = "on" + t.type;
        this[e] && this[e](t);
    }, d.getSize = function() {
        this.size = e(this.element);
    }, d.css = function(t) {
        var e = this.element.style;
        for (var i in t) {
            var n = h[i] || i;
            e[n] = t[i];
        }
    }, d.getPosition = function() {
        var t = getComputedStyle(this.element), e = this.layout._getOption("originLeft"), i = this.layout._getOption("originTop"), n = t[e ? "left" : "right"], o = t[i ? "top" : "bottom"], s = this.layout.size, r = -1 != n.indexOf("%") ? parseFloat(n) / 100 * s.width : parseInt(n, 10), a = -1 != o.indexOf("%") ? parseFloat(o) / 100 * s.height : parseInt(o, 10);
        r = isNaN(r) ? 0 : r, a = isNaN(a) ? 0 : a, r -= e ? s.paddingLeft : s.paddingRight, 
        a -= i ? s.paddingTop : s.paddingBottom, this.position.x = r, this.position.y = a;
    }, d.layoutPosition = function() {
        var t = this.layout.size, e = {}, i = this.layout._getOption("originLeft"), n = this.layout._getOption("originTop"), o = i ? "paddingLeft" : "paddingRight", s = i ? "left" : "right", r = i ? "right" : "left", a = this.position.x + t[o];
        e[s] = this.getXValue(a), e[r] = "";
        var u = n ? "paddingTop" : "paddingBottom", h = n ? "top" : "bottom", d = n ? "bottom" : "top", l = this.position.y + t[u];
        e[h] = this.getYValue(l), e[d] = "", this.css(e), this.emitEvent("layout", [ this ]);
    }, d.getXValue = function(t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && !e ? t / this.layout.size.width * 100 + "%" : t + "px";
    }, d.getYValue = function(t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && e ? t / this.layout.size.height * 100 + "%" : t + "px";
    }, d._transitionTo = function(t, e) {
        this.getPosition();
        var i = this.position.x, n = this.position.y, o = parseInt(t, 10), s = parseInt(e, 10), r = o === this.position.x && s === this.position.y;
        if (this.setPosition(t, e), r && !this.isTransitioning) return void this.layoutPosition();
        var a = t - i, u = e - n, h = {};
        h.transform = this.getTranslate(a, u), this.transition({
            to: h,
            onTransitionEnd: {
                transform: this.layoutPosition
            },
            isCleaning: !0
        });
    }, d.getTranslate = function(t, e) {
        var i = this.layout._getOption("originLeft"), n = this.layout._getOption("originTop");
        return t = i ? t : -t, e = n ? e : -e, "translate3d(" + t + "px, " + e + "px, 0)";
    }, d.goTo = function(t, e) {
        this.setPosition(t, e), this.layoutPosition();
    }, d.moveTo = d._transitionTo, d.setPosition = function(t, e) {
        this.position.x = parseInt(t, 10), this.position.y = parseInt(e, 10);
    }, d._nonTransition = function(t) {
        this.css(t.to), t.isCleaning && this._removeStyles(t.to);
        for (var e in t.onTransitionEnd) t.onTransitionEnd[e].call(this);
    }, d.transition = function(t) {
        if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(t);
        var e = this._transn;
        for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
        for (i in t.to) e.ingProperties[i] = !0, t.isCleaning && (e.clean[i] = !0);
        if (t.from) {
            this.css(t.from);
            var n = this.element.offsetHeight;
            n = null;
        }
        this.enableTransition(t.to), this.css(t.to), this.isTransitioning = !0;
    };
    var l = "opacity," + o(a);
    d.enableTransition = function() {
        if (!this.isTransitioning) {
            var t = this.layout.options.transitionDuration;
            t = "number" == typeof t ? t + "ms" : t, this.css({
                transitionProperty: l,
                transitionDuration: t,
                transitionDelay: this.staggerDelay || 0
            }), this.element.addEventListener(u, this, !1);
        }
    }, d.onwebkitTransitionEnd = function(t) {
        this.ontransitionend(t);
    }, d.onotransitionend = function(t) {
        this.ontransitionend(t);
    };
    var f = {
        "-webkit-transform": "transform"
    };
    d.ontransitionend = function(t) {
        if (t.target === this.element) {
            var e = this._transn, n = f[t.propertyName] || t.propertyName;
            if (delete e.ingProperties[n], i(e.ingProperties) && this.disableTransition(), n in e.clean && (this.element.style[t.propertyName] = "", 
            delete e.clean[n]), n in e.onEnd) {
                var o = e.onEnd[n];
                o.call(this), delete e.onEnd[n];
            }
            this.emitEvent("transitionEnd", [ this ]);
        }
    }, d.disableTransition = function() {
        this.removeTransitionStyles(), this.element.removeEventListener(u, this, !1), this.isTransitioning = !1;
    }, d._removeStyles = function(t) {
        var e = {};
        for (var i in t) e[i] = "";
        this.css(e);
    };
    var c = {
        transitionProperty: "",
        transitionDuration: "",
        transitionDelay: ""
    };
    return d.removeTransitionStyles = function() {
        this.css(c);
    }, d.stagger = function(t) {
        t = isNaN(t) ? 0 : t, this.staggerDelay = t + "ms";
    }, d.removeElem = function() {
        this.element.parentNode.removeChild(this.element), this.css({
            display: ""
        }), this.emitEvent("remove", [ this ]);
    }, d.remove = function() {
        return r && parseFloat(this.layout.options.transitionDuration) ? (this.once("transitionEnd", function() {
            this.removeElem();
        }), void this.hide()) : void this.removeElem();
    }, d.reveal = function() {
        delete this.isHidden, this.css({
            display: ""
        });
        var t = this.layout.options, e = {}, i = this.getHideRevealTransitionEndProperty("visibleStyle");
        e[i] = this.onRevealTransitionEnd, this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: e
        });
    }, d.onRevealTransitionEnd = function() {
        this.isHidden || this.emitEvent("reveal");
    }, d.getHideRevealTransitionEndProperty = function(t) {
        var e = this.layout.options[t];
        if (e.opacity) return "opacity";
        for (var i in e) return i;
    }, d.hide = function() {
        this.isHidden = !0, this.css({
            display: ""
        });
        var t = this.layout.options, e = {}, i = this.getHideRevealTransitionEndProperty("hiddenStyle");
        e[i] = this.onHideTransitionEnd, this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: e
        });
    }, d.onHideTransitionEnd = function() {
        this.isHidden && (this.css({
            display: "none"
        }), this.emitEvent("hide"));
    }, d.destroy = function() {
        this.css({
            position: "",
            left: "",
            right: "",
            top: "",
            bottom: "",
            transition: "",
            transform: ""
        });
    }, n;
}), function(t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("outlayer/outlayer", [ "ev-emitter/ev-emitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item" ], function(i, n, o, s) {
        return e(t, i, n, o, s);
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("ev-emitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : t.Outlayer = e(t, t.EvEmitter, t.getSize, t.fizzyUIUtils, t.Outlayer.Item);
}(window, function(t, e, i, n, o) {
    "use strict";
    function s(t, e) {
        var i = n.getQueryElement(t);
        if (!i) return void (u && u.error("Bad element for " + this.constructor.namespace + ": " + (i || t)));
        this.element = i, h && (this.$element = h(this.element)), this.options = n.extend({}, this.constructor.defaults), 
        this.option(e);
        var o = ++l;
        this.element.outlayerGUID = o, f[o] = this, this._create();
        var s = this._getOption("initLayout");
        s && this.layout();
    }
    function r(t) {
        function e() {
            t.apply(this, arguments);
        }
        return e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e;
    }
    function a(t) {
        if ("number" == typeof t) return t;
        var e = t.match(/(^\d*\.?\d*)(\w*)/), i = e && e[1], n = e && e[2];
        if (!i.length) return 0;
        i = parseFloat(i);
        var o = m[n] || 1;
        return i * o;
    }
    var u = t.console, h = t.jQuery, d = function() {}, l = 0, f = {};
    s.namespace = "outlayer", s.Item = o, s.defaults = {
        containerStyle: {
            position: "relative"
        },
        initLayout: !0,
        originLeft: !0,
        originTop: !0,
        resize: !0,
        resizeContainer: !0,
        transitionDuration: "0.4s",
        hiddenStyle: {
            opacity: 0,
            transform: "scale(0.001)"
        },
        visibleStyle: {
            opacity: 1,
            transform: "scale(1)"
        }
    };
    var c = s.prototype;
    n.extend(c, e.prototype), c.option = function(t) {
        n.extend(this.options, t);
    }, c._getOption = function(t) {
        var e = this.constructor.compatOptions[t];
        return e && void 0 !== this.options[e] ? this.options[e] : this.options[t];
    }, s.compatOptions = {
        initLayout: "isInitLayout",
        horizontal: "isHorizontal",
        layoutInstant: "isLayoutInstant",
        originLeft: "isOriginLeft",
        originTop: "isOriginTop",
        resize: "isResizeBound",
        resizeContainer: "isResizingContainer"
    }, c._create = function() {
        this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), n.extend(this.element.style, this.options.containerStyle);
        var t = this._getOption("resize");
        t && this.bindResize();
    }, c.reloadItems = function() {
        this.items = this._itemize(this.element.children);
    }, c._itemize = function(t) {
        for (var e = this._filterFindItemElements(t), i = this.constructor.Item, n = [], o = 0; o < e.length; o++) {
            var s = e[o], r = new i(s, this);
            n.push(r);
        }
        return n;
    }, c._filterFindItemElements = function(t) {
        return n.filterFindElements(t, this.options.itemSelector);
    }, c.getItemElements = function() {
        return this.items.map(function(t) {
            return t.element;
        });
    }, c.layout = function() {
        this._resetLayout(), this._manageStamps();
        var t = this._getOption("layoutInstant"), e = void 0 !== t ? t : !this._isLayoutInited;
        this.layoutItems(this.items, e), this._isLayoutInited = !0;
    }, c._init = c.layout, c._resetLayout = function() {
        this.getSize();
    }, c.getSize = function() {
        this.size = i(this.element);
    }, c._getMeasurement = function(t, e) {
        var n, o = this.options[t];
        o ? ("string" == typeof o ? n = this.element.querySelector(o) : o instanceof HTMLElement && (n = o), 
        this[t] = n ? i(n)[e] : o) : this[t] = 0;
    }, c.layoutItems = function(t, e) {
        t = this._getItemsForLayout(t), this._layoutItems(t, e), this._postLayout();
    }, c._getItemsForLayout = function(t) {
        return t.filter(function(t) {
            return !t.isIgnored;
        });
    }, c._layoutItems = function(t, e) {
        if (this._emitCompleteOnItems("layout", t), t && t.length) {
            var i = [];
            t.forEach(function(t) {
                var n = this._getItemLayoutPosition(t);
                n.item = t, n.isInstant = e || t.isLayoutInstant, i.push(n);
            }, this), this._processLayoutQueue(i);
        }
    }, c._getItemLayoutPosition = function() {
        return {
            x: 0,
            y: 0
        };
    }, c._processLayoutQueue = function(t) {
        this.updateStagger(), t.forEach(function(t, e) {
            this._positionItem(t.item, t.x, t.y, t.isInstant, e);
        }, this);
    }, c.updateStagger = function() {
        var t = this.options.stagger;
        return null === t || void 0 === t ? void (this.stagger = 0) : (this.stagger = a(t), 
        this.stagger);
    }, c._positionItem = function(t, e, i, n, o) {
        n ? t.goTo(e, i) : (t.stagger(o * this.stagger), t.moveTo(e, i));
    }, c._postLayout = function() {
        this.resizeContainer();
    }, c.resizeContainer = function() {
        var t = this._getOption("resizeContainer");
        if (t) {
            var e = this._getContainerSize();
            e && (this._setContainerMeasure(e.width, !0), this._setContainerMeasure(e.height, !1));
        }
    }, c._getContainerSize = d, c._setContainerMeasure = function(t, e) {
        if (void 0 !== t) {
            var i = this.size;
            i.isBorderBox && (t += e ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth), 
            t = Math.max(t, 0), this.element.style[e ? "width" : "height"] = t + "px";
        }
    }, c._emitCompleteOnItems = function(t, e) {
        function i() {
            o.dispatchEvent(t + "Complete", null, [ e ]);
        }
        function n() {
            r++, r == s && i();
        }
        var o = this, s = e.length;
        if (!e || !s) return void i();
        var r = 0;
        e.forEach(function(e) {
            e.once(t, n);
        });
    }, c.dispatchEvent = function(t, e, i) {
        var n = e ? [ e ].concat(i) : i;
        if (this.emitEvent(t, n), h) if (this.$element = this.$element || h(this.element), 
        e) {
            var o = h.Event(e);
            o.type = t, this.$element.trigger(o, i);
        } else this.$element.trigger(t, i);
    }, c.ignore = function(t) {
        var e = this.getItem(t);
        e && (e.isIgnored = !0);
    }, c.unignore = function(t) {
        var e = this.getItem(t);
        e && delete e.isIgnored;
    }, c.stamp = function(t) {
        t = this._find(t), t && (this.stamps = this.stamps.concat(t), t.forEach(this.ignore, this));
    }, c.unstamp = function(t) {
        t = this._find(t), t && t.forEach(function(t) {
            n.removeFrom(this.stamps, t), this.unignore(t);
        }, this);
    }, c._find = function(t) {
        return t ? ("string" == typeof t && (t = this.element.querySelectorAll(t)), t = n.makeArray(t)) : void 0;
    }, c._manageStamps = function() {
        this.stamps && this.stamps.length && (this._getBoundingRect(), this.stamps.forEach(this._manageStamp, this));
    }, c._getBoundingRect = function() {
        var t = this.element.getBoundingClientRect(), e = this.size;
        this._boundingRect = {
            left: t.left + e.paddingLeft + e.borderLeftWidth,
            top: t.top + e.paddingTop + e.borderTopWidth,
            right: t.right - (e.paddingRight + e.borderRightWidth),
            bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)
        };
    }, c._manageStamp = d, c._getElementOffset = function(t) {
        var e = t.getBoundingClientRect(), n = this._boundingRect, o = i(t), s = {
            left: e.left - n.left - o.marginLeft,
            top: e.top - n.top - o.marginTop,
            right: n.right - e.right - o.marginRight,
            bottom: n.bottom - e.bottom - o.marginBottom
        };
        return s;
    }, c.handleEvent = n.handleEvent, c.bindResize = function() {
        t.addEventListener("resize", this), this.isResizeBound = !0;
    }, c.unbindResize = function() {
        t.removeEventListener("resize", this), this.isResizeBound = !1;
    }, c.onresize = function() {
        this.resize();
    }, n.debounceMethod(s, "onresize", 100), c.resize = function() {
        this.isResizeBound && this.needsResizeLayout() && this.layout();
    }, c.needsResizeLayout = function() {
        var t = i(this.element), e = this.size && t;
        return e && t.innerWidth !== this.size.innerWidth;
    }, c.addItems = function(t) {
        var e = this._itemize(t);
        return e.length && (this.items = this.items.concat(e)), e;
    }, c.appended = function(t) {
        var e = this.addItems(t);
        e.length && (this.layoutItems(e, !0), this.reveal(e));
    }, c.prepended = function(t) {
        var e = this._itemize(t);
        if (e.length) {
            var i = this.items.slice(0);
            this.items = e.concat(i), this._resetLayout(), this._manageStamps(), this.layoutItems(e, !0), 
            this.reveal(e), this.layoutItems(i);
        }
    }, c.reveal = function(t) {
        if (this._emitCompleteOnItems("reveal", t), t && t.length) {
            var e = this.updateStagger();
            t.forEach(function(t, i) {
                t.stagger(i * e), t.reveal();
            });
        }
    }, c.hide = function(t) {
        if (this._emitCompleteOnItems("hide", t), t && t.length) {
            var e = this.updateStagger();
            t.forEach(function(t, i) {
                t.stagger(i * e), t.hide();
            });
        }
    }, c.revealItemElements = function(t) {
        var e = this.getItems(t);
        this.reveal(e);
    }, c.hideItemElements = function(t) {
        var e = this.getItems(t);
        this.hide(e);
    }, c.getItem = function(t) {
        for (var e = 0; e < this.items.length; e++) {
            var i = this.items[e];
            if (i.element == t) return i;
        }
    }, c.getItems = function(t) {
        t = n.makeArray(t);
        var e = [];
        return t.forEach(function(t) {
            var i = this.getItem(t);
            i && e.push(i);
        }, this), e;
    }, c.remove = function(t) {
        var e = this.getItems(t);
        this._emitCompleteOnItems("remove", e), e && e.length && e.forEach(function(t) {
            t.remove(), n.removeFrom(this.items, t);
        }, this);
    }, c.destroy = function() {
        var t = this.element.style;
        t.height = "", t.position = "", t.width = "", this.items.forEach(function(t) {
            t.destroy();
        }), this.unbindResize();
        var e = this.element.outlayerGUID;
        delete f[e], delete this.element.outlayerGUID, h && h.removeData(this.element, this.constructor.namespace);
    }, s.data = function(t) {
        t = n.getQueryElement(t);
        var e = t && t.outlayerGUID;
        return e && f[e];
    }, s.create = function(t, e) {
        var i = r(s);
        return i.defaults = n.extend({}, s.defaults), n.extend(i.defaults, e), i.compatOptions = n.extend({}, s.compatOptions), 
        i.namespace = t, i.data = s.data, i.Item = r(o), n.htmlInit(i, t), h && h.bridget && h.bridget(t, i), 
        i;
    };
    var m = {
        ms: 1,
        s: 1e3
    };
    return s.Item = o, s;
}), function(t, e) {
    "function" == typeof define && define.amd ? define("isotope/js/item", [ "outlayer/outlayer" ], e) : "object" == typeof module && module.exports ? module.exports = e(require("outlayer")) : (t.Isotope = t.Isotope || {}, 
    t.Isotope.Item = e(t.Outlayer));
}(window, function(t) {
    "use strict";
    function e() {
        t.Item.apply(this, arguments);
    }
    var i = e.prototype = Object.create(t.Item.prototype), n = i._create;
    i._create = function() {
        this.id = this.layout.itemGUID++, n.call(this), this.sortData = {};
    }, i.updateSortData = function() {
        if (!this.isIgnored) {
            this.sortData.id = this.id, this.sortData["original-order"] = this.id, this.sortData.random = Math.random();
            var t = this.layout.options.getSortData, e = this.layout._sorters;
            for (var i in t) {
                var n = e[i];
                this.sortData[i] = n(this.element, this);
            }
        }
    };
    var o = i.destroy;
    return i.destroy = function() {
        o.apply(this, arguments), this.css({
            display: ""
        });
    }, e;
}), function(t, e) {
    "function" == typeof define && define.amd ? define("isotope/js/layout-mode", [ "get-size/get-size", "outlayer/outlayer" ], e) : "object" == typeof module && module.exports ? module.exports = e(require("get-size"), require("outlayer")) : (t.Isotope = t.Isotope || {}, 
    t.Isotope.LayoutMode = e(t.getSize, t.Outlayer));
}(window, function(t, e) {
    "use strict";
    function i(t) {
        this.isotope = t, t && (this.options = t.options[this.namespace], this.element = t.element, 
        this.items = t.filteredItems, this.size = t.size);
    }
    var n = i.prototype, o = [ "_resetLayout", "_getItemLayoutPosition", "_manageStamp", "_getContainerSize", "_getElementOffset", "needsResizeLayout", "_getOption" ];
    return o.forEach(function(t) {
        n[t] = function() {
            return e.prototype[t].apply(this.isotope, arguments);
        };
    }), n.needsVerticalResizeLayout = function() {
        var e = t(this.isotope.element), i = this.isotope.size && e;
        return i && e.innerHeight != this.isotope.size.innerHeight;
    }, n._getMeasurement = function() {
        this.isotope._getMeasurement.apply(this, arguments);
    }, n.getColumnWidth = function() {
        this.getSegmentSize("column", "Width");
    }, n.getRowHeight = function() {
        this.getSegmentSize("row", "Height");
    }, n.getSegmentSize = function(t, e) {
        var i = t + e, n = "outer" + e;
        if (this._getMeasurement(i, n), !this[i]) {
            var o = this.getFirstItemSize();
            this[i] = o && o[n] || this.isotope.size["inner" + e];
        }
    }, n.getFirstItemSize = function() {
        var e = this.isotope.filteredItems[0];
        return e && e.element && t(e.element);
    }, n.layout = function() {
        this.isotope.layout.apply(this.isotope, arguments);
    }, n.getSize = function() {
        this.isotope.getSize(), this.size = this.isotope.size;
    }, i.modes = {}, i.create = function(t, e) {
        function o() {
            i.apply(this, arguments);
        }
        return o.prototype = Object.create(n), o.prototype.constructor = o, e && (o.options = e), 
        o.prototype.namespace = t, i.modes[t] = o, o;
    }, i;
}), function(t, e) {
    "function" == typeof define && define.amd ? define("masonry/masonry", [ "outlayer/outlayer", "get-size/get-size" ], e) : "object" == typeof module && module.exports ? module.exports = e(require("outlayer"), require("get-size")) : t.Masonry = e(t.Outlayer, t.getSize);
}(window, function(t, e) {
    var i = t.create("masonry");
    return i.compatOptions.fitWidth = "isFitWidth", i.prototype._resetLayout = function() {
        this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), 
        this.measureColumns(), this.colYs = [];
        for (var t = 0; t < this.cols; t++) this.colYs.push(0);
        this.maxY = 0;
    }, i.prototype.measureColumns = function() {
        if (this.getContainerWidth(), !this.columnWidth) {
            var t = this.items[0], i = t && t.element;
            this.columnWidth = i && e(i).outerWidth || this.containerWidth;
        }
        var n = this.columnWidth += this.gutter, o = this.containerWidth + this.gutter, s = o / n, r = n - o % n, a = r && 1 > r ? "round" : "floor";
        s = Math[a](s), this.cols = Math.max(s, 1);
    }, i.prototype.getContainerWidth = function() {
        var t = this._getOption("fitWidth"), i = t ? this.element.parentNode : this.element, n = e(i);
        this.containerWidth = n && n.innerWidth;
    }, i.prototype._getItemLayoutPosition = function(t) {
        t.getSize();
        var e = t.size.outerWidth % this.columnWidth, i = e && 1 > e ? "round" : "ceil", n = Math[i](t.size.outerWidth / this.columnWidth);
        n = Math.min(n, this.cols);
        for (var o = this._getColGroup(n), s = Math.min.apply(Math, o), r = o.indexOf(s), a = {
            x: this.columnWidth * r,
            y: s
        }, u = s + t.size.outerHeight, h = this.cols + 1 - o.length, d = 0; h > d; d++) this.colYs[r + d] = u;
        return a;
    }, i.prototype._getColGroup = function(t) {
        if (2 > t) return this.colYs;
        for (var e = [], i = this.cols + 1 - t, n = 0; i > n; n++) {
            var o = this.colYs.slice(n, n + t);
            e[n] = Math.max.apply(Math, o);
        }
        return e;
    }, i.prototype._manageStamp = function(t) {
        var i = e(t), n = this._getElementOffset(t), o = this._getOption("originLeft"), s = o ? n.left : n.right, r = s + i.outerWidth, a = Math.floor(s / this.columnWidth);
        a = Math.max(0, a);
        var u = Math.floor(r / this.columnWidth);
        u -= r % this.columnWidth ? 0 : 1, u = Math.min(this.cols - 1, u);
        for (var h = this._getOption("originTop"), d = (h ? n.top : n.bottom) + i.outerHeight, l = a; u >= l; l++) this.colYs[l] = Math.max(d, this.colYs[l]);
    }, i.prototype._getContainerSize = function() {
        this.maxY = Math.max.apply(Math, this.colYs);
        var t = {
            height: this.maxY
        };
        return this._getOption("fitWidth") && (t.width = this._getContainerFitWidth()), 
        t;
    }, i.prototype._getContainerFitWidth = function() {
        for (var t = 0, e = this.cols; --e && 0 === this.colYs[e]; ) t++;
        return (this.cols - t) * this.columnWidth - this.gutter;
    }, i.prototype.needsResizeLayout = function() {
        var t = this.containerWidth;
        return this.getContainerWidth(), t != this.containerWidth;
    }, i;
}), function(t, e) {
    "function" == typeof define && define.amd ? define("isotope/js/layout-modes/masonry", [ "../layout-mode", "masonry/masonry" ], e) : "object" == typeof module && module.exports ? module.exports = e(require("../layout-mode"), require("masonry-layout")) : e(t.Isotope.LayoutMode, t.Masonry);
}(window, function(t, e) {
    "use strict";
    var i = t.create("masonry"), n = i.prototype, o = {
        _getElementOffset: !0,
        layout: !0,
        _getMeasurement: !0
    };
    for (var s in e.prototype) o[s] || (n[s] = e.prototype[s]);
    var r = n.measureColumns;
    n.measureColumns = function() {
        this.items = this.isotope.filteredItems, r.call(this);
    };
    var a = n._getOption;
    return n._getOption = function(t) {
        return "fitWidth" == t ? void 0 !== this.options.isFitWidth ? this.options.isFitWidth : this.options.fitWidth : a.apply(this.isotope, arguments);
    }, i;
}), function(t, e) {
    "function" == typeof define && define.amd ? define("isotope/js/layout-modes/fit-rows", [ "../layout-mode" ], e) : "object" == typeof exports ? module.exports = e(require("../layout-mode")) : e(t.Isotope.LayoutMode);
}(window, function(t) {
    "use strict";
    var e = t.create("fitRows"), i = e.prototype;
    return i._resetLayout = function() {
        this.x = 0, this.y = 0, this.maxY = 0, this._getMeasurement("gutter", "outerWidth");
    }, i._getItemLayoutPosition = function(t) {
        t.getSize();
        var e = t.size.outerWidth + this.gutter, i = this.isotope.size.innerWidth + this.gutter;
        0 !== this.x && e + this.x > i && (this.x = 0, this.y = this.maxY);
        var n = {
            x: this.x,
            y: this.y
        };
        return this.maxY = Math.max(this.maxY, this.y + t.size.outerHeight), this.x += e, 
        n;
    }, i._getContainerSize = function() {
        return {
            height: this.maxY
        };
    }, e;
}), function(t, e) {
    "function" == typeof define && define.amd ? define("isotope/js/layout-modes/vertical", [ "../layout-mode" ], e) : "object" == typeof module && module.exports ? module.exports = e(require("../layout-mode")) : e(t.Isotope.LayoutMode);
}(window, function(t) {
    "use strict";
    var e = t.create("vertical", {
        horizontalAlignment: 0
    }), i = e.prototype;
    return i._resetLayout = function() {
        this.y = 0;
    }, i._getItemLayoutPosition = function(t) {
        t.getSize();
        var e = (this.isotope.size.innerWidth - t.size.outerWidth) * this.options.horizontalAlignment, i = this.y;
        return this.y += t.size.outerHeight, {
            x: e,
            y: i
        };
    }, i._getContainerSize = function() {
        return {
            height: this.y
        };
    }, e;
}), function(t, e) {
    "function" == typeof define && define.amd ? define([ "outlayer/outlayer", "get-size/get-size", "desandro-matches-selector/matches-selector", "fizzy-ui-utils/utils", "isotope/js/item", "isotope/js/layout-mode", "isotope/js/layout-modes/masonry", "isotope/js/layout-modes/fit-rows", "isotope/js/layout-modes/vertical" ], function(i, n, o, s, r, a) {
        return e(t, i, n, o, s, r, a);
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("outlayer"), require("get-size"), require("desandro-matches-selector"), require("fizzy-ui-utils"), require("isotope/js/item"), require("isotope/js/layout-mode"), require("isotope/js/layout-modes/masonry"), require("isotope/js/layout-modes/fit-rows"), require("isotope/js/layout-modes/vertical")) : t.Isotope = e(t, t.Outlayer, t.getSize, t.matchesSelector, t.fizzyUIUtils, t.Isotope.Item, t.Isotope.LayoutMode);
}(window, function(t, e, i, n, o, s, r) {
    function a(t, e) {
        return function(i, n) {
            for (var o = 0; o < t.length; o++) {
                var s = t[o], r = i.sortData[s], a = n.sortData[s];
                if (r > a || a > r) {
                    var u = void 0 !== e[s] ? e[s] : e, h = u ? 1 : -1;
                    return (r > a ? 1 : -1) * h;
                }
            }
            return 0;
        };
    }
    var u = t.jQuery, h = String.prototype.trim ? function(t) {
        return t.trim();
    } : function(t) {
        return t.replace(/^\s+|\s+$/g, "");
    }, d = e.create("isotope", {
        layoutMode: "masonry",
        isJQueryFiltering: !0,
        sortAscending: !0
    });
    d.Item = s, d.LayoutMode = r;
    var l = d.prototype;
    l._create = function() {
        this.itemGUID = 0, this._sorters = {}, this._getSorters(), e.prototype._create.call(this), 
        this.modes = {}, this.filteredItems = this.items, this.sortHistory = [ "original-order" ];
        for (var t in r.modes) this._initLayoutMode(t);
    }, l.reloadItems = function() {
        this.itemGUID = 0, e.prototype.reloadItems.call(this);
    }, l._itemize = function() {
        for (var t = e.prototype._itemize.apply(this, arguments), i = 0; i < t.length; i++) {
            var n = t[i];
            n.id = this.itemGUID++;
        }
        return this._updateItemsSortData(t), t;
    }, l._initLayoutMode = function(t) {
        var e = r.modes[t], i = this.options[t] || {};
        this.options[t] = e.options ? o.extend(e.options, i) : i, this.modes[t] = new e(this);
    }, l.layout = function() {
        return !this._isLayoutInited && this._getOption("initLayout") ? void this.arrange() : void this._layout();
    }, l._layout = function() {
        var t = this._getIsInstant();
        this._resetLayout(), this._manageStamps(), this.layoutItems(this.filteredItems, t), 
        this._isLayoutInited = !0;
    }, l.arrange = function(t) {
        this.option(t), this._getIsInstant();
        var e = this._filter(this.items);
        this.filteredItems = e.matches, this._bindArrangeComplete(), this._isInstant ? this._noTransition(this._hideReveal, [ e ]) : this._hideReveal(e), 
        this._sort(), this._layout();
    }, l._init = l.arrange, l._hideReveal = function(t) {
        this.reveal(t.needReveal), this.hide(t.needHide);
    }, l._getIsInstant = function() {
        var t = this._getOption("layoutInstant"), e = void 0 !== t ? t : !this._isLayoutInited;
        return this._isInstant = e, e;
    }, l._bindArrangeComplete = function() {
        function t() {
            e && i && n && o.dispatchEvent("arrangeComplete", null, [ o.filteredItems ]);
        }
        var e, i, n, o = this;
        this.once("layoutComplete", function() {
            e = !0, t();
        }), this.once("hideComplete", function() {
            i = !0, t();
        }), this.once("revealComplete", function() {
            n = !0, t();
        });
    }, l._filter = function(t) {
        var e = this.options.filter;
        e = e || "*";
        for (var i = [], n = [], o = [], s = this._getFilterTest(e), r = 0; r < t.length; r++) {
            var a = t[r];
            if (!a.isIgnored) {
                var u = s(a);
                u && i.push(a), u && a.isHidden ? n.push(a) : u || a.isHidden || o.push(a);
            }
        }
        return {
            matches: i,
            needReveal: n,
            needHide: o
        };
    }, l._getFilterTest = function(t) {
        return u && this.options.isJQueryFiltering ? function(e) {
            return u(e.element).is(t);
        } : "function" == typeof t ? function(e) {
            return t(e.element);
        } : function(e) {
            return n(e.element, t);
        };
    }, l.updateSortData = function(t) {
        var e;
        t ? (t = o.makeArray(t), e = this.getItems(t)) : e = this.items, this._getSorters(), 
        this._updateItemsSortData(e);
    }, l._getSorters = function() {
        var t = this.options.getSortData;
        for (var e in t) {
            var i = t[e];
            this._sorters[e] = f(i);
        }
    }, l._updateItemsSortData = function(t) {
        for (var e = t && t.length, i = 0; e && e > i; i++) {
            var n = t[i];
            n.updateSortData();
        }
    };
    var f = function() {
        function t(t) {
            if ("string" != typeof t) return t;
            var i = h(t).split(" "), n = i[0], o = n.match(/^\[(.+)\]$/), s = o && o[1], r = e(s, n), a = d.sortDataParsers[i[1]];
            return t = a ? function(t) {
                return t && a(r(t));
            } : function(t) {
                return t && r(t);
            };
        }
        function e(t, e) {
            return t ? function(e) {
                return e.getAttribute(t);
            } : function(t) {
                var i = t.querySelector(e);
                return i && i.textContent;
            };
        }
        return t;
    }();
    d.sortDataParsers = {
        parseInt: function(t) {
            return parseInt(t, 10);
        },
        parseFloat: function(t) {
            return parseFloat(t);
        }
    }, l._sort = function() {
        var t = this.options.sortBy;
        if (t) {
            var e = [].concat.apply(t, this.sortHistory), i = a(e, this.options.sortAscending);
            this.filteredItems.sort(i), t != this.sortHistory[0] && this.sortHistory.unshift(t);
        }
    }, l._mode = function() {
        var t = this.options.layoutMode, e = this.modes[t];
        if (!e) throw new Error("No layout mode: " + t);
        return e.options = this.options[t], e;
    }, l._resetLayout = function() {
        e.prototype._resetLayout.call(this), this._mode()._resetLayout();
    }, l._getItemLayoutPosition = function(t) {
        return this._mode()._getItemLayoutPosition(t);
    }, l._manageStamp = function(t) {
        this._mode()._manageStamp(t);
    }, l._getContainerSize = function() {
        return this._mode()._getContainerSize();
    }, l.needsResizeLayout = function() {
        return this._mode().needsResizeLayout();
    }, l.appended = function(t) {
        var e = this.addItems(t);
        if (e.length) {
            var i = this._filterRevealAdded(e);
            this.filteredItems = this.filteredItems.concat(i);
        }
    }, l.prepended = function(t) {
        var e = this._itemize(t);
        if (e.length) {
            this._resetLayout(), this._manageStamps();
            var i = this._filterRevealAdded(e);
            this.layoutItems(this.filteredItems), this.filteredItems = i.concat(this.filteredItems), 
            this.items = e.concat(this.items);
        }
    }, l._filterRevealAdded = function(t) {
        var e = this._filter(t);
        return this.hide(e.needHide), this.reveal(e.matches), this.layoutItems(e.matches, !0), 
        e.matches;
    }, l.insert = function(t) {
        var e = this.addItems(t);
        if (e.length) {
            var i, n, o = e.length;
            for (i = 0; o > i; i++) n = e[i], this.element.appendChild(n.element);
            var s = this._filter(e).matches;
            for (i = 0; o > i; i++) e[i].isLayoutInstant = !0;
            for (this.arrange(), i = 0; o > i; i++) delete e[i].isLayoutInstant;
            this.reveal(s);
        }
    };
    var c = l.remove;
    return l.remove = function(t) {
        t = o.makeArray(t);
        var e = this.getItems(t);
        c.call(this, t);
        for (var i = e && e.length, n = 0; i && i > n; n++) {
            var s = e[n];
            o.removeFrom(this.filteredItems, s);
        }
    }, l.shuffle = function() {
        for (var t = 0; t < this.items.length; t++) {
            var e = this.items[t];
            e.sortData.random = Math.random();
        }
        this.options.sortBy = "random", this._sort(), this._layout();
    }, l._noTransition = function(t, e) {
        var i = this.options.transitionDuration;
        this.options.transitionDuration = 0;
        var n = t.apply(this, e);
        return this.options.transitionDuration = i, n;
    }, l.getFilteredItemElements = function() {
        return this.filteredItems.map(function(t) {
            return t.element;
        });
    }, d;
});