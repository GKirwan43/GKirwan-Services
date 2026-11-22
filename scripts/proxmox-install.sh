#!/usr/bin/env bash
# GKirwan Services - Proxmox LXC installer (private repo).
# Copy this file to the Proxmox VE host, then run as root:
#   bash proxmox-install.sh
#
# The repo is private, so you need a read-only GitHub fine-grained token
# (Repository: GKirwan-Services only, Contents: Read-only). You are prompted
# for it, or set var_token first.
#
# Override defaults by setting variables first, e.g.:
#   var_cpu=4 var_ram=4096 var_storage=local-zfs bash proxmox-install.sh
#
# Updating later: run `update` inside the container, or from the host:
#   pct exec <CTID> -- update

set -Eeuo pipefail

# ---------- Settings (override with environment variables) ----------
APP="gkirwan-services"
var_repo="${var_repo:-github.com/GKirwan43/GKirwan-Services.git}"   # no https:// prefix
var_token="${var_token:-}"
var_branch="${var_branch:-main}"
var_port="${var_port:-3000}"

var_ctid="${var_ctid:-}"                     # empty = next free ID
var_hostname="${var_hostname:-$APP}"
var_cpu="${var_cpu:-2}"
var_ram="${var_ram:-2048}"                   # MB; the build needs ~2 GB
var_swap="${var_swap:-1024}"                 # MB
var_disk="${var_disk:-8}"                    # GB
var_storage="${var_storage:-local-lvm}"      # container disk storage
var_template_storage="${var_template_storage:-local}"
var_bridge="${var_bridge:-vmbr0}"
var_net="${var_net:-dhcp}"                   # dhcp, or e.g. 192.168.1.50/24,gw=192.168.1.1
var_node_major="${var_node_major:-22}"

msg()  { echo -e "\e[32m[+]\e[0m $*"; }
fail() { echo -e "\e[31m[x]\e[0m $*" >&2; exit 1; }

# ---------- Host checks ----------
[ "$(id -u)" -eq 0 ] || fail "Run as root on the Proxmox host."
command -v pct >/dev/null && command -v pveam >/dev/null || fail "pct/pveam not found. Run this on a Proxmox VE host."
command -v git >/dev/null || fail "git is required on the host (apt install git)."

if [ -z "$var_token" ]; then
  read -rsp "GitHub read-only token for the private repo: " var_token </dev/tty
  echo
fi
[ -n "$var_token" ] || fail "A GitHub token is required (the repo is private)."
CLONE_URL="https://x-access-token:${var_token}@${var_repo}"
git ls-remote "$CLONE_URL" HEAD >/dev/null 2>&1 \
  || fail "Cannot read the repo with that token. Check its repository access and Contents: Read permission."

[ -n "$var_ctid" ] || var_ctid="$(pvesh get /cluster/nextid)"
pct status "$var_ctid" >/dev/null 2>&1 && fail "Container $var_ctid already exists."

# ---------- Template ----------
msg "Looking for a Debian 12 template..."
pveam update >/dev/null
TEMPLATE="$(pveam available --section system | awk '{print $2}' | grep '^debian-12-standard' | sort -V | tail -1)"
[ -n "$TEMPLATE" ] || fail "No debian-12-standard template found."
if ! pveam list "$var_template_storage" | grep -q "$TEMPLATE"; then
  msg "Downloading $TEMPLATE..."
  pveam download "$var_template_storage" "$TEMPLATE"
fi

# ---------- Create container ----------
case "$var_net" in
  dhcp) NET0="name=eth0,bridge=${var_bridge},ip=dhcp" ;;
  *)    NET0="name=eth0,bridge=${var_bridge},ip=${var_net}" ;;
esac

msg "Creating container $var_ctid ($var_cpu CPU, ${var_ram}MB RAM, ${var_disk}GB disk)..."
pct create "$var_ctid" "${var_template_storage}:vztmpl/${TEMPLATE}" \
  --hostname "$var_hostname" \
  --cores "$var_cpu" \
  --memory "$var_ram" \
  --swap "$var_swap" \
  --rootfs "${var_storage}:${var_disk}" \
  --net0 "$NET0" \
  --unprivileged 1 \
  --features nesting=1 \
  --onboot 1 \
  --tags "nextjs;gkirwan"

msg "Starting container..."
pct start "$var_ctid"

msg "Waiting for network..."
for _ in $(seq 1 30); do
  pct exec "$var_ctid" -- getent hosts deb.debian.org >/dev/null 2>&1 && break
  sleep 2
done
pct exec "$var_ctid" -- getent hosts deb.debian.org >/dev/null 2>&1 || fail "Container has no network/DNS."

# ---------- Files that live inside the container ----------
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

cat > "$WORK/config" <<EOF
REPO="$CLONE_URL"
BRANCH="$var_branch"
PORT="$var_port"
APP_DIR="/opt/$APP"
SERVICE="$APP"
EOF

# `update`: clones on first run, afterwards rebuilds only if GitHub has new commits.
cat > "$WORK/update" <<'EOF'
#!/usr/bin/env bash
set -Eeuo pipefail
source /etc/gkirwan-services/config
FORCE="${1:-}"

if [ ! -d "$APP_DIR/.git" ]; then
  echo "[+] First run: cloning $REPO"
  git clone --branch "$BRANCH" "$REPO" "$APP_DIR"
  FORCE="--force"
fi

cd "$APP_DIR"
git fetch origin "$BRANCH" --quiet
LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse "origin/$BRANCH")"

if [ "$LOCAL" = "$REMOTE" ] && [ "$FORCE" != "--force" ]; then
  echo "[+] Already up to date (${LOCAL:0:7})."
  exit 0
fi

echo "[+] Updating ${LOCAL:0:7} -> ${REMOTE:0:7}"
git reset --hard "origin/$BRANCH"

# A failed build stops here (set -e) and the old version keeps running.
npm ci
npm run build

# Standalone output does not include these.
rm -rf .next/standalone/.next/static .next/standalone/public
cp -r .next/static .next/standalone/.next/static
[ -d public ] && cp -r public .next/standalone/public

chown -R www-data:www-data .next/standalone
systemctl restart "$SERVICE"
echo "[+] Now running ${REMOTE:0:7}."
EOF

cat > "$WORK/service" <<EOF
[Unit]
Description=GKirwan Services
After=network.target

[Service]
WorkingDirectory=/opt/$APP/.next/standalone
EnvironmentFile=/etc/$APP/app.env
Environment=HOSTNAME=0.0.0.0
ExecStart=/usr/bin/node server.js
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
EOF

cat > "$WORK/app.env" <<EOF
PORT=$var_port
SHOW_PLACEHOLDER_SERVICES=true
EOF

cat > "$WORK/setup.sh" <<EOF
#!/usr/bin/env bash
set -Eeuo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y curl git ca-certificates gnupg
curl -fsSL https://deb.nodesource.com/setup_${var_node_major}.x | bash -
apt-get install -y nodejs

mkdir -p /etc/$APP
mv /tmp/gk/config /etc/$APP/config
chmod 600 /etc/$APP/config
mv /tmp/gk/app.env /etc/$APP/app.env
install -m 755 /tmp/gk/update /usr/local/bin/update
mv /tmp/gk/service /etc/systemd/system/$APP.service
systemctl daemon-reload
systemctl enable $APP

# Clone + build + start (the service starts at the end of update)
/usr/local/bin/update
EOF

msg "Installing inside the container (this builds the app, ~3-5 minutes)..."
pct exec "$var_ctid" -- mkdir -p /tmp/gk
for f in config update service app.env setup.sh; do
  pct push "$var_ctid" "$WORK/$f" "/tmp/gk/$f"
done
pct exec "$var_ctid" -- bash /tmp/gk/setup.sh
pct exec "$var_ctid" -- rm -rf /tmp/gk

IP="$(pct exec "$var_ctid" -- hostname -I | awk '{print $1}')"
msg "Done. Open: http://${IP}:${var_port}"
msg "Update later with: pct exec $var_ctid -- update   (or run 'update' in the container)"
