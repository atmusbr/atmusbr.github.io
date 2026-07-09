(function () {
  var PREFIX = "atm";
  var STYLES = ["stroke", "solid", "duotone", "twotone", "bulk"];
  var STYLE_SET = new Set(STYLES);
  var PROCESSED_ATTR = "data-atm-processed";

  function getBaseUrl() {
    var script = document.currentScript;

    if (script && script.src) {
      return new URL("./", script.src).href;
    }

    var scripts = document.getElementsByTagName("script");

    for (var index = scripts.length - 1; index >= 0; index--) {
      var src = scripts[index].src || "";

      if (src.indexOf("atmus-icons.js") !== -1 || src.indexOf("atmus-icons.min.js") !== -1) {
        return new URL("./", src).href;
      }
    }

    return "/assets/icons/";
  }

  function toSvgSymbolId(style, iconName) {
    return PREFIX + "-" + style + "-" + iconName.replace(/[^a-zA-Z0-9_-]/g, function (char) {
      return "_u" + char.codePointAt(0).toString(16) + "_";
    });
  }

  function getIconData(element) {
    var classes = Array.prototype.slice.call(element.classList || []);

    var style = "solid";
    var iconName = null;

    for (var index = 0; index < classes.length; index++) {
      var className = classes[index];

      if (!className.startsWith(PREFIX + "-")) {
        continue;
      }

      var name = className.slice(PREFIX.length + 1);

      if (STYLE_SET.has(name)) {
        style = name;
        continue;
      }

      if (!iconName) {
        iconName = name;
      }
    }

    if (!iconName) {
      return null;
    }

    return {
      style: style,
      iconName: iconName
    };
  }

  function copyAttributes(from, to) {
    for (var index = 0; index < from.attributes.length; index++) {
      var attr = from.attributes[index];

      if (attr.name === "class") {
        continue;
      }

      if (attr.name === PROCESSED_ATTR) {
        continue;
      }

      to.setAttribute(attr.name, attr.value);
    }
  }

  function renderIcon(element, baseUrl) {
    if (!element || element.getAttribute(PROCESSED_ATTR)) {
      return;
    }

    if (element.tagName && element.tagName.toLowerCase() === "svg") {
      return;
    }

    var data = getIconData(element);

    if (!data) {
      return;
    }

    var symbolId = toSvgSymbolId(data.style, data.iconName);
    var spriteUrl = new URL("sprites/sprite-" + data.style + ".svg#" + symbolId, baseUrl).href;

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");

    copyAttributes(element, svg);

    svg.setAttribute(PROCESSED_ATTR, "true");
    svg.setAttribute("aria-hidden", element.getAttribute("aria-hidden") || "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("class", (element.getAttribute("class") || "") + " atm-svg");

    use.setAttribute("href", spriteUrl);
    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", spriteUrl);

    svg.appendChild(use);
    element.replaceWith(svg);
  }

  function i2svg(root) {
    var baseUrl = getBaseUrl();
    var scope = root || document;
    var icons = scope.querySelectorAll("." + PREFIX + ":not([" + PROCESSED_ATTR + "])");

    for (var index = 0; index < icons.length; index++) {
      renderIcon(icons[index], baseUrl);
    }
  }

  function observe() {
    if (!("MutationObserver" in window)) {
      return;
    }

    var observer = new MutationObserver(function (mutations) {
      for (var mutationIndex = 0; mutationIndex < mutations.length; mutationIndex++) {
        var mutation = mutations[mutationIndex];

        for (var nodeIndex = 0; nodeIndex < mutation.addedNodes.length; nodeIndex++) {
          var node = mutation.addedNodes[nodeIndex];

          if (!node || node.nodeType !== 1) {
            continue;
          }

          if (node.matches && node.matches("." + PREFIX + ":not([" + PROCESSED_ATTR + "])")) {
            i2svg(node.parentNode || document);
            continue;
          }

          if (node.querySelectorAll) {
            i2svg(node);
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  window.AtmusIcons = window.AtmusIcons || {};
  window.AtmusIcons.i2svg = i2svg;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      i2svg(document);
      observe();
    });
  } else {
    i2svg(document);
    observe();
  }
})();