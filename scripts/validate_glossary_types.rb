require 'yaml'

# Load allowed types
allowed_types = YAML.load_file('_data/allowed_types.yml')

# Load glossary
glossary = YAML.load_file('_data/glossary.yml')['glossary']

# Validate types
invalid_entries = glossary.reject { |entry| allowed_types.include?(entry['type']) }

if invalid_entries.any?
  puts 'The following glossary entries have invalid types:'
  invalid_entries.each do |entry|
    puts "- Term: #{entry['term']}, Type: #{entry['type']}"
  end
  exit 1
end

puts 'All glossary types are valid.'
