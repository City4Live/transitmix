require 'json'

module Sinatra
  module ViteHelpers
    class ManifestNotFound < StandardError; end
    class AssetNotFound < StandardError; end

    def self.registered(app)
      app.helpers ViteHelpers
    end

    # Check if we're in development mode (Vite dev server running)
    def vite_dev_mode?
      ENV['RACK_ENV'] != 'production' && !ENV['USE_VITE_BUILD']
    end

    # Get the Vite dev server URL
    def vite_dev_server_url
      ENV.fetch('VITE_DEV_SERVER_URL', 'http://localhost:3000')
    end

    # Read and cache the Vite manifest in production
    def vite_manifest
      return @vite_manifest if defined?(@vite_manifest)

      manifest_path = File.join(settings.root, 'public', 'vite', '.vite', 'manifest.json')

      unless File.exist?(manifest_path)
        raise ManifestNotFound, "Vite manifest not found at #{manifest_path}. Run 'npm run build' first."
      end

      @vite_manifest = JSON.parse(File.read(manifest_path))
    end

    # Get the path to a Vite asset
    def vite_asset_path(name)
      if vite_dev_mode?
        "#{vite_dev_server_url}/#{name}"
      else
        entry = vite_manifest[name]
        raise AssetNotFound, "Asset '#{name}' not found in Vite manifest" unless entry
        "/vite/#{entry['file']}"
      end
    end

    # Generate script tag for the main JS entry point
    def vite_js_tag(entry_point = 'index.html')
      if vite_dev_mode?
        # In dev mode, load from Vite dev server with module support
        # Use src/main.js directly since index.html is the build entry
        <<~HTML
          <script type="module" src="#{vite_dev_server_url}/@vite/client"></script>
          <script type="module" src="#{vite_dev_server_url}/src/main.js"></script>
        HTML
      else
        # In production, load the built JS file
        entry = vite_manifest[entry_point]
        raise AssetNotFound, "Entry '#{entry_point}' not found in Vite manifest" unless entry

        js_path = "/vite/#{entry['file']}"
        html = %(<script type="module" src="#{js_path}"></script>\n)

        # Add preload hints for imported chunks
        if entry['imports']
          entry['imports'].each do |import|
            imported = vite_manifest[import]
            if imported
              html += %(<link rel="modulepreload" href="/vite/#{imported['file']}">\n)
            end
          end
        end

        html
      end
    end

    # Generate CSS link tags
    def vite_css_tags(entry_point = 'index.html')
      if vite_dev_mode?
        # In dev mode, CSS is injected by Vite via JS
        ''
      else
        entry = vite_manifest[entry_point]
        return '' unless entry && entry['css']

        entry['css'].map do |css_file|
          %(<link rel="stylesheet" href="/vite/#{css_file}">)
        end.join("\n")
      end
    end

    # Combined helper for both JS and CSS
    def vite_tags(entry_point = 'src/main.js')
      css = vite_css_tags(entry_point)
      js = vite_js_tag(entry_point)
      "#{css}\n#{js}"
    end
  end

  register ViteHelpers
end
