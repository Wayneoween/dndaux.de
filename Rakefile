require 'yaml'

namespace :glossary do
  desc "Automatically add glossary includes to terms in posts and pages"
  task :autolink do
    puts "Processing glossary auto-linking..."
    
    # Load glossary data
    glossary_file = '_data/glossary.yml'
    unless File.exist?(glossary_file)
      puts "Error: #{glossary_file} not found"
      exit 1
    end
    
    glossary = YAML.load_file(glossary_file) || []
    if glossary.empty?
      puts "Warning: Glossary is empty"
      exit 0
    end
    
    # Sort terms by length (longest first) to avoid partial matches
    sorted_terms = glossary.sort_by { |entry| -entry['term'].length }
    
    # Process posts
    Dir.glob('_posts/**/*.md').each do |file|
      process_file(file, sorted_terms)
    end
    
    # Process pages (excluding certain files)
    Dir.glob('*.md').each do |file|
      next if file == 'glossary.md'
      next if file.start_with?('README')
      process_file(file, sorted_terms)
    end
    
    puts "Glossary auto-linking completed!"
  end
  
  desc "Remove glossary includes from posts and pages"
  task :remove_links do
    puts "Removing glossary includes..."
    
    # Pattern to match our glossary includes
    include_pattern = /{%\s*include\s+glossary_tooltip\.html[^%]*%}/
    
    # Process posts
    Dir.glob('_posts/**/*.md').each do |file|
      content = File.read(file)
      original_content = content.dup
      
      # Extract the term from glossary includes and replace with plain text
      content.gsub!(include_pattern) do |match|
        # Extract term from include
        if match =~ /term=["']([^"']+)["']/
          term = $1
          # Check if there's custom display text
          if match =~ /text=["']([^"']+)["']/
            $1  # Use display text
          else
            term  # Use term name
          end
        else
          match  # Fallback, keep original
        end
      end
      
      if content != original_content
        File.write(file, content)
        puts "  Processed: #{file}"
      end
    end
    
    # Process pages
    Dir.glob('*.md').each do |file|
      next if file == 'glossary.md'
      next if file.start_with?('README')
      
      content = File.read(file)
      original_content = content.dup
      
      # Extract the term from glossary includes and replace with plain text
      content.gsub!(include_pattern) do |match|
        # Extract term from include
        if match =~ /term=["']([^"']+)["']/
          term = $1
          # Check if there's custom display text
          if match =~ /text=["']([^"']+)["']/
            $1  # Use display text
          else
            term  # Use term name
          end
        else
          match  # Fallback, keep original
        end
      end
      
      if content != original_content
        File.write(file, content)
        puts "  Processed: #{file}"
      end
    end
    
    puts "Glossary include removal completed!"
  end
end

def process_file(file, sorted_terms)
  content = File.read(file)
  original_content = content.dup
  
  # Skip if file already contains glossary includes
  return if content.include?('{% include glossary_tooltip.html')
  
  sorted_terms.each do |entry|
    term = entry['term']
    
    # Simple word boundary regex
    pattern = /\b#{Regexp.escape(term)}\b/i
    
    # Replace only the first occurrence with a glossary include
    if content.match?(pattern)
      content.sub!(pattern, "{% include glossary_tooltip.html term=\"#{term}\" %}")
    end
  end
  
  if content != original_content
    File.write(file, content)
    puts "  Processed: #{file}"
  end
end
