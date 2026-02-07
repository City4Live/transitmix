require './app'
use Rack::Deflater

# Serve Vite build assets in production
map '/vite' do
  run Rack::Files.new(File.join(File.dirname(__FILE__), 'public', 'vite'))
end

map '/' do
  run Rack::Cascade.new [
    Transitmix::Routes::Status,
    Transitmix::Routes::Lines,
    Transitmix::Routes::Maps,
    Transitmix::Routes::Home
  ]
end
