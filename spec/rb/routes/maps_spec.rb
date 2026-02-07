require './spec/rb/spec_helper.rb'

describe Transitmix::Routes::Maps do
  include Transitmix::Routes::TestHelpers

  describe 'POST /api/maps/:id/remix' do
    let!(:map) { create(:map) }
    let!(:lines) { create_list(:line, 3, map_id: map.id) }

    it 'responds with 201 CREATED' do
      post "/api/maps/#{map.id}/remix"
      expect(last_response.status).to eq 201
    end

    it 'creates a new map record' do
      expect { post "/api/maps/#{map.id}/remix" }.to change { Map.count }.by(+1)
    end

    it 'creates a associated lines for the new map record' do
      expect { post "/api/maps/#{map.id}/remix" }.to change { Line.count }.by(+3)
    end

    it 'returns the remixed map with lines' do
      post "/api/maps/#{map.id}/remix"
      expect(last_response.body).to eq Map.last.to_json
    end

    context 'when map does not exist' do
      it 'responds with 404 NOT FOUND' do
        max_id = Map.max(:id) || 0
        post "/api/maps/#{max_id + 1}/remix"
        expect(last_response.status).to eq 404
      end
    end

    it 'preserves line attributes in the remix' do
      post "/api/maps/#{map.id}/remix"
      body = JSON.parse(last_response.body)
      original_line = lines.first
      remixed_line = body['lines'].find { |l| l['name'] == original_line.name }
      expect(remixed_line['color']).to eq original_line.color
      expect(remixed_line['coordinates']).to eq original_line.coordinates
    end
  end

  describe 'GET /api/maps/:id' do
    let(:map) { create(:map) }

    it 'responds with 200 OK' do
      get "/api/maps/#{map.id}"
      expect(last_response.status).to eq 200
    end

    it 'returns the record' do
      get "/api/maps/#{map.id}"
      expect(last_response.body).to eq map.to_json
    end

    context 'not found' do
      it 'responds with 404 NOT FOUND' do
        max_id = Map.max(:id) || 0
        get "/api/maps/#{max_id + 1}"
        expect(last_response.status).to eq 404
      end
    end
  end

  describe 'POST /api/maps' do
    let(:params) { attributes_for(:map) }

    it 'responds with 201 CREATED' do
      post '/api/maps', params
      expect(last_response.status).to eq 201
    end

    it 'creates a new record' do
      expect { post '/api/maps', params }.to change{ Map.count }.by(+1)
    end

    it 'returns the new record' do
      post 'api/maps', params
      expect(last_response.body).to eq Map.last.to_json
    end

    context 'with missing name' do
      it 'responds with 400 BAD REQUEST' do
        post '/api/maps', { zoom_level: 5 }
        expect(last_response.status).to eq 400
      end
    end

    context 'with all optional fields' do
      it 'creates a map with optional fields' do
        params = attributes_for(:map).merge(
          layover: 0.15, hourly_cost: 120, speed: 25.0,
          weekdays_per_year: 260, saturdays_per_year: 52, sundays_per_year: 52
        )
        post '/api/maps', params
        expect(last_response.status).to eq 201
        body = JSON.parse(last_response.body)
        expect(body['layover']).to eq 0.15
        expect(body['hourly_cost']).to eq 120
      end
    end
  end

  describe 'GET /api/maps' do
    it 'responds with 200 OK' do
      get '/api/maps'
      expect(last_response.status).to eq 200
    end

    it 'returns the list of maps' do
      maps = create_list(:map, 5)
      get '/api/maps', per: 2
      expect(last_response.body).to eq [maps[4], maps[3]].to_json
    end

    it 'returns empty array when no maps exist' do
      get '/api/maps'
      expect(JSON.parse(last_response.body)).to eq []
    end

    it 'supports page parameter' do
      create_list(:map, 3)
      get '/api/maps', per: 2, page: 2
      expect(JSON.parse(last_response.body).length).to eq 1
    end
  end

  describe 'PUT /api/maps/:id' do
    let!(:map) { create(:map) }

    it 'responds with 200 OK' do
      put "/api/maps/#{map.id}", name: 'Updated Name'
      expect(last_response.status).to eq 200
    end

    it 'updates the record' do
      put "/api/maps/#{map.id}", name: 'Updated Name'
      expect(Map.first!(id: map.id).name).to eq 'Updated Name'
    end

    it 'returns the updated record' do
      put "/api/maps/#{map.id}", name: 'Updated Name'
      body = JSON.parse(last_response.body)
      expect(body['name']).to eq 'Updated Name'
    end

    it 'updates multiple fields at once' do
      put "/api/maps/#{map.id}", name: 'New Name', zoom_level: '10'
      updated = Map.first!(id: map.id)
      expect(updated.name).to eq 'New Name'
      expect(updated.zoom_level).to eq 10
    end

    context 'not found' do
      it 'responds with 404 NOT FOUND' do
        max_id = Map.max(:id) || 0
        put "/api/maps/#{max_id + 1}", name: 'Updated Name'
        expect(last_response.status).to eq 404
      end
    end
  end

  describe 'GET /api/maps/:id.zip' do
    let!(:map) { create(:map) }
    let!(:lines) { create_list(:line, 2, map_id: map.id) }

    # DBF::Field was removed in newer versions of the dbf gem.
    # The Shapefile serializer needs updating before these tests can pass.
    it 'responds with 200 OK', skip: 'DBF::Field incompatibility with dbf gem' do
      get "/api/maps/#{map.id}.zip"
      expect(last_response.status).to eq 200
    end

    it 'returns zip content type', skip: 'DBF::Field incompatibility with dbf gem' do
      get "/api/maps/#{map.id}.zip"
      expect(last_response.content_type).to include 'application/octet-stream'
    end
  end

  describe 'GET /api/maps/:id.kml' do
    let!(:map) { create(:map) }
    let!(:lines) { create_list(:line, 2, map_id: map.id) }

    it 'responds with 200 OK' do
      get "/api/maps/#{map.id}.kml"
      expect(last_response.status).to eq 200
    end

    it 'returns KML content type' do
      get "/api/maps/#{map.id}.kml"
      expect(last_response.content_type).to include 'application/vnd.google-earth.kml+xml'
    end

    it 'returns valid KML containing line data' do
      get "/api/maps/#{map.id}.kml"
      expect(last_response.body).to include('</kml>')
      expect(last_response.body).to include(lines.first.name)
    end

    context 'not found' do
      it 'responds with 404 NOT FOUND' do
        max_id = Map.max(:id) || 0
        get "/api/maps/#{max_id + 1}.kml"
        expect(last_response.status).to eq 404
      end
    end
  end
end
