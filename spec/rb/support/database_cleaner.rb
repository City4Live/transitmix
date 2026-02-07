require 'database_cleaner-sequel'

DatabaseCleaner[:sequel].db = Sequel::Model.db
DatabaseCleaner[:sequel].strategy = :truncation

RSpec.configure do |config|
  config.before(:each) do
    DatabaseCleaner[:sequel].start
  end

  config.after(:each) do
    DatabaseCleaner[:sequel].clean
  end
end
