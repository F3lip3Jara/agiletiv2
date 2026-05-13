<div align="center">
  <h1>🚀 Agileti ERP - Frontend App</h1>
  <p><strong>A Modern, Responsive, and Scalable Enterprise Management Interface</strong></p>
  
  [![Angular](https://img.shields.io/badge/Angular-17.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.2-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![PrimeNG](https://img.shields.io/badge/PrimeNG-17.2-2196F3?style=for-the-badge&logo=primeng&logoColor=white)](https://primeng.org/)
  [![NgRx](https://img.shields.io/badge/NgRx-19.0-BA2BD2?style=for-the-badge&logo=ngrx&logoColor=white)](https://ngrx.io/)
</div>

---

## 📖 Overview

This repository contains the **Frontend Web Application** for the **Agileti ERP**, an integral enterprise management system. Built with cutting-edge web technologies, it provides a seamless, dynamic, and professional user experience for managing everything from complex WMS (Warehouse Management Systems) to sales, production, and security.

This application is designed to be highly responsive, supporting complete dark/light mode themes, and utilizing a reactive state-management architecture.

## ✨ Key Features

- 📊 **Smart Dashboards**: Real-time widgets, economic indicators, and interactive charts powered by **Chart.js**.
- 🏭 **WMS Module**: Advanced warehouse management, stock tracking, and pool control.
- 🔐 **Robust Security**: Role-based access control, interceptors, and strict routing policies.
- 🎨 **Adaptive Theming**: Built-in support for Light and Dark modes with responsive PrimeNG components.
- 📆 **Advanced Scheduling**: Interactive calendar management using **FullCalendar**.
- 📑 **Export Capabilities**: Native generation of PDFs (jsPDF) and Excel spreadsheets (XLSX).

## 🛠️ Tech Stack

- **Core**: [Angular 17](https://angular.io/)
- **UI Library**: [PrimeNG 17](https://primeng.org/) & [PrimeFlex](https://primeflex.org/)
- **State Management**: [NgRx Store & Effects](https://ngrx.io/)
- **Styling**: SCSS, CSS Variables for dynamic theming
- **Utilities**: RxJS, FontAwesome, Google Maps API

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (>= 18.x)
- npm (>= 9.x)
- Angular CLI (`npm install -g @angular/cli@17`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/agileti-frontend.git
   cd agileti-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create your environment file by copying the example:
   ```bash
   cp src/environments/environment.ts.example src/environments/environment.ts
   ```

4. **Run the Development Server:**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## 🏗️ Project Structure

```text
src/
├── app/
│   ├── core/           # Core modules, interceptors, guards
│   ├── shared/         # Shared UI components, pipes, directives
│   ├── features/       # Feature modules (WMS, ERP, Auth)
│   └── store/          # NgRx global state management
├── assets/             # Static assets, themes, i18n
├── environments/       # Environment configurations
└── styles.scss         # Global styles and theme variables
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/yourusername/agileti/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<div align="center">
  <sub>Built with ❤️ by Agileti Team.</sub>
</div>