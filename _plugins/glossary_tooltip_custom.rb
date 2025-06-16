# Custom override for jekyll-glossary_tooltip to add automatic glossary links
require 'jekyll-glossary_tooltip'

module Jekyll
  module GlossaryTooltip
    class Tag < Liquid::Tag
      private
      
      # Override the render_tooltip_url method to always link to glossary with search
      def render_tooltip_url(entry, context)
        site_url = context.registers[:site].config['url'] || ''
        baseurl = context.registers[:site].config['baseurl'] || ''
        
        # Create a link to the glossary page with the term as search parameter
        glossary_url = "#{site_url}#{baseurl}/glossary/?search=#{CGI.escape(entry['term'])}"
        
        return " <br><a class=\"jekyll-glossary-source-link\" href=\"#{glossary_url}\" target=\"_blank\"></a>"
      end
    end
  end
end
