require './spec/rb/spec_helper'

describe Transitmix::Models::AppStatus do
  subject { described_class.new }

  describe '#status' do
    it "returns 'ok' when database has tables" do
      expect(subject.status).to eq 'ok'
    end
  end

  describe '#payload' do
    it 'returns a hash with expected keys' do
      payload = subject.payload
      expect(payload).to have_key(:dependencies)
      expect(payload).to have_key(:status)
      expect(payload).to have_key(:updated)
      expect(payload).to have_key(:resources)
    end

    it 'includes the current status' do
      payload = subject.payload
      expect(payload[:status]).to eq 'ok'
    end
  end
end
