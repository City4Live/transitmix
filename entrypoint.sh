#!/bin/sh

rake db:create db:migrate
bundle exec rackup --host 0.0.0.0 --port ${PORT:-3000}
