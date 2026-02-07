require './spec/rb/spec_helper.rb'

describe Transitmix::Routes::Lines do
  include Transitmix::Routes::TestHelpers

  describe 'GET /api/lines/:id' do
    let(:line) { create(:line) }

    it 'responds with 200 OK' do
      get "/api/lines/#{line.id}"
      expect(last_response.status).to eq 200
    end

    it 'returns the record' do
      get "/api/lines/#{line.id}"
      expect(last_response.body).to eq line.to_json
    end

    context 'not found' do
      it 'responds with 404 NOT FOUND' do
        max = Line.max(:id) || 0
        get "/api/lines/#{ max + 1 }"
        expect(last_response.status).to eq 404
      end
    end
  end

  describe 'POST /api/lines' do
    let(:params) { attributes_for(:line) }

    it 'responds with 201 CREATED' do
      post '/api/lines', params
      expect(last_response.status).to eq 201
    end

    it 'creates a new record' do
      expect { post '/api/lines', params }.to change{ Line.count }.by(+1)
    end

    it 'returns the new record' do
      post '/api/lines', params
      expect(last_response.body).to eq Line.last.to_json
    end

    context 'with missing name' do
      it 'responds with 400 BAD REQUEST' do
        post '/api/lines', { coordinates: [[1.0, 2.0], [3.0, 4.0]] }
        expect(last_response.status).to eq 400
      end
    end

    context 'with missing coordinates' do
      it 'responds with 400 BAD REQUEST' do
        post '/api/lines', { name: 'Test Line' }
        expect(last_response.status).to eq 400
      end
    end

    context 'with all optional fields' do
      it 'creates a line with optional fields' do
        params = attributes_for(:line).merge(
          speed: 25.0, color: 'purple',
          service_windows: [{ start: '06:00', end: '22:00' }],
          hourly_cost: 120, layover: 0.15,
          weekdays_per_year: 260, saturdays_per_year: 52, sundays_per_year: 52
        )
        post '/api/lines', params
        expect(last_response.status).to eq 201
        body = JSON.parse(last_response.body)
        expect(body['speed']).to eq 25.0
        expect(body['color']).to eq 'purple'
        expect(body['hourly_cost']).to eq 120
        expect(body['layover']).to eq 0.15
        expect(body['weekdays_per_year']).to eq 260
        expect(body['saturdays_per_year']).to eq 52
        expect(body['sundays_per_year']).to eq 52
      end
    end
  end

  describe 'GET /api/lines' do
    it 'responds with 200 OK' do
      get '/api/lines'
      expect(last_response.status).to eq 200
    end

    it 'returns the list of lines' do
      lines = create_list(:line, 5)
      get '/api/lines', per: 2
      expect(last_response.body).to eq [lines[4], lines[3]].to_json
    end

    it 'returns empty array when no lines exist' do
      get '/api/lines'
      expect(JSON.parse(last_response.body)).to eq []
    end

    it 'supports page parameter' do
      create_list(:line, 3)
      get '/api/lines', per: 2, page: 2
      expect(JSON.parse(last_response.body).length).to eq 1
    end
  end

  describe 'PUT /api/lines/:id' do
    let!(:line) { create(:line) }

    it 'responds with 200 OK' do
      put "/api/lines/#{line.id}", name: 'Updated Line'
      expect(last_response.status).to eq 200
    end

    it 'updates the record' do
      put "/api/lines/#{line.id}", name: 'Updated Line'
      expect(Line.first!(id: line.id).name).to eq 'Updated Line'
    end

    it 'returns the updated record' do
      put "/api/lines/#{line.id}", name: 'Updated Line'
      body = JSON.parse(last_response.body)
      expect(body['name']).to eq 'Updated Line'
    end

    it 'updates multiple fields at once' do
      put "/api/lines/#{line.id}", name: 'New Name', color: 'orange'
      updated = Line.first!(id: line.id)
      expect(updated.name).to eq 'New Name'
      expect(updated.color).to eq 'orange'
    end

    context 'not found' do
      it 'responds with 404 NOT FOUND' do
        max = Line.max(:id) || 0
        put "/api/lines/#{max + 1}", name: 'Updated Line'
        expect(last_response.status).to eq 404
      end
    end
  end

  describe 'DELETE /api/lines/:id' do
    let!(:line) { create(:line) }

    it 'responds with 200 OK' do
      delete "/api/lines/#{ line.id }"
      expect(last_response.status).to eq 200
    end

    it 'deletes the line' do
      expect { delete "/api/lines/#{ line.id }" }.to change{ Line.count }.by(-1)
    end

    context 'not found' do
      it 'responds with 404 NOT FOUND' do
        max = Line.max(:id) || 0
        delete "/api/lines/#{max + 1}"
        expect(last_response.status).to eq 404
      end
    end
  end

  describe 'map association' do
    it 'creates a line associated with a map' do
      map = create(:map)
      params = attributes_for(:line).merge(map_id: map.id)
      post '/api/lines', params
      expect(last_response.status).to eq 201
      expect(Line.last.map_id).to eq map.id
    end
  end
end
