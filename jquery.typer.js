(function ($) {
    $.fn.typer = function (text, options) {
        options = $.extend({}, {
            char: '',
            delay: 5000,
            duration: 800,
            endless: true,
            onType: $.noop,
            afterAll: $.noop,
            afterPhrase: $.noop
        }, options || text);

        text = $.isPlainObject(text) ? options.text : text;
        text = $.isArray(text) ? text : text.split(" ");

        return this.each(function () {
            var elem = $(this),
                isVal = {
                    input: 1,
                    textarea: 1
                } [this.tagName.toLowerCase()],
                isTag = false,
                timer,
                c = 0;

            (function typetext(i) {
                var e = ({
                        string: 1,
                        number: 1
                    } [typeof text] ? text : text[i]) + '',
                    char = e.substr(c++, 1);

                if (char === '<') {
                    isTag = true;
                }
                if (char === '>') {
                    isTag = false;
                }
                elem[isVal ? "val" : "html"](e.substr(0, c) + ($.isFunction(options.char) ? options.char() : options.char || ' '));
                if (c <= e.length) {
                    if (isTag) {
                        typetext(i);
                    } else {
                        timer = setTimeout(typetext, options.duration / 10, i);
                    }
                    options.onType(timer);
                } else {
                    c = 0;
                    i++;

                    if (i === text.length && !options.endless) {
                        return;
                    } else if (i === text.length) {
                        i = 0;
                    }
                    timer = setTimeout(typetext, options.delay, i);
                    if (i === text.length - 1) options.afterAll(timer);
                    options.afterPhrase(timer);
                }
            })(0);
        });
    };
}(jQuery));