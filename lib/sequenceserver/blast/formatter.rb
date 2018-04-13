require 'forwardable'

module SequenceServer
  module BLAST
    # Formats BLAST+ archive file format into other file formats.
    class Formatter
      class << self
        alias_method :run, :new
      end

      extend Forwardable
      def_delegators SequenceServer, :config, :logger, :sys

      def initialize(job, type)
        @job = job
        @format, @mime, @specifiers = OUTFMT[type]
        @type = type

        validate && run
      end

      attr_reader :job, :type

      attr_reader :format, :mime, :specifiers

      def file
        @file ||= File.join(job.dir, filename)
      end

      def filename
        @filename ||=
          "sequenceserver-#{type}_report.#{mime}"
      end

      private

      def run
        return if File.exist?(file)
        command =
          "blast_formatter -archive '#{job.stdout}'" \
          " -outfmt '#{format} #{specifiers}'" \
          " -out '#{file}'"
        sys(command, path: config[:bin], dir: DOTDIR)
      rescue CommandFailed => e
        fail SystemError, e.stderr
      end

      def validate
        return true if archive_file && format &&
                       File.exist?(archive_file)
        fail InputError, <<MSG
Incorrect request parameters. Please ensure that requested file name is
correct and the file type is either xml or tsv.
MSG
      end
    end
  end
end

# References
# ----------
# [1]: http://www.ncbi.nlm.nih.gov/books/NBK1763/
