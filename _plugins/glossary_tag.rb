require 'liquid'
require 'yaml'
require 'cgi'

module Jekyll
  class GlossaryTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @markup = markup.strip
    end

    def render(context)
      # Parse the markup to extract parameters
      params = parse_params(@markup)
      
      return '' unless params['term']
      
      # Get the site context
      site = context.registers[:site]
      
      # Load glossary data
      glossary = load_glossary(site)
      
      # Find the term
      term_name = params['term']
      display_text = params['text'] || term_name
      
      entry = find_glossary_entry(glossary, term_name)
      
      if entry
        create_tooltip_html(entry, display_text)
      else
        # Return the display text with a subtle indication that the term wasn't found
        "<span class=\"glossary-term-not-found\" title=\"Term '#{CGI.escapeHTML(term_name)}' not found in glossary\">#{CGI.escapeHTML(display_text)}</span>"
      end
    end

    private

    def parse_params(markup)
      params = {}
      
      # Parse term="..." and text="..." parameters
      markup.scan(/(\w+)=["']([^"']+)["']/) do |key, value|
        params[key] = value
      end
      
      # If no parameters, treat the whole markup as the term
      if params.empty?
        params['term'] = markup.gsub(/["']/, '')
      end
      
      params
    end

    def load_glossary(site)
      glossary_file = File.join(site.source, '_data', 'glossary.yml')
      return [] unless File.exist?(glossary_file)
      
      YAML.load_file(glossary_file) || []
    rescue => e
      Jekyll.logger.warn "Glossary:", "Failed to load glossary: #{e.message}"
      []
    end

    def find_glossary_entry(glossary, term_name)
      glossary.find { |entry| entry['term'].downcase == term_name.downcase }
    end

    def create_tooltip_html(entry, display_text)
      term = entry['term']
      definition = entry['definition'] || ''
      type = entry['type']
      
      # Escape HTML to prevent issues
      term_escaped = CGI.escapeHTML(term)
      definition_escaped = CGI.escapeHTML(definition)
      display_text_escaped = CGI.escapeHTML(display_text)
      
      type_html = type ? " <em class=\"glossary-type\">(#{CGI.escapeHTML(type)})</em>" : ""
      
      "<span class=\"jekyll-glossary\"><span class=\"glossary-term\">#{display_text_escaped}</span><span class=\"jekyll-glossary-tooltip\"><strong>#{term_escaped}</strong>#{type_html}<br>#{definition_escaped}<br><a class=\"jekyll-glossary-source-link\" href=\"/glossary/?search=#{CGI.escape(term)}\" target=\"_blank\"></a></span></span>"
    end
  end
end

# Register the tag with Jekyll
Liquid::Template.register_tag('glossary', Jekyll::GlossaryTag)
