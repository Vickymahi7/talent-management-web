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
            :root {
              --res-template-width: 1000px;
              --res-template-height: 1350px;
              --text-color: #000;
              --header-bg: #1f7e6c;
              --header-text-color: #fff;
              --heading-color: #000;
              --sub-heading-color: var(--header-bg);
              --muted-color: #777777;
              --profile-title-color: var(--header-text-color);
              --profile-title-size: 14px;
              --content-padding: 15px;
              --heading-size: 18px;
              --profile-name-color: #fff;
              --left-section-color: #7a7a7a;
              --right-section-color: #000;
              --left-section-bg: #e9e9e9;
              --right-section-bg: #fff;
              --std-margin-bottom: 10px;
              --heading-margin-top: 10px;
              --heading-margin-bottom: 10px;
              --boldColor: #4a4e51;
            }
            
            *,
            *::after,
            *::before {
              box-sizing: border-box;
            }
            
            .ms-2 {
              margin-left: 0.5rem !important;
            }
            
            .me-2 {
              margin-right: 0.5rem !important;
            }

            .bold {
              color: #4a4e51;
              font-weight: 400;
            }
            
            .resume-wrapper {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
              font-size: 12px;
              line-height: 1.5em;
              width: var(--res-template-width);
              min-height: var(--res-template-height);
              margin-left: auto;
              margin-right: auto;
              display: flex;
              flex-direction: column;
            }
            
            a {
              text-decoration: none;
            }
            
            .muted-text {
              color: var(--muted-color);
            }
            
            .bold {
              color: var(--boldColor);
              font-weight: 400;
            }
            
            h1 {
              font-size: 3.5em;
              text-transform: uppercase;
              line-height: 1em;
              letter-spacing: 2px;
              color: var(--profile-name-color);
              margin-top: 0;
              margin-bottom: 0;
            }
            
            h2 {
              font-size: var(--heading-size);
              text-transform: uppercase;
              line-height: 1;
              letter-spacing: 1px;
              color: var(--heading-color);
              position: relative;
              margin-top: var(--heading-margin-top);
              margin-bottom: var(--heading-margin-bottom);
            }
            
            h2 .heading {
              position: relative;
            }
            
            h2 .heading::before {
              position: absolute;
              content: "";
              width: 70%;
              height: 3px;
              background-color: var(--header-bg);
              bottom: -2px;
            }
            
            h3 {
              color: var(--sub-heading-color);
              text-transform: uppercase;
              font-size: 16px;
              margin-bottom: 0;
              font-weight: 500;
              margin-top: 0;
            }
            
            h5 {
              font-size: 12px;
              margin-bottom: var(--std-margin-bottom);
              margin-top: 0;
            }
            
            h6 {
              font-size: 12px;
              margin-bottom: 3px;
              margin-top: 0;
            }
            
            p {
              margin-bottom: var(--std-margin-bottom);
              margin-top: 0;
            }
            
            header {
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 10px 50px;
              background-color: var(--header-bg);
              color: var(--header-text-color);
            }
            
            header.no-picture {
              justify-content: left;
              padding: var(--content-padding);
              height: 200px;
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
              margin: 0 auto;
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
              font-size: var(--profile-title-size);
              color: var(--profile-title-color);
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
              color: var(--left-section-color);
              background-color: var(--left-section-bg);
              padding: var(--content-padding);
            }
            
            .left-section ul {
              margin: 0;
            }
            
            .left-section li {
              margin-bottom: var(--std-margin-bottom);
            }
            
            .left-section .contact-info {
              font-weight: bold;
              font-style: italic;
              color: var(--text-color);
            }
            
            .left-section .badge-list .badge-item {
              padding: 2px 5px;
              color: var(--header-text-color);
              background-color: var(--header-bg);
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
              color: var(--text-color);
            }
            
            .left-section .education-info p {
              margin: 0;
            }
            
            .left-section .education-info .education-detail {
              margin-bottom: var(--std-margin-bottom);
            }
            
            .right-section {
              flex: 70%;
              color: var(--right-section-color);
              background-color: var(--right-section-bg);
              padding: var(--content-padding);
            }
            
            .right-section .experience .experience-company-wrapper {
              margin-bottom: var(--std-margin-bottom);
            }
            
            .right-section .experience .experience-company {
              font-weight: bold;
              text-transform: uppercase;
            }
            
            .right-section .project-title-wrapper {
              margin-bottom: var(--std-margin-bottom);
            }
            
            .right-section .project-title {
              text-transform: uppercase;
              font-weight: bold;
            }
            
            .right-section .project-role,
            .right-section .project-technologies {
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
