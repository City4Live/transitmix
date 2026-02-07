require 'database_cleaner-sequel'

DatabaseCleaner[:sequel].db = Sequel::Model.db
DatabaseCleaner[:sequel].strategy = :transaction

RSpec.configure do |config|
  config.around do |example|
    DatabaseCleaner[:sequel].start
    example.run
    DatabaseCleaner[:sequel].clean
  end
end
