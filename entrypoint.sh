#!/bin/sh

rake db:create db:migrate
bundle exec rackup
