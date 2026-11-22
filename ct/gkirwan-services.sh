#!/usr/bin/env bash
_CS_DEFAULT_URL="https://raw.githubusercontent.com/GKirwan43/GKirwan-Services/main"
_cs_boot="${COMMUNITY_SCRIPTS_CORE_DIR:-$(dirname "${BASH_SOURCE[0]}")/../../core}/core/build.func"
source "$_cs_boot" 2>/dev/null || source <(curl -fsSL "${COMMUNITY_SCRIPTS_CORE_URL:-https://raw.githubusercontent.com/community-scripts/core/main}/core/build.func")
# Copyright (c) 2026 GKirwan43
# Author: GKirwan43
# License: MIT
# Source: https://github.com/GKirwan43/GKirwan-Services

APP="GKirwan Services"
var_tags="${var_tags:-nextjs;web}"
var_cpu="${var_cpu:-2}"
var_ram="${var_ram:-2048}"
var_disk="${var_disk:-8}"
var_os="${var_os:-debian}"
var_version="${var_version:-13}"
var_unprivileged="${var_unprivileged:-1}"

header_info "$APP"
variables
color
catch_errors

function update_script() {
  header_info
  check_container_storage
  check_container_resources
  if [[ ! -d /opt/gkirwan-services ]]; then
    msg_error "No ${APP} Installation Found!"
    exit
  fi

  NODE_VERSION="22" setup_nodejs

  if check_for_gh_release "gkirwan-services" "GKirwan43/GKirwan-Services"; then
    msg_info "Stopping Service"
    systemctl stop gkirwan-services
    msg_ok "Stopped Service"

    create_backup /opt/gkirwan-services/.env
    CLEAN_INSTALL=1 fetch_and_deploy_gh_release "gkirwan-services" "GKirwan43/GKirwan-Services" "tarball"
    restore_backup

    msg_info "Updating ${APP}"
    cd /opt/gkirwan-services
    export NEXT_TELEMETRY_DISABLED=1
    $STD npm ci
    $STD npm run build
    cp -r .next/static .next/standalone/.next/static
    [[ -d public ]] && cp -r public .next/standalone/public
    msg_ok "Updated ${APP}"

    msg_info "Starting Service"
    systemctl start gkirwan-services
    msg_ok "Started Service"
    msg_ok "Updated successfully!"
  fi
  exit
}

start
build_container
description

msg_ok "Completed successfully!\n"
echo -e "${CREATING}${GN}${APP} setup has been successfully initialized!${CL}"
echo -e "${INFO}${YW}Access it using the following URL:${CL}"
echo -e "${GATEWAY}${BGN}http://${IP}:3000${CL}"
