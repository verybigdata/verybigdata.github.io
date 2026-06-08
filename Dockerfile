# Matches the GitHub Pages build environment
FROM ghcr.io/actions/jekyll-build-pages:v1.0.13

# Set working directory
WORKDIR /srv/jekyll

# Expose port for Jekyll server
EXPOSE 4000

# Override the entrypoint to allow running jekyll serve
ENTRYPOINT []

CMD ["bundle", "exec", "jekyll", "serve", "--drafts", "--host", "0.0.0.0", "--port", "4000"]