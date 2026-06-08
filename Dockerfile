# Use official Ruby image with Debian Bookworm (ARM64 compatible)
FROM ruby:3.3-bookworm

# Install dependencies for Jekyll and native extensions
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    libffi-dev \
    libxslt-dev \
    libxml2-dev \
    liblzma-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /srv/jekyll

# Install Jekyll and Bundler globally
RUN gem install jekyll bundler

# Expose port for Jekyll server
EXPOSE 4000

# Default command (can be overridden by docker-compose)
CMD ["bundle", "exec", "jekyll", "serve", "--drafts", "--host", "0.0.0.0", "--port", "4000"]
