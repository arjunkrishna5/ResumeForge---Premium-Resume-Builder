# Contributing to ResumeForge 🛠️

Thank you for your interest in contributing to **ResumeForge**! We welcome contributions from developers of all skill levels. Whether you are fixing a bug, adding a new feature, or improving documentation, your help is greatly appreciated.

Please take a moment to review this guide before getting started.

---

## 📜 Table of Contents
1. [Code of Conduct](#-code-of-conduct)
2. [How to Claim an Issue](#-how-to-claim-an-issue)
3. [Local Development Setup](#-local-development-setup)
4. [Branching Strategy](#-branching-strategy)
5. [Submitting a Pull Request (PR)](#-submitting-a-pull-request-pr)
6. [Coding Guidelines](#-coding-guidelines)

---

## 🤝 Code of Conduct
- Be respectful, inclusive, and collaborative.
- Maintain constructive feedback during code reviews.
- Help create a welcoming community for everyone.

---

## 📌 How to Claim an Issue

1. **Browse Existing Issues**: Check the [GitHub Issues page](https://github.com/arjunkrishna5/ResumeForge---Premium-Resume-Builder/issues) for open tasks.
2. **Comment Before Coding**: Before writing any code, leave a comment on the issue saying:
   > *"I would like to work on this issue!"*
3. **Wait for Assignment**: Wait until a project maintainer assigns the issue to you before starting work. This prevents multiple developers from working on the same task simultaneously.
4. **Suggesting New Ideas**: If you find a bug or want to propose a new feature, please open a new issue first to discuss it before submitting code.

---

## 🛠️ Local Development Setup

### 1. Fork and Clone the Repository
Fork the repository on GitHub, then clone your fork locally:
```bash
git clone https://github.com/YOUR-USERNAME/ResumeForge---Premium-Resume-Builder.git
cd ResumeForge---Premium-Resume-Builder
```

### 2. Install Dependencies
Install frontend packages:
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local` and configure your API keys (Firebase, Gemini/Groq):
```bash
cp .env.example .env.local
```
> **Note**: Firebase credentials are optional for local development. If no API keys are configured in `.env.local`, ResumeForge will automatically run in local **Guest Mode** using browser storage.

### 4. Run Development Servers
Start the Vite dev server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🌿 Branching Strategy

> ⚠️ **IMPORTANT: Never push directly to the `main` branch.**

1. Always create your own descriptive branch for your work:
   ```bash
   git checkout -b <your-branch-name>
   ```
2. Make your changes, commit them to your branch, and push your branch to GitHub.
3. Open a **Pull Request (PR)** targeting the `main` branch for review.

---

## 🚀 Submitting a Pull Request (PR)

1. **Run Typecheck & Build**:
   Ensure there are no compilation errors or broken builds before submitting:
   ```bash
   npx tsc --noEmit
   npm run build
   ```

2. **Commit Your Changes**:
   Use clear, descriptive commit messages:
   ```bash
   git add .
   git commit -m "feat: add category grouping to skills section"
   ```

3. **Push to Your Fork**:
   ```bash
   git push origin feature/skills-categorization
   ```

4. **Open a Pull Request**:
   - Go to the main [ResumeForge Repository](https://github.com/arjunkrishna5/ResumeForge---Premium-Resume-Builder).
   - Click **New Pull Request**.
   - Select your branch and submit the PR.
   - Reference the issue number in your PR description (e.g., `Closes #1` or `Fixes #1`).

---

## 💡 Coding Guidelines

- **TypeScript**: Use strict typing and avoid `any` wherever possible.
- **Styling**: Use Tailwind CSS utility classes and adhere to existing UI theme tokens.
- **Components**: Keep components modular, accessible, and self-contained.

Thank you for helping make ResumeForge better for job seekers everywhere! Happy coding! 🚀
