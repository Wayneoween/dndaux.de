# dndaux.de

A Jekyll-powered D&D auxiliary website with automated glossary tooltips.

## Glossary Tooltip System

This site features an automated glossary tooltip system that works seamlessly with Sveltia CMS and GitHub Pages.

### How It Works

1. Write in Sveltia CMS:
   ```markdown
   The adventure begins when Aldyhn guides the party through Vani's domain...
   ```

2. GitHub Actions automatically processes during build but does not commit:
   ```markdown
   The adventure begins when {% include glossary_tooltip.html term="Aldyhn" %} guides the party through {% include glossary_tooltip.html term="Vani" %}'s domain...
   ```

3. Readers see beautiful tooltips while your source files stay clean! 🎉

###  Safety Features

The Rake tasks include built-in protection against accidental local usage:

```bash
# Protected - shows helpful warning
rake glossary:autolink

# Automatically works in GitHub Actions
# Override for local testing (not recommended)
rake glossary:autolink -- --trust-me-bro
```

### Setup & Configuration

**For GitHub Pages:**
1. Go to repository Settings > Pages
2. Under "Source", select **"GitHub Actions"** (not "Deploy from a branch")
3. That's it! The workflow will handle everything automatically.

### Manual Usage (Not Recommended)

The system is designed for automatic GitHub Actions processing, but if you need manual control:

```bash
# Will show a helpful warning - source files stay clean with GitHub Actions!
rake glossary:autolink

# Override for local testing (modifies source files)
rake glossary:autolink -- --trust-me-bro

# Remove tooltips from source files
rake glossary:remove_links -- --trust-me-bro
```

### Key Benefits

- **CMS**: Write clean markdown in Sveltia CMS
- **Automatic Processing**: GitHub Actions handles everything
- **Clean Source Files**: No Liquid template clutter
- **GitHub Pages Compatible**: No custom plugins needed
- **Protected**: Safety checks prevent accidental source file modification
