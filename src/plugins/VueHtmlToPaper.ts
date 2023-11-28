function addStyles(win, styles) {
  styles.forEach((style) => {
    const link = win.document.createElement("link");
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
      const defaultStyles = [];
      let { styles = defaultStyles } = options as any;

      // If has localOptions
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

      const ifprint = document.createElement("iframe");
      document.body.appendChild(ifprint);
      ifprint.setAttribute("style", "height:0;width:0;");

      const win = ifprint.contentWindow;

      addStyles(win, styles);

      win?.document.write(`
        <html>
          <head>
            <title>${window.document.title}</title>
            <style>
            .resume-wrapper {
              font-size: 12px;
              line-height: 1.5em;
              width: 1000px;
              min-height: 1350px;
              margin-left: auto;
              margin-right: auto;
              display: flex;
              flex-direction: column;
            }
            a {
              text-decoration: none;
            }
            .muted-text {
              color: #777777;
            }
            .bold {
              color: #4a4e51;
              font-weight: 400;
            }
            h1 {
              font-size: 3.5em;
              text-transform: uppercase;
              line-height: 1em;
              letter-spacing: 2px;
              color: #fff;
            }
            h2 {
              font-size: 18px;
              text-transform: uppercase;
              line-height: 1;
              letter-spacing: 1px;
              color: #000;
              position: relative;
              margin-top: 10px;
              margin-bottom: 10px;
            }
            h2 .heading {
              position: relative;
            }
            h2 .heading::before {
              position: absolute;
              content: "";
              width: 70%;
              height: 3px;
              background-color: #1f7e6c;
              bottom: -2px;
            }
            h3 {
              color: #1f7e6c;
              text-transform: uppercase;
              font-size: 16px;
              margin-bottom: 0;
              font-weight: 500;
            }
            h5 {
              font-size: 12px;
              margin-bottom: 5px;
            }
            p {
              margin-bottom: 5px;
            }
            header {
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 10px 50px;
              background-color: #1f7e6c;
              color: #fff;
            }
            header .picture-resume-wrapper {
              display: block;
              float: left;
            }
            header .picture-resume-wrapper .picture-resume {
              width: 200px;
              height: 200px;
              background-size: cover;
              border-radius: 50%;
              margin-right: 0px;
              display: table;
              position: relative;
              vertical-align: middle;
            }
            header .picture-resume-wrapper .picture-resume span {
              display: table-cell;
              vertical-align: middle;
              position: relative;
              z-index: 10;
              text-align: center;
            }
            header .picture-resume-wrapper .picture-resume img {
              border-radius: 50%;
              width: 150px;
              height: 150px;
            }
            header .name-wrapper {
              text-align: left;
            }
            header .name-wrapper .profile-title {
              font-size: 14px;
              color: #fff;
            }
            header .about {
              font-style: italic;
            }
            .resume-body {
              flex: 1;
              display: flex;
              text-align: left;
              height: 100%;
            }
            .left-section {
              flex: 40%;
              color: #7a7a7a;
              background-color: #e9e9e9;
              padding: 15px;
            }
            .left-section ul {
              margin: 0;
            }
            .left-section li {
              margin-bottom: 5px;
            }
            .left-section .contact-info {
              font-weight: bold;
              font-style: italic;
              color: #000;
            }
            .left-section .badge-list .badge-item {
              padding: 2px 5px;
              color: #fff;
              background-color: #1f7e6c;
              border-radius: 5px;
              display: inline-block;
              margin-right: 3px;
              margin-bottom: 3px;
            }
            .left-section .list-content {
              text-align: left;
              margin-top: 13px;
            }
            .left-section .education-info h6 {
              font-size: 12px;
              font-style: italic;
              margin-bottom: 3px;
              color: #000;
            }
            .left-section .education-info p {
              margin: 0;
            }
            .left-section .education-info .education-detail {
              margin-bottom: 5px;
            }
            .right-section {
              flex: 70%;
              color: #000;
              background-color: #fff;
              padding: 15px;
            }
            .right-section .experience .experience-company-wrapper {
              margin-bottom: 5px;
            }
            .right-section .experience .experience-company {
              font-weight: bold;
              text-transform: uppercase;
            }
            .right-section .project-title-wrapper {
              margin-bottom: 5px;
            }
            .right-section .project-title {
              text-transform: uppercase;
              font-weight: bold;
            }
            .right-section .project-role, .right-section .project-technologies {
              font-style: italic;
            }
          </style>            
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `);

      setTimeout(() => {
        win?.document.close();
        win?.focus();
        win?.print();
        win?.close();
        document.body.removeChild(ifprint);
        cb();
      }, 1);

      return true;
    };
  },
};

export default VueHtmlToPaper;
