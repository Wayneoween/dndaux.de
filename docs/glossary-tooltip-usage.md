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

The repository includes a pre-commit hook that automatically applies glossary tooltips:

1. **Write naturally** - Just write your posts using glossary terms normally
2. **Commit as usual** - `git commit` will automatically run the tooltip processing
3. **Build and deploy** - The tooltips will work on GitHub Pages

The pre-commit hook:
- Detects when markdown files are being committed
- Automatically runs `rake glossary:autolink`
- Stages any modified files for inclusion in the commit
- Provides clear feedback about what was processed

### Manual (Alternative)

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
- **✅ Automatic processing**: Rake task finds and replaces terms
- **✅ Pre-commit automation**: Runs automatically on commit
- **✅ Reversible**: Can remove all tooltips and return to plain text
- **✅ Smart matching**: Longest terms first, word boundaries only
- **✅ Automatic linking**: Tooltips include a link to the glossary page with search
- **✅ Error handling**: Terms not found in glossary are displayed with a subtle style
- **✅ Case insensitive**: Term matching is case insensitive
- **✅ Responsive**: Tooltips work on mobile and desktop
- **✅ Accessible**: Proper hover states and keyboard navigation
- **✅ Inline rendering**: Proper HTML generation without paragraph breaks
- **✅ Clean and reliable**: No nested tooltips or HTML corruption

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
