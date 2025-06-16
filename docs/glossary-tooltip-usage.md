# Glossary Tooltip Usage

This site uses a custom glossary tooltip system that works with GitHub Pages (no plugins required).

## ✅ Working Implementation

The custom tooltip system is now working correctly with proper inline HTML generation.

## Usage

To add a glossary tooltip to your posts, use the following include syntax:

### Basic Usage
```liquid
{% include glossary_tooltip.html term="Term Name" %}
```

This will display "Term Name" with a dotted underline that shows a tooltip on hover with the definition from `_data/glossary.yml`.

### Custom Display Text
```liquid
{% include glossary_tooltip.html term="Actual Term Name" text="custom display text" %}
```

This will display "custom display text" but show the tooltip for "Actual Term Name" from the glossary.

## Examples

- Reference a god: {% include glossary_tooltip.html term="Aldyhn" %}
- Use custom text: {% include glossary_tooltip.html term="Gnark und Idin" text="the twin gods" %}
- Reference a place: {% include glossary_tooltip.html term="Vani" %}

## Features

- **✅ Works with GitHub Pages**: No custom plugins required
- **✅ Automatic linking**: Tooltips include a link to the glossary page with search
- **✅ Error handling**: Terms not found in glossary are displayed with a subtle style
- **✅ Case insensitive**: Term matching is case insensitive
- **✅ Responsive**: Tooltips work on mobile and desktop
- **✅ Accessible**: Proper hover states and keyboard navigation
- **✅ Inline rendering**: Proper HTML generation without paragraph breaks

## Technical Implementation

The system uses:
- **Liquid includes** with whitespace stripping (`{%-` and `-%}`) for clean inline HTML
- **CSS custom properties** for theme integration
- **Automatic URL encoding** for glossary links
- **Fallback handling** for missing terms

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
