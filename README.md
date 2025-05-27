# Characreate

<div align="center">
  <img src="/public/img/logo.webp" alt="Characreate Logo" width="150">
  <h3>A Simple Persona Generator</h3>
  <p>Create realistic user personas for your projects with AI-powered insights</p>

  [![Vue.js](https://img.shields.io/badge/Vue.js-85%25-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
  [![JavaScript](https://img.shields.io/badge/JavaScript-5.2%25-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![Nuxt.js](https://img.shields.io/badge/Nuxt.js-3-00DC82?style=flat-square&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
  [![PrimeVue](https://img.shields.io/badge/PrimeVue-3-4A6CF7?style=flat-square&logo=prime&logoColor=white)](https://primevue.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

## 🎭 About Characreate

> "The purpose of personas is to create reliable and realistic representations of your key audience segments for reference."

Characreate is a simple yet powerful persona generator built as a school project. It uses AI to create detailed user personas that help designers and developers understand their target audience better. With an intuitive interface and robust features, Characreate streamlines the process of developing user personas for any project.

## ✨ Features

- 🤖 **AI-Powered Generation**: Utilizes Qwen2.5-72B-Instruct model via the deepinfra API to create detailed personas
- 🔒 **Server-Side Processing**: Secure API calls with rate limiting with automatic reset and protection from external access
- 🎨 **Custom Personas**: Define project ideas, target groups, demographics, and goals
- 📊 **Rich Persona Details**: Generate comprehensive profiles including:
  - Demographics (name, age, gender, location)
  - Occupation and biography
  - Hobbies and interests
  - Technical experience
  - Motivation and goals
  - Challenges and pain points
- 🖼️ **Export as Images**: Save your personas as PNG files for presentations or documentation
- 🎭 **Visual Representation**: Automatically generated profile images for each persona
- 🎨 **Elegant UI**: Beautiful, responsive interface built with PrimeVue and Tailwind CSS

## 🚀 Tech Stack

- **[Nuxt](https://nuxt.com/)**: Vue.js framework for building modern web applications
- **[Vue](https://vuejs.org/)**: Progressive JavaScript framework for building user interfaces
- **[PrimeVue](https://primevue.org/)**: Comprehensive UI component library for Vue
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development
- **HTML-to-Image**: For exporting persona cards as PNG files

## 🛠️ Setup and Installation

### Prerequisites

- Node.js (v16 or higher)
- NPM or another package manager (Yarn, PNPM, Bun)
- Redis server (for rate limiting and usage tracking)
- Deepinfra API key (for AI persona generation)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
API_URL=<deppinfra-api-endpoint>
API_KEY=<deepinfra-api-key>
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Locally preview production build
npm run preview
```

## 🖥️ How It Works

1. **Check Weekly Usage**: View the current persona generation usage and remaining quota
2. **Input Project Details**: Enter your project idea, target group, and persona characteristics
3. **Define Goals**: Add relevant goals for your persona
4. **Generate Persona**: Let the AI create a detailed persona based on your inputs
5. **Review and Export**: View the generated persona card and export it as a PNG image

## 🔒 Rate Limiting

The application includes a built-in weekly rate limit for persona generation:

- **Default Limit**: 20 personas per week
- **Reset**: Automatically resets every 7 days
- **Protection**: API endpoints are protected from external access

## 🤝 Contributing

This project was created as a school assignment, but contributions are welcome! Feel free to open issues or submit pull requests.

## 📝 License

[MIT License](LICENSE)
