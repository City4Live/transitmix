FactoryBot.define do
  factory :line, class: Line do
    name { FFaker::Lorem.words.join(' ') }
    color { ['red', 'green', 'blue'].sample }
    coordinates {
      Array.new(2) {
        Array.new((2..5).to_a.sample) {
          [FFaker::Geolocation.lat, FFaker::Geolocation.lng]
        }
      }
    }
  end

  factory :map, class: Map do
    name { FFaker::Lorem.words.join(' ') }
    zoom_level { (1..4).to_a.sample }
    center { [FFaker::Geolocation.lat, FFaker::Geolocation.lng] }
  end
end
