const notify = (option) => {
    const {
        type, // alert | success | error | warning | info
        title, // "Alert"
        message, // "Notify.js Demo. Super simple Notify plugin."
        position, /*: {
        x, // right | left | center
        y // top | bottom | center
      }  */
        icon, // '<img src="./success.gif"/>' |  '<i data-icon="suss"><i/>' | name icon form tasio-icon 
        autoHide, // true | false | number ms
        size, // small | medium | large
        overlay, // true | false
        overflowHide, // true | false
        spacing, // number px
        theme, // light | dark
        closeBtn,
        onShow, // function
        onClick, // function
        onHide // function
    } = option;

    let _Interval;
    let _Element;
    let _position = {
        x: "right",
        y: "bottom"
    };

    const _Container = document.body;

    const _Create = () => {
        _Element = document.createElement("div");
        _Element.classList.add("notify", type.toLowerCase().trim());
        
        size === true ? _Element.classList.add(`notify-${size}`): null;
        overlay === true ? _Element.classList.add("notify-overlay") : null;
        overflowHide === true ? _Element.classList.add("notify-overflow-hide") : null;
        spacing != null ? _Element.style.margin = `${spacing}px` : null;
        theme === "dark" ? _Element.classList.add("notify-dark") : null;

        if (position != null) {
            _position = position;
            if (position.x != null) {
                _Element.classList.add(`notify-${position.x}`);
            }
            if (position.y != null) {
                _Element.classList.add(`notify-${position.y}`);
            }
        } else {
            _Element.style.right = "10px";
            _Element.style.bottom = "10px";
            _Element.classList.add("notify-right-bottom");
        }

        if (closeBtn === true) {
            const _CloseButton = document.createElement("div");
            _CloseButton.classList.add("notify-close-btn");
            _CloseButton.addEventListener("click", () => {
                _Close();
                _CheckPosition();
                onHide();
            });
            _Element.appendChild(_CloseButton);
        }

        _Element.addEventListener("click", () => {
            _Close();
            _CheckPosition();
            if (onClick != null) onClick();
        });


        if (icon != null) {
            const _Icon = document.createElement("div");
            _Icon.classList.add("notify-icon");
            _Icon.innerHTML = icon;
            _Element.appendChild(_Icon);
        }

        const innerSnack = document.createElement("div");
        innerSnack.classList.add("notify-text");

        const _Title = document.createElement("h3");
        _Title.classList.add("js-tasio__title");
        _Title.textContent = title;
        innerSnack.appendChild(_Title);

        const _Message = document.createElement("span");
        _Message.classList.add("js-tasio__message");
        _Message.textContent = message;
        innerSnack.appendChild(_Message);

        _Element.style.transform = "translateY(-100%)";
        _Element.style.opacity = "0";
        _Element.style.marginRight = "10px";
        _Element.style.marginBottom = "10px";

        _Element.appendChild(innerSnack);
        _Container.appendChild(_Element);

        if (onShow != null) onShow();

        setTimeout(() => {
            _Element.style.transition = "transform 0.5s, opacity 0.5s";
            _Element.style.transform = "translateY(0)";
            _Element.style.opacity = "1";
            if (autoHide === true) {
                _Interval = setTimeout(_Close, 2500);
            } else if (autoHide !== false) {
                _Interval = setTimeout(_Close, autoHide);
            }
            _CheckPosition();
        }, 100);
    };

    const _CheckPosition = () => {
        const notifElements = document.querySelectorAll(".notify");
        let currentPosition = 0;
      
        if (_position.y === "center") {
          const containerHeight = _Container.offsetHeight;
          const totalHeight = Array.from(notifElements).reduce(
            (total, element) => total + element.offsetHeight + parseInt(getComputedStyle(element).marginTop) + parseInt(getComputedStyle(element).marginBottom),
            0
          );
      
          currentPosition = (containerHeight - totalHeight) / 2;
        } else if (_position.y === "bottom") {
          currentPosition = _Container.offsetHeight;
        }
      
        notifElements.forEach((e, i) => {
          const elementHeight = e.offsetHeight;
          const marginTop = parseInt(getComputedStyle(e).marginTop);
          const marginBottom = parseInt(getComputedStyle(e).marginBottom);
      
          e.style[_position.y] = `${currentPosition}px`;
          currentPosition += elementHeight + marginTop + marginBottom;
        });
      };

    const _Close = () => {
        _Element.style.transition = "transform 0.5s, opacity 0.5s";
        _Element.style.transform = "translateY(-100%)";
        _Element.style.opacity = "0";
        setTimeout(() => {
            _Container.removeChild(_Element);
            _CheckPosition();
        }, 500);
    };

    const _CleanAll = () => {
        const notifElements = document.querySelectorAll(".notify");
        notifElements.forEach((e) => {
            e.style.transition = "transform 0.5s, opacity 0.5s";
            e.style.transform = "translateY(-100%)";
            e.style.opacity = "0";
            setTimeout(() => {
                _Container.removeChild(e);
                _CheckPosition();
            }, 500);
        });
    };

    _Create();

    return {
        open: () => {
            _Element.addEventListener("transitioned", () => {
                _Element.removeEventListener("transitioned", arguments.callee);
                _Element.style.height = null;
            });
        },
        close: _Close,
        cleanAll: _CleanAll
    };
};
