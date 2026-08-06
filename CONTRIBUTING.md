# Contributing to ResumeForge

Thank you for contributing to **ResumeForge** (`arjunkrishna5/ResumeForge---Premium-Resume-Builder`)! Please review these guidelines before starting work on any task.

---

## 📌 1. Before Doing Anything for This Repository

Before writing any code or making changes to this repository, please follow these steps:

1. **Check Open Issues**: Browse existing tasks on the [GitHub Issues page](https://github.com/arjunkrishna5/ResumeForge---Premium-Resume-Builder/issues).
2. **Claim the Issue**: Leave a comment asking to be assigned (e.g. *"I would like to work on this!"*). Wait until a project maintainer assigns the issue to you before starting work.
3. **Propose New Changes First**: If you discover a bug or want to introduce a new feature, open an issue first to discuss it with maintainers before submitting a pull request.

---

## 🛠️ 2. Local Setup & Guest Mode

1. **Fork the Repository**: Click the **Fork** button at the top right of this GitHub repository to create a copy under your GitHub account.
2. **Clone & Run**:
```bash
# Clone your fork locally
git clone https://github.com/YOUR-USERNAME/ResumeForge---Premium-Resume-Builder.git
cd ResumeForge---Premium-Resume-Builder

# Install packages & set up environment
npm install
cp .env.example .env.local

# Start development server
npm run dev
```

> **Note**: Firebase API keys are optional for local development. If no keys are configured in `.env.local`, ResumeForge automatically runs in **Guest Mode** using browser storage.

---

## 🌿 3. Branching Rules

> ⚠️ **CRITICAL: Never push directly to the `main` branch.**

- Always create your own descriptive branch for your work:
  ```bash
  git checkout -b <your-branch-name>
  ```

---

## 🚀 4. Submitting a Pull Request (PR)

1. **Verify Your Code**:
   Ensure code typechecks and builds without errors:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
2. **Push Branch & Open PR**:
   - Push your branch to GitHub and open a **Pull Request (PR)** targeting `main`.
   - Link the relevant issue number in your PR description (e.g. `Closes #1` or `Fixes #1`).

