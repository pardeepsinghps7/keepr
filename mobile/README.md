# ListKeepr 📋

> **A smart and simple way to save, organize, and revisit everything you love.**

ListKeepr is a cross-platform mobile application built with **React Native and Supabase** that helps users save and organize recommendations, favorites, and things they want to remember.

Whether it's a book to read, a restaurant to try, a movie to watch, a podcast to listen to, or a bottle of wine to remember, ListKeepr keeps everything organized in one place.

**Save it once. Never forget it again.**

---

## 📱 App Preview

<p align="center">
  <img src="docs/screenshots/onboarding.webp" width="250" alt="ListKeepr Onboarding" />
  <img src="docs/screenshots/home.webp" width="250" alt="ListKeepr Home" />
  <img src="docs/screenshots/list.webp" width="250" alt="ListKeepr List" />
</p>

<p align="center">
  <img src="docs/screenshots/add-item.webp" width="250" alt="ListKeepr Add Item" />
  <img src="docs/screenshots/login.webp" width="250" alt="ListKeepr Login" />
</p>

---

## 🎯 Overview

Recommendations are easy to forget.

A friend recommends a movie, someone tells you about a great restaurant, you discover a book you want to read, or you find a wine you want to remember — but these recommendations often end up scattered across notes, messages, screenshots, and conversations.

**ListKeepr provides one place to save, organize, search, and revisit them.**

Users can create categorized lists, save individual items, add ratings and notes, record who recommended something, and track whether something has already been experienced or is still on their list.

---

## ✨ Key Features

### 📋 Smart Lists

* Create and manage categorized lists
* Organize movies, books, restaurants, podcasts, wine, beer, and more
* Create custom lists for virtually anything
* View all saved items within organized categories

### ⭐ Item Management

Each saved item can contain:

* Title
* Rating
* Personal notes
* Status
* Recommended by
* Saved-for-later state

Users can track items such as **Watched**, **To Watch**, and other relevant states.

### 🔎 Search, Sort & Filter

ListKeepr makes it easy to find saved recommendations.

Supported organization options include:

* Date Added
* Rating
* Title
* Status
* Saved for Later

### 📚 Book Search

* Search for books from within the application
* View book information
* Access available purchase links

### 🔐 Authentication

* User registration
* User login
* Password recovery
* Remember-me functionality
* Authenticated user sessions

### 🔗 Deep Linking

ListKeepr supports deep linking to allow external links to open the application and navigate users to the appropriate application flow or screen.

### 🎨 User Experience

* Clean and modern mobile interface
* Responsive layouts
* Reusable UI components
* Simple navigation
* Clear loading and validation states
* User-friendly data entry workflows

---

## 🛠️ Tech Stack

| Technology           | Purpose                               |
| -------------------- | ------------------------------------- |
| **React Native**     | Cross-platform mobile application     |
| **JavaScript**       | Application development               |
| **Redux**            | Application state management          |
| **Supabase**         | Backend and data services             |
| **Supabase Auth**    | User authentication                   |
| **React Navigation** | Application navigation                |
| **Deep Linking**     | External link and application routing |
| **Jest**             | Testing                               |
| **Git / GitHub**     | Version control                       |
| **Android**          | Android platform                      |
| **iOS**              | iOS platform                          |

---

## 🏗️ Engineering Highlights

The project demonstrates practical experience in building and structuring a production-oriented React Native application.

* **Modular React Native architecture** with separate screens, reusable components, navigation, state management, utilities, and integrations
* **Reusable component architecture** to reduce duplication and improve maintainability
* **Redux-based state management** for centralized application state
* **Supabase integration** for backend services and authentication
* **API integration** for retrieving and managing application data
* **Authentication flows** including sign-in, sign-up, and password recovery
* **Form handling and validation** for user input and data creation
* **Search, sorting, and filtering** for efficient data discovery
* **Dynamic list rendering** for categorized and user-created lists
* **Deep linking implementation** for handling external links and navigating users through appropriate application flows
* **Responsive mobile UI** designed for different device screen sizes
* **Loading, validation, and error-state handling** across user workflows
* **Android and iOS support** through React Native's cross-platform architecture
* **Jest-based testing setup** for application testing
* **Maintainable code organization** separating UI, state, navigation, utilities, and integrations

---

## 👨‍💻 My Contribution

### ListKeepr — Sole Mobile Developer

I independently designed and developed the mobile application using **React Native and Supabase**.

My responsibilities included:

* Designed and developed the mobile application
* Implemented reusable React Native components
* Built application screens and user flows
* Implemented navigation and deep linking
* Implemented authentication and user account flows
* Integrated Supabase backend services
* Integrated APIs required by the application
* Implemented Redux-based state management
* Developed list creation and item management functionality
* Implemented ratings, notes, status, and recommendation tracking
* Implemented search, sorting, and filtering functionality
* Developed custom list functionality
* Implemented form validation and user input handling
* Handled loading and error states
* Worked with Android and iOS platform configurations
* Maintained application performance, stability, and code organization
* Added and maintained testing configuration

---

## 📂 Project Structure

```text
keepr/
├── __tests__/             # Application tests
├── android/               # Android native project
├── docs/
│   └── screenshots/       # Application screenshots
├── ios/                   # iOS native project
├── src/
│   ├── assets/            # Images, icons, and static assets
│   ├── components/        # Reusable UI components
│   ├── constants/         # Application constants
│   ├── lib/               # Libraries and service integrations
│   ├── Navigations/       # Navigation configuration and routes
│   ├── redux/             # Redux state management
│   ├── screens/           # Application screens
│   ├── utils/             # Utility and helper functions
│   └── index.js           # Source entry point
├── .env                   # Local environment configuration
├── .gitignore             # Git ignore configuration
├── App.js                 # Application root component
├── app.json               # Application configuration
├── babel.config.js        # Babel configuration
├── Gemfile                # Ruby dependencies for native tooling
├── jest.config.js         # Jest configuration
├── metro.config.js        # Metro bundler configuration
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── index.js               # React Native entry point
├── README.md
└── yarn.lock
```

---

## 🔐 Environment Configuration

ListKeepr uses environment configuration for Supabase and other external service settings.

Create your local environment configuration with the required project values:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Use the appropriate environment configuration for your local development setup.

> **Security:** Never commit passwords, service-role keys, private API keys, or other sensitive credentials to GitHub. Keep environment-specific secrets outside the repository and make sure the relevant environment files are included in `.gitignore`.

---

## ⚙️ Getting Started

### Prerequisites

Make sure the following tools are installed:

* Node.js
* npm or Yarn
* React Native development environment
* Android Studio for Android development
* Xcode for iOS development
* CocoaPods for iOS dependencies

### 1. Clone the Repository

```bash
git clone https://github.com/pardeepsinghps7/keepr.git
cd keepr
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using Yarn:

```bash
yarn install
```

### 3. Configure Environment Variables

Create your local environment configuration and add the required Supabase/API values.

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Install iOS Dependencies

For iOS:

```bash
cd ios
pod install
cd ..
```

### 5. Start Metro

```bash
npx react-native start
```

### 6. Run Android

```bash
npx react-native run-android
```

### 7. Run iOS

```bash
npx react-native run-ios
```

---

## 🧪 Testing

The project includes a Jest testing setup.

Run the test suite with:

```bash
npm test
```

Or:

```bash
yarn test
```

---

## 🔗 Deep Linking

ListKeepr includes deep linking support to handle links that can open the application and navigate through the appropriate application flow.

The implementation integrates deep linking with the application's navigation architecture.

This allows the application to support scenarios where users enter the application through an external link rather than starting from the default home screen.

---

## 📸 Screenshots

### Onboarding

<p align="center">
  <img src="docs/screenshots/onboarding.webp" width="320" alt="ListKeepr Onboarding Screen" />
</p>

The onboarding experience introduces the core purpose of ListKeepr and guides users through the initial application flow.

---

### Home Dashboard

<p align="center">
  <img src="docs/screenshots/home.webp" width="320" alt="ListKeepr Home Screen" />
</p>

The home screen provides quick access to saved lists, recently added items, and common actions.

---

### Lists & Filtering

<p align="center">
  <img src="docs/screenshots/list.webp" width="320" alt="ListKeepr List Screen" />
</p>

Users can browse saved items and organize them using sorting, filtering, status, and saved-for-later options.

---

### Add New Item

<p align="center">
  <img src="docs/screenshots/add-item.webp" width="320" alt="ListKeepr Add Item Screen" />
</p>

The add-item workflow allows users to select a list type and capture information such as title, status, rating, recommendation source, and notes.

---

### Authentication

<p align="center">
  <img src="docs/screenshots/login.webp" width="320" alt="ListKeepr Login Screen" />
</p>

The authentication experience provides sign-in, password recovery, remember-me functionality, and account creation.

---

## 📱 Platform Support

ListKeepr is developed as a cross-platform React Native application with native project support for:

* Android
* iOS

The project contains dedicated native configurations under the `android/` and `ios/` directories.

---

## 🎯 What This Project Demonstrates

ListKeepr demonstrates practical experience in developing a complete mobile application rather than only implementing isolated UI screens.

The project covers:

* Cross-platform React Native development
* Mobile application architecture
* Reusable component development
* State management with Redux
* Backend integration with Supabase
* Authentication
* API integration
* Navigation and deep linking
* Search and filtering
* Form handling and validation
* Dynamic data-driven UI
* Android and iOS development
* Testing setup
* Environment configuration
* Maintainable project organization

---

## 👤 Developer

### Pardeep Singh

**Senior Mobile App Developer**

React Native • Flutter • Android • JavaScript • Mobile Application Development

I specialize in building cross-platform mobile applications with a focus on scalable architecture, reusable components, API integration, performance, and maintainable code.

---

## 📌 Project Information

|                      |                       |
| -------------------- | --------------------- |
| **Project**          | ListKeepr             |
| **Repository**       | Keepr                 |
| **Role**             | Sole Mobile Developer |
| **Framework**        | React Native          |
| **Backend**          | Supabase              |
| **Platforms**        | Android & iOS         |
| **State Management** | Redux                 |
| **Navigation**       | React Navigation      |
| **Testing**          | Jest                  |

---

## ⭐ Why ListKeepr?

ListKeepr was built around a simple idea:

> **The things worth remembering shouldn't be scattered across notes, messages, and screenshots.**

Whether it's something to watch, read, visit, try, or remember, ListKeepr gives users a simple place to save it and find it later.

**Save it once. Never forget it again.**

---

⭐ **If you find this project interesting, feel free to explore the source code and implementation.**
