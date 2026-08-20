# CLOUDFLARE_TUNNEL_PROTOCOL — exponer una app sin exponer el servidor

> Nacido de un hallazgo real (04/08/2026, droplet de un proyecto `<droplet>`): un `cloudflared tunnel --url`
> (quick tunnel de trycloudflare) llevaba **7 dias sirviendo la app a internet** bajo una URL aleatoria
> que **NO aparece en el dash de Cloudflare**: sin WAF, sin Access, sin logs, sin poder revocarla desde
> el panel. Ademas el droplet tenia UFW inactivo, `:22` abierto al mundo (930 intentos invalid-user en
> auth.log) y el dominio real sin registro DNS. Este protocolo existe para que eso NO se repita.

> Conexiones: [[CLAUDE]] | [[FRAMEWORK]] | [[GIT_PROTOCOL]]

---

## PRINCIPIO 0 — el origen nunca se expone

```
La app escucha SOLO en 127.0.0.1.
El unico camino publico es un TUNEL NOMBRADO, creado con la cuenta del dueno de la cuenta,
visible y revocable desde el dash de Cloudflare.
Todo lo demas se cierra: sin puertos publicos, sin IP publica en DNS, sin URLs paralelas.
```

Si una URL sirve la app y no la puedes apagar desde `dash.cloudflare.com`, esa URL es una fuga.

---

## REGLAS DURAS

| # | Regla | Por que |
|---|---|---|
| R1 | **PROHIBIDO `cloudflared tunnel --url`** (quick tunnel / trycloudflare). Ni para demo, ni para "cinco minutos". | Genera URL publica anonima fuera del dash. Caso real: 7 dias viva y nadie la vio. |
| R2 | Tunel **nombrado** (`cloudflared tunnel create <nombre>`), autorizado con `cloudflared tunnel login` **en el dash del dueno de la cuenta**. | Es lo unico que se puede listar, auditar y revocar desde el panel. |
| R3 | cloudflared corre **siempre como servicio** (systemd en droplet / launchd en Mac mini) con `enable` + `Restart=always`. Nunca `nohup`, nunca tmux. | Un proceso suelto no sobrevive reboot y nadie sabe quien lo lanzo. |
| R4 | La app hace bind a `127.0.0.1:<puerto>`. **Nunca `0.0.0.0`.** | Sin bind local, cerrar el firewall no basta. |
| R5 | DNS = **CNAME proxied** (nube naranja) `hostname -> <UUID>.cfargotunnel.com`. **Jamas un registro A a la IP publica.** | Un registro A revela y expone el origen; el tunel deja de servir de nada. |
| R6 | Droplet: **UFW activo**, `default deny incoming`, unica regla `22/tcp on tailscale0`. Puertos publicos 22/80/443/app **cerrados**. | Patron ya vigente en <droplet-a> y <droplet-b>. |
| R7 | Un tunel por proyecto, nombre = proyecto. Credenciales en `/root/.cloudflared/` con permisos `600`. | Trazabilidad: un tunel caido no arrastra a otro proyecto. |
| R8 | Todo tunel nuevo se registra en `infra.html` y en `context_proyectos.md` (dominio, UUID, puerto, maquina). | Si no esta en el inventario, no existe y nadie lo audita. |

---

## PROCEDIMIENTO OFICIAL (FASE 0 -> 6)

### FASE 0 — Precheck (antes de tocar nada)

```bash
ssh root@<ip-tailscale> '
  ss -tulpn | grep LISTEN            # la app debe estar en 127.0.0.1
  systemctl list-units --type=service | grep -iE "cloudflar|uvicorn|gunicorn|nginx"
  ps -eo pid,etime,args | grep [c]loudflared    # caza quick tunnels: busca "tunnel --url"
  ufw status verbose
'
```

Gate: si aparece `cloudflared tunnel --url`, **matarlo antes de seguir** (ver ANTI-PATRONES).

### FASE 1 — Instalar cloudflared (si falta)

```bash
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \
  -o /usr/local/bin/cloudflared && chmod +x /usr/local/bin/cloudflared
cloudflared --version
```

### FASE 2 — Autorizar la zona EN EL DASH DE JOSE (el paso del link)

```bash
ssh root@<ip> 'setsid nohup cloudflared tunnel login > /tmp/cf_login.log 2>&1 < /dev/null & sleep 7; cat /tmp/cf_login.log'
```

Imprime un link `https://dash.cloudflare.com/argotunnel?...`. **Ese link se le pasa al dueno de la cuenta.**
El dueno de la cuenta lo abre logueado en su cuenta, elige la zona del dominio y da Authorize.
cloudflared descarga solo `/root/.cloudflared/cert.pem`.

- Si ya existe `cert.pem`, cloudflared se niega a sobreescribir: moverlo a
  `cert.pem.bak_DDMMAA` antes de repetir el login. Mover `cert.pem` **no tumba** un tunel ya
  corriendo (ese usa el JSON de credenciales, no el cert).
- Verificar que quedo en la cuenta correcta: `cloudflared tunnel list` debe mostrar los tuneles
  conocidos de la organizacion (los tuneles conocidos de la organizacion).
  Si la lista sale vacia o ajena, el login fue con otra cuenta: repetir.

### FASE 3 — Crear el tunel nombrado + ingress

```bash
cloudflared tunnel create <proyecto>          # devuelve UUID y escribe <UUID>.json
```

`/root/.cloudflared/config.yml`:

```yaml
tunnel: <UUID>
credentials-file: /root/.cloudflared/<UUID>.json

ingress:
  - hostname: <dominio>
    service: http://127.0.0.1:<puerto>
  - hostname: www.<dominio>
    service: http://127.0.0.1:<puerto>
  - service: http_status:404
```

La ultima regla catch-all `http_status:404` es obligatoria (cloudflared no arranca sin ella).

### FASE 4 — Servicio (arranca solo, se reinicia solo)

`/etc/systemd/system/cloudflared-<proyecto>.service`:

```ini
[Unit]
Description=Cloudflare Tunnel (<proyecto>)
After=network.target <proyecto>-backend.service
Wants=<proyecto>-backend.service

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/cloudflared --no-autoupdate --config /root/.cloudflared/config.yml tunnel run <proyecto>
Restart=always
RestartSec=3
StandardOutput=append:/var/log/cloudflared-<proyecto>.log
StandardError=append:/var/log/cloudflared-<proyecto>.log

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable --now cloudflared-<proyecto>
systemctl is-enabled cloudflared-<proyecto>   # debe decir enabled
```

**Mac mini:** mismo tunel, distinto supervisor. En vez de systemd va un
LaunchAgent `com.<proyecto>.tunnel.plist` con `KeepAlive=true` y `RunAtLoad=true`
(ver `el manual de Mac mini siempre activo`). En mini NO se toca UFW: no hay IP
publica; la proteccion es el bind a 127.0.0.1 + Tailscale.

### FASE 5 — Ruta DNS (CNAME proxied)

```bash
cloudflared tunnel route dns <proyecto> <dominio>
cloudflared tunnel route dns <proyecto> www.<dominio>
```

Crea en el dash el CNAME `<dominio> -> <UUID>.cfargotunnel.com` proxied. Equivalente manual:
dash > DNS > Add record > CNAME > target `<UUID>.cfargotunnel.com` > Proxy status: **Proxied**.

Verificar: `dig +short <dominio>` debe devolver IPs de Cloudflare (104.x / 172.67.x), **nunca**
la IP del droplet.

### FASE 6 — Cerrar el origen (droplet)

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow in on tailscale0 to any port 22 proto tcp comment 'SSH via Tailscale VPN'
ufw --force enable
ufw status verbose
```

El tunel sigue vivo: cloudflared abre conexiones **salientes**, no necesita puertos entrantes.
Precaucion: si pierdes Tailscale, la entrada de rescate es la consola web de DigitalOcean.

---

## VERIFICACION FINAL (checklist, se corre completo)

```bash
# 1. servicio arriba y persistente
ssh root@<ip> 'systemctl is-active cloudflared-<proyecto>; systemctl is-enabled cloudflared-<proyecto>'

# 2. cero quick tunnels
ssh root@<ip> 'ps -eo pid,args | grep [c]loudflared'      # ninguna linea con "tunnel --url"

# 3. app solo en loopback
ssh root@<ip> 'ss -tulpn | grep LISTEN'                    # app en 127.0.0.1

# 4. firewall
ssh root@<ip> 'ufw status verbose'                         # deny incoming + 22 on tailscale0

# 5. puertos publicos cerrados (desde el MacBook)
for p in 22 80 443 8000; do nc -z -G 5 <ip-publica> $p && echo "$p ABIERTO" || echo "$p cerrado"; done

# 6. dominio sirve por el tunel
curl -s -o /dev/null -w "%{http_code}\n" https://<dominio>/
dig +short <dominio>                                       # IPs de Cloudflare, no la del origen

# 7. no queda URL paralela viva
grep -rhoE "https://[a-z0-9-]+\.trycloudflare\.com" /root /var/log 2>/dev/null | sort -u
```

Todo verde o no se marca como terminado.

---

## ANTI-PATRONES (prohibidos)

| Anti-patron | Como se ve | Como se mata |
|---|---|---|
| Quick tunnel | `cloudflared tunnel --url http://127.0.0.1:8000` | `kill <pid>`; la URL muere sola (queda 530). Buscar la URL en logs y confirmar que ya no responde. |
| cloudflared suelto | proceso sin unidad systemd/launchd | Crear la unidad (FASE 4) y matar el suelto. |
| DNS a la IP publica | registro A apuntando al droplet | Borrar el A, poner CNAME proxied (FASE 5). |
| UFW inactivo en droplet | `Status: inactive` | FASE 6. |
| `0.0.0.0` en el bind | `ss -tulpn` muestra `0.0.0.0:8000` | Cambiar `--host 127.0.0.1` en el unit y reiniciar. |
| Login con otra cuenta | `cloudflared tunnel list` no muestra los tuneles GO | Mover cert.pem y repetir FASE 2 con el link que autoriza el dueno de la cuenta. |
| Tunel sin registrar | no aparece en `infra.html` | R8: registrarlo el mismo dia. |

---

## AUDITORIA PERIODICA (cualquier maquina, 30 segundos)

```bash
ps -eo pid,etime,args | grep [c]loudflared | grep -- "--url"   # fugas
cloudflared tunnel list                                        # inventario vs infra.html
```

Se corre en el checkpoint (MIE) sobre toda maquina que exponga algo. Un tunel en la lista que
nadie reclama = se apaga y se pregunta despues.

---

---

## REGISTRO — casos aplicados

Cada aplicacion del protocolo se anota aqui: fecha, maquina, proyecto, resultado y pendientes.
Si no queda registrada, no se considera terminada (R8).
