require './spec/rb/spec_helper.rb'

describe Map do
  it 'has many lines' do
    type = Map.association_reflections[:lines][:type]
    expect(type).to eq :one_to_many
  end

  it 'whitelists mass-assignable columns' do
    expect(Map.allowed_columns).to eq [:name, :center, :zoom_level, :layover,
      :hourly_cost, :service_windows, :speed, :weekdays_per_year, :saturdays_per_year,
      :sundays_per_year, :prefer_service_hours, :prefer_metric_units]
  end

  describe 'serialization' do
    it 'stores center as JSON and deserializes back to an array' do
      center = [37.77, -122.45]
      map = create(:map, center: center)
      map.reload
      expect(map.center).to eq center
    end

    it 'stores service_windows as JSON and deserializes back' do
      windows = [{ 'name' => 'Peak', 'from' => '6am', 'to' => '9am', 'headway' => 10 }]
      map = create(:map, service_windows: windows)
      map.reload
      expect(map.service_windows).to eq windows
    end
  end

  describe 'defaults' do
    it 'sets default values for year fields' do
      map = create(:map)
      map.reload
      expect(map.weekdays_per_year).to eq 255
      expect(map.saturdays_per_year).to eq 55
      expect(map.sundays_per_year).to eq 55
    end
  end

  describe 'timestamps' do
    it 'sets created_at and updated_at on create' do
      map = create(:map)
      map.reload
      expect(map.created_at).not_to be_nil
      expect(map.updated_at).not_to be_nil
    end
  end

  describe '.remix' do
    it 'creates a copy of the map and lines' do
      map = create(:map)
      lines = create_list(:line, 3, map_id: map.id)
      copy = Map.first!(id: map.id).remix

      expect(copy.name).to match map.name
      expect(copy.lines.count).to eq 3
    end

    it 'tracks the map that was remixed from' do
      map = create(:map)
      copy = Map.first!(id: map.id).remix

      expect(copy.remixed_from_id).to eq map.id
    end

    it 'preserves map attributes' do
      map = create(:map, zoom_level: 15, layover: 0.15)
      copy = Map.first!(id: map.id).remix

      expect(copy.zoom_level).to eq map.zoom_level
      expect(copy.layover).to eq map.layover
      expect(copy.center).to eq map.center
    end

    it 'copies line coordinates and color' do
      map = create(:map)
      line = create(:line, map_id: map.id, color: 'red', speed: 15.0)
      copy = Map.first!(id: map.id).remix
      copied_line = copy.lines.first
      expect(copied_line.color).to eq 'red'
      expect(copied_line.speed).to eq 15.0
      expect(copied_line.coordinates).to eq line.coordinates
    end
  end
end
