require 'yaml'
require 'cgi'

module Jekyll
  class GlossaryProcessor
    def initialize(site)
      @site = site
      @glossary = load_glossary
    end

    private

    def load_glossary
      glossary_file = File.join(@site.source, '_data', 'glossary.yml')
      return [] unless File.exist?(glossary_file)

      data = YAML.load_file(glossary_file)
      return [] unless data && data['glossary']

      data['glossary']
    rescue StandardError => e
      Jekyll.logger.warn 'Glossary:', "Failed to load glossary: #{e.message}"
      []
    end

    public

    def process_content(content)
      return content if @glossary.empty?

      processed_content = content.dup

      # Sort terms by length (longest first) to avoid partial matches
      sorted_terms = @glossary.sort_by { |entry| -entry['term'].length }

      sorted_terms.each do |entry|
        term = entry['term']

        # Create regex pattern that matches the term as a whole word
        # This prevents matching partial words and avoids already processed terms
        pattern = /(?<!<[^>]*)\b#{Regexp.escape(term)}\b(?![^<]*>)/i

        # Create tooltip HTML
        tooltip_html = create_tooltip_html(entry)

        # Replace first occurrence only
        processed_content.sub!(pattern, tooltip_html)
      end

      processed_content
    end

    private

    def create_tooltip_html(entry)
      term = entry['term']
      definition = entry['definition']
      type = entry['type']

      # Escape HTML entities
      term_escaped = CGI.escapeHTML(term)
      definition_escaped = CGI.escapeHTML(definition)

      # Build type HTML if present
      type_html = type ? " <em class=\"glossary-type\">(#{CGI.escapeHTML(type)})</em>" : ''

      # Generate the same HTML structure as the include file
      result = '<span class="jekyll-glossary">'
      result += "<span class=\"glossary-term\">#{term_escaped}</span>"
      result += '<span class="jekyll-glossary-tooltip">'
      result += "<strong>#{term_escaped}</strong>#{type_html}<br>"
      result += "#{definition_escaped}<br>"
      result += "<a class=\"jekyll-glossary-source-link\" href=\"/glossary/?search=#{CGI.escape(term)}\" target=\"_blank\"></a>"
      result += '</span></span>'

      result
    end
  end

  # Hook into the site generation process after markdown conversion
  Jekyll::Hooks.register :posts, :post_convert do |post|
    next if post.data['disable_glossary'] == true

    glossary_processor = GlossaryProcessor.new(post.site)
    post.content = glossary_processor.process_content(post.content)
  end

  Jekyll::Hooks.register :pages, :post_convert do |page|
    # Skip processing for certain pages
    next if page.name == 'glossary.md'
    next if page.path.start_with?('admin/')
    next if page.data['disable_glossary'] == true

    glossary_processor = GlossaryProcessor.new(page.site)
    page.content = glossary_processor.process_content(page.content)
  end

  # After rendering pages, strip glossary tooltip markup from feeds (XML) so RSS/Atom stay clean
  Jekyll::Hooks.register :pages, :post_render do |page|
    begin
      output_ext = page.respond_to?(:output_ext) ? page.output_ext : File.extname(page.destination(''))
    rescue StandardError
      output_ext = nil
    end
    next unless output_ext == '.xml'

    # Heuristic: only sanitize known feed files
    feed_like = (page.url && (page.url.include?('feed') || page.url.end_with?('.xml'))) ||
                (page.path && (page.path.include?('feed') || page.path.end_with?('.xml')))
    next unless feed_like

    output = page.output.dup
    # 1) Remove the hidden tooltip content entirely
    output.gsub!(/<span\s+class="jekyll-glossary-tooltip">.*?<\/span>/m, '')
    # 2) Unwrap the visible term
    output.gsub!(/<span\s+class="glossary-term">(.*?)<\/span>/m, '\\1')
    # 3) Remove the outer glossary wrapper
    output.gsub!(/<span\s+class="jekyll-glossary">(.*?)<\/span>/m, '\\1')
    # 4) Handle not-found variant
    output.gsub!(/<span\s+class="glossary-term-not-found"[^>]*>(.*?)<\/span>/m, '\\1')

    page.output = output
  end
end
