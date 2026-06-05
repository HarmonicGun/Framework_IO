# SIEM_INTEGRATION.md — {{NOMBRE_PROYECTO}}

> Plantilla obligatoria. Documenta como este proyecto expone telemetria a SIEM/EDR/XDR.
> Fuente normativa: `FRAMEWORK.md` seccion "Observabilidad y telemetria a SIEM/EDR/XDR".

---

## 1. Endpoints expuestos

| Endpoint | Auth | Formato | Estado |
|---|---|---|---|
| `/health` | publico | JSON | |
| `/ready` | publico | JSON | |
| `/version` | publico | JSON | |
| `/metrics` | `X-SIEM-Token` | Prometheus text | |
| `/siem/events` | `X-SIEM-Token` | NDJSON ECS | |
| `/siem/audit` | `X-SIEM-Token` | NDJSON ECS | |

---

## 2. Modo de salida

- [ ] Pull HTTP (SIEM hace polling)
- [ ] Syslog RFC5424
- [ ] Webhook HTTPS push
- [ ] Stdout JSON (recogido por agente local)

Plataforma SIEM destino: {{Elastic | Wazuh | Graylog | Splunk | Datadog | Sentinel | otra}}

---

## 3. Variables de entorno

```
SIEM_ENABLED=
SIEM_MODE=
SIEM_TOKEN=
SIEM_WEBHOOK_URL=
SIEM_SYSLOG_HOST=
SIEM_SYSLOG_PORT=
SIEM_TLS=
SIEM_RETENTION_DAYS=
SIEM_RATE_LIMIT_PER_SEC=
SIEM_PROJECT_LABEL={{NOMBRE_PROYECTO}}
SIEM_DEPT_LABEL=
```

---

## 4. Categorias emitidas

- [ ] authentication
- [ ] iam
- [ ] configuration
- [ ] web
- [ ] database
- [ ] process
- [ ] network
- [ ] threat
- [ ] file
- [ ] email
- [ ] job

---

## 5. Ejemplo de evento ECS

```json
{
  "@timestamp": "2026-05-25T10:00:00.000Z",
  "ecs.version": "8.11.0",
  "event": {"kind": "event", "category": ["authentication"], "type": ["start"], "outcome": "success"},
  "service": {"name": "{{NOMBRE_PROYECTO}}", "version": "1.0.0"},
  "message": "..."
}
```

---

## 6. Integracion con Wazuh

```
# /var/ossec/etc/ossec.conf en el manager
<integration>
  <name>{{NOMBRE_PROYECTO}}</name>
  <hook_url>https://{{host}}:{{port}}/siem/events</hook_url>
  <api_key>{{SIEM_TOKEN}}</api_key>
  <alert_format>json</alert_format>
</integration>
```

## 7. Integracion con Elastic (Filebeat)

```yaml
filebeat.inputs:
  - type: httpjson
    interval: 30s
    request.url: "https://{{host}}/siem/events?since=cursor"
    request.method: GET
    request.transforms:
      - set:
          target: header.X-SIEM-Token
          value: "{{SIEM_TOKEN}}"
    response.split:
      target: body
output.elasticsearch:
  hosts: ["https://elastic:9200"]
  index: "{{NOMBRE_PROYECTO}}-events-%{+yyyy.MM.dd}"
```

---

## 8. Probes manuales

```bash
curl -fsS http://localhost:{{PORT}}/health
curl -fsS http://localhost:{{PORT}}/ready
curl -fsS -H "X-SIEM-Token: {{token}}" http://localhost:{{PORT}}/siem/events?limit=10
curl -fsS -H "X-SIEM-Token: {{token}}" http://localhost:{{PORT}}/metrics | head
```

---

## 9. Retencion y buffer

- Retencion local: {{30}} dias
- Buffer si SIEM caido: cola en disco `data/siem_buffer/`
- Politica de purga: cron diario que borra eventos > retencion Y `forwarded=1`

---

## 10. Revisiones

| Fecha | Revisor | Hallazgos | Estado |
|---|---|---|---|
| {{FECHA}} | {{REVISOR}} | | Pendiente |
