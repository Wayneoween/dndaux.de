require 'yaml'
require 'optparse'

# Load allowed types
allowed_types = YAML.load_file('_data/allowed_types.yml')

# Load glossary
glossary = YAML.load_file('_data/glossary.yml')['glossary']

# Ensure glossary and allowed types are loaded correctly
if glossary.nil? || !glossary.is_a?(Array)
  puts 'Error: Glossary data is not properly formatted.'
  exit 1
end

if allowed_types.nil? || !allowed_types.is_a?(Array)
  puts 'Error: Allowed types data is not properly formatted.'
  exit 1
end

# Parse command-line options
debug = false
OptionParser.new do |opts|
  opts.banner = 'Usage: validate_glossary_types.rb [options]'

  opts.on('-d', '--debug', 'Enable debug output') do
    debug = true
  end
end.parse!

# Debugging output if enabled
if debug
  puts "Loaded allowed types: #{allowed_types.inspect}"
  puts "Loaded glossary terms: #{glossary.map { |entry| { term: entry['term'], type: entry['type'] } }.inspect}"
end

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
