require 'yaml'

def check_github_actions_or_override
  # Check if we're running in GitHub Actions
  return if ENV['GITHUB_ACTIONS'] == 'true'
  
  # Check if user explicitly wants to run locally
  return if ARGV.include?('--trust-me-bro')
  
  puts <<~ERROR
    ⚠️  HOLD UP! ⚠️
    
    This Rake task is designed for GitHub Actions and will modify your source files.
    
    🎯 RECOMMENDED: Let GitHub Actions handle this automatically
       → Your markdown stays clean and editable
       → Tooltips are processed during build time
       → No clutter in your source files
    
    🛠️  If you REALLY want to run this locally anyway:
       → Use: rake glossary:autolink -- --trust-me-bro
       → This will modify your source files
       → You can undo with: rake glossary:remove_links -- --trust-me-bro
    
    💡 TIP: The system works perfectly with GitHub Actions - 
            just write natural markdown and let the automation handle it!
  ERROR
  
  exit 1
end

namespace :glossary do
  desc "Automatically add glossary includes to terms in posts and pages (GitHub Actions only)"
  task :autolink do
    check_github_actions_or_override
    
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
  
  desc "Remove glossary includes from posts and pages (GitHub Actions only)"
  task :remove_links do
    check_github_actions_or_override
    
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
