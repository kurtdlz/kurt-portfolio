# Kurt Aaron Delizo | Data Analyst Portfolio

Personal portfolio website of **Kurt Aaron Delizo**, a Computer Engineering graduate and aspiring Data Analyst. It showcases my education and training, technical skills, analytics projects, and DataCamp certifications, and gives recruiters a quick way to reach me.

**Live site:** https://kurtdelizo.vercel.app

<!-- Replace the link above with your Vercel URL after deploying.
     Optional: add a screenshot, e.g. ![Portfolio preview](docs/screenshot.png) -->

## Highlights

- Clean, minimal black-and-white design with a light and dark theme
- Fully responsive, from large desktops down to phones
- Project showcase with the tools used in each project and links to the source on GitHub
- DataCamp certifications with direct verification links
- Resume download and a contact form that sends messages straight to my inbox
- Built with plain HTML, CSS and JavaScript: no frameworks and no build step

## Sections

| Section | What it shows |
| --- | --- |
| Home | Introduction, call-to-action buttons, resume download, LinkedIn and GitHub links |
| Experience & Education | DataCamp Scholar (Data Engineering Pilipinas Scholarship Program), Siemens Energy, Inc. on-the-job training, BS Computer Engineering |
| Skills & Technologies | Python, SQL, PostgreSQL, Excel, Power BI, Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn, Jupyter, Git, GitHub |
| Projects | Five analytics, machine learning and data engineering projects (see below) |
| Certifications | DataCamp Certified Data Analyst, Python Data and SQL Associate certificates |
| Contact | Email, LinkedIn, GitHub and a contact form |

## Projects featured

| Project | Type | Tools | Source |
| --- | --- | --- | --- |
| E-commerce Sales Analysis | Sales dashboard | Power BI, Power Query, DAX, Data Modeling | [Repository](https://github.com/kurtdlz/Ecommerce-Sales-Analysis) |
| Clinic Appointments ETL Pipeline | Data Engineering (ETL) | Python, PostgreSQL, Pandas, Numpy | [Repository](https://github.com/kurtdlz/clinic-appointments-etl-pipeline) |
| Employee Attrition Dashboard | HR data analysis | Power BI, Excel, DAX | [Repository](https://github.com/kurtdlz/HR-Data-Analysis) |
| Healthcare Data EDA | Exploratory data analysis | Python, Pandas, Seaborn | [Repository](https://github.com/kurtdlz/Healthcare-Data-Analysis) |
| Sleep Disorder Prediction | Machine learning | Python, Scikit-learn, Matplotlib | [Repository](https://github.com/kurtdlz/Sleep-Disorder-Classification) |


## Certifications

- [DataCamp Certified Data Analyst Associate](https://www.datacamp.com/certificate/DAA0015226911653), August 2026
- [DataCamp Certified Python Data Associate](https://www.datacamp.com/certificate/PDA0014897293163), August 2026
- [DataCamp Certified SQL Associate](https://www.datacamp.com/certificate/SQA0010798197187), October 2026

## Built with

- **HTML5** for structure
- **CSS3** with custom properties for theming (light and dark mode)
- **Vanilla JavaScript** for the theme toggle, scroll animations, resume download and form handling
- **[Formspree](https://formspree.io)** for the contact form
- **[Vercel](https://vercel.com)** for hosting

## Project structure

```
.
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── resume/
│   └── Kurt-Delizo-Resume.pdf
└── images/
    ├── profile.jpg
    ├── employee-attrition-dashboard.jpg
    ├── ecommerce-sales-dashboard.jpg
    ├── healthcare-data-analysis.png
    ├── sleep-disorder-prediction.png
    └── clinic-etl-pipeline.png
    └── certificates/
```

## Run locally

No installation is needed.

1. Clone the repository:
   ```bash
   git clone https://github.com/kurtdlz/<repository-name>.git
   cd <repository-name>
   ```
2. Open `index.html` in your browser, or use the **Live Server** extension in Visual Studio Code for automatic reloading.

## Deploy

The site is static, so it needs no build command.

1. Push the project to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Leave the build command and output directory empty (Framework Preset: **Other**), then click **Deploy**.

Every push to the main branch redeploys the site automatically.

## Customize

- **Content:** edit the text, links and images in `index.html`.
- **Colors and layout:** change the CSS variables at the top of `css/style.css`.
- **Contact form:** replace the Formspree endpoint in the `<form id="contactForm">` tag with your own form URL.
- **Resume:** replace the PDF in `resume/` and keep the same file name, or update the link in `index.html`.

## Contact

- Email: [kurtmarasigandelizo@gmail.com](mailto:kurtmarasigandelizo@gmail.com)
- LinkedIn: [kurt-aaron-delizo-878467417](https://www.linkedin.com/in/kurt-aaron-delizo-878467417)
- GitHub: [kurtdlz](https://github.com/kurtdlz)