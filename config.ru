require 'sequenceserver'

set :root_path_prefix, '/blast'

SequenceServer.init
run SequenceServer
