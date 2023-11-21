function addStyles(win, styles) {
  styles.forEach((style) => {
    let link = win.document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", style);

    link.onload = () => {
      console.log(`${style} has been loaded`);
      // You can add additional logic here if needed
    };

    win.document.getElementsByTagName("head")[0].appendChild(link);
  });
}

const VueHtmlToPaper = {
  install(app, options = {}) {
    app.config.globalProperties.$htmlToPaper = (
      el,
      localOptions,
      cb = () => true
    ) => {
      let defaultStyles = [];
      let { styles = defaultStyles } = options;

      // If has localOptions
      // TODO: improve logic
      if (localOptions) {
        if (localOptions.styles) styles = localOptions.styles;
      }

      const element = window.document.getElementById(el);

      if (!element) {
        alert(`Element to print #${el} not found!`);
        return;
      }

      const existingIframe = document.getElementById("ifprint");
      if (existingIframe) {
        document.body.removeChild(existingIframe);
      }

      var ifprint = document.createElement("iframe");
      document.body.appendChild(ifprint);
      ifprint.setAttribute("style", "height:0;width:0;");

      const win = ifprint.contentWindow;

      const htmlContent = element.innerHTML;

      const htmlDocument = win.document.createElement("html");
      const headElement = win.document.createElement("head");
      const bodyElement = win.document.createElement("body");

      // Copy styles to the new document
      // addStyles(win, styles);
      let link = win.document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("type", "text/css");
      link.setAttribute("href", styles[0]);

      // Append elements to the new document
      headElement.innerHTML = `
        <title>${window.document.title}</title>
      `;
      headElement.appendChild(link);
      bodyElement.innerHTML = htmlContent;

      htmlDocument.appendChild(headElement);
      htmlDocument.appendChild(bodyElement);

      // Clear existing content in the iframe
      win.document.open();
      win.document.write(htmlDocument.outerHTML);
      // win.document.close();

      setTimeout(() => {
        win.document.close();
        win.focus();
        win.print();
        win.close();
        document.body.removeChild(ifprint);
        cb();
      }, 1);

      return true;
    };
  },
};

export default VueHtmlToPaper;
