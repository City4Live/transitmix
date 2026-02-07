require_relative '../database_helper'
include DatabaseHelper

desc 'Run an interactive REPL session'
task :console do
  console
end

namespace :db do
  desc 'Reset the database'
  task :reset do
    reset
  end

  desc 'Drop the database'
  task :drop do
    drop_db
  end

  desc 'Create the database'
  task :create do
    create_db
  end

  desc 'Migrate to latest or specifiy a version'
  task :migrate, [:version] do |t, args|
    migrate_db(args[:version])
  end

  desc 'Rollback to the previous version or specify a version'
  task :rollback, [:version] do |t, args|
    rollback_db(args[:version])
  end

  desc 'Dump the schema as sql'
  task :schema_dump do
    schema_dump
  end
end

namespace :db do
  namespace :test do
    desc 'Create the test database, run migrations'
    task :prepare do
      db_user = ENV['DATABASE_USER'] || 'postgres'
      db_pass = ENV['DATABASE_PASSWORD'] || 'postgres'
      db_host = ENV.fetch('DATABASE_HOST', 'postgres')
      test_db_url = "postgres://#{db_user}:#{db_pass}@#{db_host}:5432/transitmix_test"
      maintenance_url = "postgres://#{db_user}:#{db_pass}@#{db_host}:5432/postgres"

      require 'sequel'
      Sequel.extension :migration

      # Create the test database if it doesn't exist
      maintenance = Sequel.connect(maintenance_url)
      unless maintenance.fetch("SELECT 1 FROM pg_database WHERE datname = 'transitmix_test'").any?
        maintenance.run("CREATE DATABASE transitmix_test")
        puts 'Created transitmix_test database.'
      end
      maintenance.disconnect

      # Run migrations
      db = Sequel.connect(test_db_url, encoding: 'unicode')
      Sequel::Migrator.run(db, File.expand_path('../../../db/migrations', __FILE__))
      db.disconnect
      puts 'Test database ready.'
    end
  end
end

namespace :g do
  desc 'Generate a new migration file'
  task :migration, [:name] do |t, args|
    raise 'Must pass name: rake g:migration[add_index_to_table]' unless args[:name]
    generate_migration(args[:name])
  end
end
