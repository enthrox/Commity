# Commity

> **A GitHub-powered Blog CMS for Developers**

Commity is an open-source, developer-friendly blog CMS that lets you publish and manage blogs directly from your GitHub repository. Built with Next.js and designed for simplicity, security, and extensibility.

---

## 🚀 Features
- **Intuitive Blog Editor**: Create and manage your blog posts with a user-friendly interface.
- **GitHub Repo Integration**: Seamlessly connect to your GitHub repository and commit directly.
- **Live Preview of Blogs**: See exactly how your blog will look before publishing.
- **One-Click Publishing**: Commit to your blogs/ folder with a single click.
- **Asset & Image Support**: Upload images and assets directly to your repository.
- **Works with Static Sites**: Currently supports HTML; more frameworks coming soon.

---

## 🛠️ Getting Started

### 1. **Clone the Repository**
```sh
git clone git@github.com:enthrox/Commity.git
cd Commity
```

### 2. **Install Dependencies**
```sh
npm install
# or
yarn install
```

### 3. **Configure Environment Variables**
- Copy `.env.example` to `.env` and fill in your values:

```sh
cp .env.example .env
```

- Set up the following variables:
  - `NEXTAUTH_URL` (e.g., http://localhost:3000)
  - `NEXTAUTH_SECRET` (generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
  - `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` (from your GitHub OAuth app)
  - `DATABASE_URL` (if using a database)

### 4. **Run the Development Server**
```sh
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view your app.

---

## 🌐 Deployment

### **Netlify**
1. Connect your GitHub repo to Netlify.
2. Set environment variables in Netlify dashboard (from `.env.example`).
3. Set build command: `npm run build` or `yarn build`.
4. Set publish directory: `.next` (for SSR) or `out` (for static export).

---

## 📁 Project Structure
```
app/            # Next.js app directory
components/     # Reusable UI components
public/         # Static assets (logo, images, etc.)
styles/         # Global styles (Tailwind CSS)
lib/            # Utility functions and libraries
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 🛡️ License

This project is open source under the [MIT License](LICENSE).

---

## 👤 Owner

**Enthrox**

---

## 💬 Contact & Community
- [GitHub Issues](https://github.com/enthrox/Commity/issues) for bug reports and feature requests.
- Pull requests are welcome! 