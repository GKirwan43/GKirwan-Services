#!/usr/bin/env bash

# Copyright (c) 2026 GKirwan43
# Author: GKirwan43
# License: MIT
# Source: https://github.com/GKirwan43/GKirwan-Services

source /dev/stdin <<<"$FUNCTIONS_FILE_PATH"
color
verb_ip6
catch_errors
setting_up_container
network_check
update_os

NODE_VERSION="22" setup_nodejs
fetch_and_deploy_gh_release "gkirwan-services" "GKirwan43/GKirwan-Services" "tarball"

msg_info "Building ${APPLICATION}"
cat <<EOF >/opt/gkirwan-services/.env
PORT=3000
HOSTNAME=0.0.0.0
SHOW_PLACEHOLDER_SERVICES=true
EOF
cd /opt/gkirwan-services
export NEXT_TELEMETRY_DISABLED=1
$STD npm ci
$STD npm run build
cp -r .next/static .next/standalone/.next/static
[[ -d public ]] && cp -r public .next/standalone/public
msg_ok "Built ${APPLICATION}"

msg_info "Creating Service"
cat <<EOF >/etc/systemd/system/gkirwan-services.service
[Unit]
Description=GKirwan Services
After=network.target

[Service]
Restart=always
WorkingDirectory=/opt/gkirwan-services/.next/standalone
EnvironmentFile=/opt/gkirwan-services/.env
ExecStart=/usr/bin/node server.js

[Install]
WantedBy=multi-user.target
EOF
systemctl enable -q --now gkirwan-services
msg_ok "Created Service"

motd_ssh
customize
cleanup_lxc
