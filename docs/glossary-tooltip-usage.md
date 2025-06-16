# Glossary Tooltip Usage

This site uses a custom glossary tooltip system that works with GitHub Pages (no plugins required).

## ✅ Working Implementation

The custom tooltip system is now working correctly with proper inline HTML generation.

## Two Approaches

### 1. Manual Usage (Always Works)

To manually add a glossary tooltip to your posts, use the include syntax:

```liquid
{% include glossary_tooltip.html term="Term Name" %}
{% include glossary_tooltip.html term="Actual Term Name" text="custom display text" %}
```

### 2. Automatic Processing (Rake Task)

For automatic processing, use the Rake tasks:

```bash
# Add glossary tooltips to all terms in posts and pages
bundle exec rake glossary:autolink

# Remove all glossary tooltips and return to plain text
bundle exec rake glossary:remove_links
```

**How it works:**
- Searches all `.md` files in `_posts/` and root directory
- Finds terms from `_data/glossary.yml`
- Replaces first occurrence of each term with `{% include glossary_tooltip.html term="..." %}`
- Sorts by length (longest first) to avoid partial matches
- GitHub Pages compatible since it only uses includes

## Workflow

### Automated (Recommended)

The repository includes multiple automation levels:

#### 1. GitHub Actions (For CMS Users)
If you're using Sveltia CMS or other web-based editors, GitHub Actions will automatically process your content:

1. **Write naturally** - Create posts using glossary terms normally in Sveltia CMS
2. **Publish/Save** - When you save in the CMS, it commits to the repository
3. **Automatic processing** - GitHub Actions detects the commit and runs glossary processing
4. **Auto-commit** - Processed files are automatically committed back to the repository
5. **Build and deploy** - The site builds and deploys with tooltips applied

#### 2. Pre-commit Hook (For Git Users)
If you're editing files directly and committing via Git:

1. **Write naturally** - Just write your posts using glossary terms normally
2. **Commit as usual** - `git commit` will automatically run the tooltip processing
3. **Build and deploy** - The tooltips will work on GitHub Pages

The pre-commit hook:
- Detects when markdown files are being committed
- Automatically runs `rake glossary:autolink`
- Stages any modified files for inclusion in the commit
- Provides clear feedback about what was processed

#### 3. Manual (Alternative)
If you prefer manual control or need to troubleshoot:

1. **Write naturally** - Just write your posts using glossary terms normally
2. **Run autolink** - `bundle exec rake glossary:autolink` before publishing
3. **Build and deploy** - The tooltips will work on GitHub Pages

## Examples

- Reference a god: {% include glossary_tooltip.html term="Aldyhn" %}
- Use custom text: {% include glossary_tooltip.html term="Gnark und Idin" text="the twin gods" %}
- Reference a place: {% include glossary_tooltip.html term="Vani" %}

## Features

- **✅ Works with GitHub Pages**: No custom plugins required
- **✅ CMS Compatible**: Works with Sveltia CMS via GitHub Actions
- **✅ Automatic processing**: Multiple automation levels (GitHub Actions, pre-commit hook, Rake task)
- **✅ Pre-commit automation**: Runs automatically on commit for Git users
- **✅ GitHub Actions integration**: Processes content automatically for CMS users
- **✅ Reversible**: Can remove all tooltips and return to plain text
- **✅ Smart matching**: Longest terms first, word boundaries only
- **✅ Automatic linking**: Tooltips include a link to the glossary page with search
- **✅ Error handling**: Terms not found in glossary are displayed with a subtle style
- **✅ Case insensitive**: Term matching is case insensitive
- **✅ Responsive**: Tooltips work on mobile and desktop
- **✅ Accessible**: Proper hover states and keyboard navigation
- **✅ Inline rendering**: Proper HTML generation without paragraph breaks
- **✅ Clean and reliable**: No nested tooltips or HTML corruption

## GitHub Actions Setup

The repository includes a GitHub Actions workflow (`.github/workflows/pages.yml`) that automatically:

1. **Detects changes** when content is pushed to the main branch
2. **Processes glossary terms** using the Rake task
3. **Commits processed files** back to the repository (if changes were made)
4. **Builds and deploys** the site to GitHub Pages

### Key Features:
- Runs automatically when Sveltia CMS saves content
- Uses `[skip ci]` in commit messages to avoid infinite loops
- Only commits if files were actually changed by glossary processing
- Seamlessly integrates with GitHub Pages deployment

### Configuration:
The workflow requires:
- `contents: write` permission to commit processed files back to the repository
- GitHub Pages to be configured to use "GitHub Actions" as the source (not "Deploy from a branch")

**To enable this workflow:**
1. Go to your repository Settings > Pages
2. Under "Source", select "GitHub Actions" instead of "Deploy from a branch"
3. The custom workflow will then be used for all deployments

### Troubleshooting:
- If the default Jekyll action runs instead of your custom workflow, make sure GitHub Pages source is set to "GitHub Actions"
- Check the Actions tab to see which workflow is running
- The workflow will show "Auto-process glossary tooltips [skip ci]" commits when processing occurs

## Pre-commit Hook Setup

The repository includes a pre-commit hook at `.git/hooks/pre-commit` that automatically applies glossary tooltips when you commit markdown files.

### Features:
- Automatically detects staged markdown files
- Runs `rake glossary:autolink` before commit
- Stages any modified files for inclusion in the same commit
- Provides clear feedback about processing

### Troubleshooting:

**If the hook doesn't run:**
```bash
# Make sure the hook is executable
chmod +x .git/hooks/pre-commit

# Test the hook manually
.git/hooks/pre-commit
```

**To bypass the hook temporarily:**
```bash
git commit --no-verify -m "Skip pre-commit hook"
```

**To disable the hook:**
```bash
# Rename or remove the hook file
mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled
```

## Technical Implementation

The system uses:
- **Liquid includes** with whitespace stripping (`{%-` and `-%}`) for clean inline HTML
- **CSS custom properties** for theme integration
- **Automatic URL encoding** for glossary links
- **Fallback handling** for missing terms
- **Rake automation** for bulk processing

## Styling

The tooltips use CSS custom properties (CSS variables) and will adapt to your theme:
- `--link`: For the term color and border
- `--text`: For tooltip background
- `--background`: For tooltip text color
- `--meta`: For secondary elements

## Data Source

All glossary terms are stored in `_data/glossary.yml`. Each entry should have:
- `term`: The exact term name
- `definition`: The definition to show in the tooltip
- `type`: (optional) Category or type of the term
- Other fields are supported but not used in tooltips

## Migration from jekyll-glossary_tooltip

If you were previously using the `jekyll-glossary_tooltip` gem:

**Old syntax:**
```
{% raw %}{% glossary Term Name %}{% endraw %}
```

**New syntax:**
```liquid
{% include glossary_tooltip.html term="Term Name" %}
```

The functionality is similar but the new system:
- Works with GitHub Pages
- Has better error handling
- Supports custom display text
- Uses modern CSS
- Links to the glossary page with search
