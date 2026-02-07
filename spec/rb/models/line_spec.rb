require './spec/rb/spec_helper'

describe Line do
  it 'whitelists mass-assignable columns' do
    whitelist = [:coordinates, :name, :speed, :color, :map_id, :service_windows,
                 :weekdays_per_year, :saturdays_per_year, :sundays_per_year,
                 :layover, :hourly_cost]
    expect(Line.allowed_columns).to eq whitelist
  end

  it 'belongs to a map' do
    map = create(:map)
    line = create(:line, map_id: map.id)
    expect(line.map_id).to eq map.id
  end

  describe '#to_flattened_lnglat' do
    it 'flattens and reverses coordinates to lng,lat' do
      line = create(:line, coordinates: [[[37.77, -122.45], [37.78, -122.46]]])
      result = line.to_flattened_lnglat
      expect(result).to eq [[-122.45, 37.77], [-122.46, 37.78]]
    end
  end

  describe 'serialization' do
    it 'stores coordinates as JSON and deserializes back to arrays' do
      coords = [[[37.77, -122.45], [37.78, -122.46]]]
      line = create(:line, coordinates: coords)
      line.reload
      expect(line.coordinates).to eq coords
    end
  end
end
