FROM caddy:2
WORKDIR /etc/caddy

# Copy a dynamic entrypoint that renders Caddyfile from env vars
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80 443
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
