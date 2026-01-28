# Vansh Chaudhary - Portfolio Website

A clean, minimalist, and professional portfolio website built with pure HTML, CSS, and JavaScript. This portfolio showcases my skills, projects, education, and contact information in a modern dark-mode design.

## 🌟 Features

- **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop devices
- **Dark Mode Design**: Modern dark theme with blue accent colors
- **Single Page Application**: Smooth scrolling navigation between sections
- **Mobile-Friendly Navigation**: Hamburger menu for mobile devices
- **Fast Loading**: No heavy dependencies or frameworks
- **Semantic HTML5**: Proper use of semantic tags for better SEO
- **Accessible**: Proper contrast ratios and ARIA labels
- **GitHub Pages Ready**: Can be deployed directly to GitHub Pages

## 📁 Project Structure

```
/
├── index.html          # Main HTML file with all sections
├── css/
│   └── style.css       # Complete styling with CSS variables
├── js/
│   └── main.js         # JavaScript for interactivity
├── assets/             # (optional) for images/icons
└── README.md           # This file
```

## 🎨 Design Details

### Color Palette
- **Background Primary**: `#0a0a0a`
- **Background Secondary**: `#121212`
- **Background Card**: `#1a1a1a`
- **Text Primary**: `#f5f5f5`
- **Text Secondary**: `#e0e0e0`
- **Accent**: `#3b82f6` (Blue)

### Typography
- **Font Family**: System fonts (Apple, Segoe UI, Roboto, etc.)
- **Base Font Size**: 16px
- **Line Height**: 1.6

## 📋 Sections

1. **Hero/Landing** - Introduction with name, title, and CTA buttons
2. **About** - Personal bio and philosophy
3. **Skills** - Visual skill cards showcasing technical abilities
4. **Projects** - Project cards with descriptions and tech stacks
5. **Education** - Educational background and achievements
6. **Contact** - Contact information with social links
7. **Footer** - Copyright and credits

## 🚀 Getting Started

### Prerequisites
- A web browser (Chrome, Firefox, Safari, Edge)
- A text editor (VS Code, Sublime Text, Notepad++)
- Git (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/VanshChaudhary7/Portfolio.git
   cd Portfolio
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (with http-server)
     npx http-server
     ```

3. **Edit the content**
   - Open files in your text editor
   - Make changes to HTML, CSS, or JS
   - Refresh browser to see changes

## 🔧 Customization Guide

### 1. Update Personal Information

Open `index.html` and replace the placeholder text:

- **Email**: Find `[Your Email]` and replace with your actual email
- **GitHub**: Find `[Your GitHub]` and replace with your GitHub profile URL
- **LinkedIn**: Find `[Your LinkedIn]` and replace with your LinkedIn profile URL
- **Project Links**: Find `[GitHub Link]` and replace with actual project URLs

### 2. Customize Colors

Edit `css/style.css` - modify CSS variables at the top:

```css
:root {
    --accent: #3b82f6;  /* Change to your preferred accent color */
    --bg-primary: #0a0a0a;  /* Change background colors */
    /* ... more variables */
}
```

### 3. Add/Remove Projects

In `index.html`, find the Projects section and duplicate/remove project cards:

```html
<div class="project-card">
    <div class="project-header">
        <h3>Your Project Name</h3>
        <div class="project-tags">
            <span class="tag">Tech1</span>
            <span class="tag">Tech2</span>
        </div>
    </div>
    <p class="project-description">Your description</p>
    <div class="project-links">
        <a href="your-link" class="project-link">View Project →</a>
    </div>
</div>
```

### 4. Update Skills

Modify the skills section with your own skills and emojis:

```html
<div class="skill-card">
    <div class="skill-icon">🔥</div>
    <h3>Your Skill</h3>
    <p>Brief description</p>
</div>
```

### 5. Change Typography

To use a different font, update the font family in `css/style.css`:

```css
:root {
    --font-primary: 'Your Font', sans-serif;
}
```

Don't forget to link the font in `index.html` if using Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

## 🌐 Deployment to GitHub Pages

### Method 1: GitHub Web Interface

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Pages** section
4. Under **Source**, select `main` branch
5. Click **Save**
6. Your site will be live at `https://yourusername.github.io/Portfolio/`

### Method 2: Command Line

1. **Commit your changes**
   ```bash
   git add .
   git commit -m "Update portfolio"
   git push origin main
   ```

2. **Enable GitHub Pages** (if not already enabled)
   - Follow steps from Method 1

3. **Wait a few minutes** for deployment
   - Check status in Settings > Pages
   - Visit your live site!

### Custom Domain (Optional)

1. Buy a domain from a registrar (Namecheap, GoDaddy, etc.)
2. Add a `CNAME` file to your repository with your domain name
3. Configure DNS settings at your registrar
4. Update GitHub Pages settings with your custom domain

## 📱 Testing Responsiveness

Test your portfolio on different screen sizes:

1. **Desktop**: Full-width (1200px+)
2. **Tablet**: Medium width (768px - 1199px)
3. **Mobile**: Small width (320px - 767px)

### Browser DevTools
- Open DevTools (F12)
- Click device toolbar (Ctrl+Shift+M)
- Test different device presets

## 🐛 Troubleshooting

### Issue: CSS not loading
- Check file paths in `index.html`
- Ensure `css/style.css` exists
- Clear browser cache (Ctrl+Shift+R)

### Issue: JavaScript not working
- Check console for errors (F12)
- Ensure `js/main.js` is linked correctly
- Verify script tag is before closing `</body>`

### Issue: Smooth scrolling not working
- Check if section IDs match navigation hrefs
- Ensure JavaScript is loaded
- Try a different browser

### Issue: Mobile menu not toggling
- Inspect element to check class changes
- Verify JavaScript event listeners
- Check for console errors

## 🔐 Security Best Practices

- Don't commit sensitive data (API keys, passwords)
- Use environment variables for sensitive info
- Keep dependencies updated (if you add any later)
- Validate and sanitize any form inputs (if you add forms)

## 📈 Performance Tips

- Optimize images before adding (use WebP format)
- Minimize CSS and JS for production
- Use lazy loading for images
- Enable browser caching
- Consider using a CDN for assets

## 🤝 Contributing

This is a personal portfolio, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Email**: [Your Email]
- **GitHub**: [Your GitHub Profile]
- **LinkedIn**: [Your LinkedIn Profile]

---

**Built with discipline and focus on fundamentals.** 💪

Last Updated: 2024
