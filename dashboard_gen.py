#!/usr/bin/env python3
"""Dashboard checkpoint — generador HTML con datos de ejemplo genericos."""

import json
from pathlib import Path

projects_data = {
    "proyecto_alpha": {
        "owner": "[Owner Alpha]",
        "status": "Produccion",
        "commits_week": 12,
        "tests_new": 340,
        "tests_total": 1694,
        "tests_pass": 1694,
        "MVP": 100,
        "traffic_light": "green"
    },
    "proyecto_beta": {
        "owner": "[Owner Beta]",
        "status": "Desarrollo",
        "commits_week": 5,
        "tests_new": 12,
        "tests_total": 96,
        "tests_pass": 96,
        "MVP": 55,
        "traffic_light": "green"
    },
    "proyecto_gamma": {
        "owner": "[Owner Gamma]",
        "status": "Produccion",
        "commits_week": 0,
        "tests_new": 0,
        "tests_total": 0,
        "tests_pass": 0,
        "MVP": 99,
        "traffic_light": "green"
    },
    "proyecto_delta": {
        "owner": "[Owner Delta]",
        "status": "Review",
        "commits_week": 3,
        "tests_new": 0,
        "tests_total": 0,
        "tests_pass": 0,
        "MVP": 85,
        "traffic_light": "yellow"
    }
}


def build_html_desktop():
    total_commits = sum(p["commits_week"] for p in projects_data.values())
    total_tests_new = sum(p["tests_new"] for p in projects_data.values())
    total_tests_pass = sum(p["tests_pass"] for p in projects_data.values())

    project_names = [k.replace("_", " ").title() for k in projects_data.keys()]
    commits_list = [projects_data[k]["commits_week"] for k in projects_data.keys()]
    tests_list = [projects_data[k]["tests_pass"] for k in projects_data.keys()]
    mvp_list = [projects_data[k]["MVP"] for k in projects_data.keys()]

    work_labels = ['Backend/DB', 'Frontend', 'Testing', 'Docs', 'Agentes']
    work_values = [25, 30, 20, 15, 10]

    commits_json = json.dumps(project_names)
    commits_data = json.dumps(commits_list)
    tests_json = json.dumps(tests_list)
    mvp_json = json.dumps(mvp_list)
    work_labels_json = json.dumps(work_labels)
    work_values_json = json.dumps(work_values)

    html_head = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Checkpoint</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 40px 20px;
            color: #333;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        .header {
            background: linear-gradient(90deg, #FB670B 0%, #ff8c3a 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 40px;
            box-shadow: 0 8px 32px rgba(251, 103, 11, 0.2);
        }
        .header h1 { font-size: 32px; margin-bottom: 10px; }
        .header p { font-size: 16px; opacity: 0.95; }

        .signals {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }
        .signal {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-left: 4px solid #FB670B;
        }
        .signal-title { font-size: 14px; color: #666; margin-bottom: 10px; }
        .signal-value { font-size: 32px; font-weight: bold; color: #FB670B; }
        .signal-unit { font-size: 12px; color: #999; margin-top: 5px; }

        .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin-bottom: 40px;
        }
        .chart-container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .chart-title { font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #333; }

        .table-container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            grid-column: 1 / -1;
        }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #f9f9f9; border-bottom: 2px solid #FB670B; }
        th { padding: 12px; text-align: left; font-weight: 600; color: #333; font-size: 13px; }
        td { padding: 12px; border-bottom: 1px solid #eee; font-size: 13px; }
        tr:hover { background: #f9f9f9; }

        .traffic-light {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .traffic-light.green { background: #16c784; }
        .traffic-light.yellow { background: #eab308; }
        .traffic-light.red { background: #ef4444; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 40px; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Checkpoint Semanal</h1>
            <p>Reporte intermedio de avances</p>
        </div>

        <div class="signals">
            <div class="signal">
                <div class="signal-title">CAMBIOS SEMANA</div>
                <div class="signal-value">""" + str(total_commits) + """</div>
                <div class="signal-unit">commits</div>
            </div>
            <div class="signal">
                <div class="signal-title">TESTS NUEVOS</div>
                <div class="signal-value">""" + str(total_tests_new) + """</div>
                <div class="signal-unit">casos</div>
            </div>
            <div class="signal">
                <div class="signal-title">TESTS PASANDO</div>
                <div class="signal-value">""" + str(total_tests_pass) + """</div>
                <div class="signal-unit">casos</div>
            </div>
        </div>

        <div class="grid">
            <div class="chart-container">
                <div class="chart-title">Histograma de Cambios por Proyecto</div>
                <canvas id="commitChart"></canvas>
            </div>

            <div class="chart-container">
                <div class="chart-title">Distribucion de Trabajo (Dona)</div>
                <canvas id="workChart"></canvas>
            </div>

            <div class="chart-container">
                <div class="chart-title">Conteo de Tests Pasando</div>
                <canvas id="testChart"></canvas>
            </div>

            <div class="chart-container">
                <div class="chart-title">Progreso MVP por Proyecto</div>
                <canvas id="mvpChart"></canvas>
            </div>
        </div>

        <div class="table-container">
            <div class="chart-title">Resumen de Proyectos</div>
            <table>
                <thead>
                    <tr>
                        <th>Proyecto</th>
                        <th>Owner</th>
                        <th>Estado</th>
                        <th>Cambios</th>
                        <th>Tests</th>
                        <th>MVP %</th>
                        <th>Semaforo</th>
                    </tr>
                </thead>
                <tbody>"""

    semaforo_map = {"green": "VERDE", "yellow": "AMARILLO", "red": "ROJO"}

    for proj_key, proj_data in projects_data.items():
        proj_name = proj_key.replace("_", " ").title()
        tl = proj_data['traffic_light']
        html_head += f"""
                    <tr>
                        <td><strong>{proj_name}</strong></td>
                        <td>{proj_data['owner']}</td>
                        <td>{proj_data['status']}</td>
                        <td>{proj_data['commits_week']}</td>
                        <td>{proj_data['tests_pass']}</td>
                        <td>{proj_data['MVP']}%</td>
                        <td><span class="traffic-light {tl}"></span>{semaforo_map.get(tl, tl.upper())}</td>
                    </tr>"""

    html_tail = """
                </tbody>
            </table>
        </div>

        <div class="footer">
            <p>Reporte automatizado del portafolio</p>
        </div>
    </div>

    <script>
        const commitCtx = document.getElementById('commitChart').getContext('2d');
        new Chart(commitCtx, {
            type: 'bar',
            data: {
                labels: """ + commits_json + """,
                datasets: [{
                    label: 'Commits',
                    data: """ + commits_data + """,
                    backgroundColor: '#FB670B',
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true } }
            }
        });

        const workCtx = document.getElementById('workChart').getContext('2d');
        const colors = ['#FB670B', '#16c784', '#4db6ff', '#b18cff', '#14B8A6'];
        new Chart(workCtx, {
            type: 'doughnut',
            data: {
                labels: """ + work_labels_json + """,
                datasets: [{
                    data: """ + work_values_json + """,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });

        const testCtx = document.getElementById('testChart').getContext('2d');
        new Chart(testCtx, {
            type: 'bar',
            data: {
                labels: """ + commits_json + """,
                datasets: [{
                    label: 'Tests Pasando',
                    data: """ + tests_json + """,
                    backgroundColor: '#16c784',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });

        const mvpCtx = document.getElementById('mvpChart').getContext('2d');
        new Chart(mvpCtx, {
            type: 'bar',
            data: {
                labels: """ + commits_json + """,
                datasets: [{
                    label: 'Progreso MVP %',
                    data: """ + mvp_json + """,
                    backgroundColor: '#4db6ff',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { min: 0, max: 100 } }
            }
        });
    </script>
</body>
</html>
"""
    return html_head + html_tail


def build_html_mobile():
    html = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkpoint Semanal</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 390px; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
            background: linear-gradient(180deg, #FB670B 0%, #ff8c3a 100%);
            padding: 0;
            color: #333;
        }
        .screen { width: 390px; margin: 0 auto; background: white; }
        .header {
            background: linear-gradient(90deg, #FB670B 0%, #ff8c3a 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }
        .header h1 { font-size: 20px; margin-bottom: 5px; }
        .header p { font-size: 12px; opacity: 0.9; }

        .signals {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 20px;
            background: #f9f9f9;
        }
        .signal {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-left: 3px solid #FB670B;
        }
        .signal-title { font-size: 12px; color: #999; margin-bottom: 5px; }
        .signal-value { font-size: 24px; font-weight: bold; color: #FB670B; }

        .section-title {
            font-size: 14px;
            font-weight: 600;
            padding: 15px 20px 10px 20px;
            color: #333;
            background: #f9f9f9;
        }

        .chart-container {
            padding: 20px;
            background: white;
            margin-bottom: 1px;
        }

        .project-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            padding: 20px;
            background: white;
        }
        .project-card {
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #eee;
            background: #f9f9f9;
        }
        .project-name { font-size: 11px; font-weight: 600; color: #333; margin-bottom: 5px; }
        .project-stat { font-size: 13px; font-weight: 600; color: #FB670B; margin-bottom: 2px; }
        .project-label { font-size: 10px; color: #999; }

        .footer { padding: 20px; text-align: center; font-size: 11px; color: #999; background: #f9f9f9; }
    </style>
</head>
<body>
    <div class="screen">
        <div class="header">
            <h1>Checkpoint Semanal</h1>
            <p>Reporte intermedio</p>
        </div>

        <div class="signals">
            <div class="signal">
                <div class="signal-title">Cambios esta semana</div>
                <div class="signal-value">20</div>
            </div>
            <div class="signal">
                <div class="signal-title">Tests nuevos</div>
                <div class="signal-value">352</div>
            </div>
            <div class="signal">
                <div class="signal-title">Tests pasando</div>
                <div class="signal-value">1790</div>
            </div>
        </div>

        <div class="section-title">Distribucion de trabajo</div>
        <div class="chart-container">
            <canvas id="workChart" style="max-width: 100%; max-height: 200px;"></canvas>
        </div>

        <div class="section-title">Proyectos activos</div>
        <div class="project-grid">
            <div class="project-card">
                <div class="project-name">Proyecto Alpha</div>
                <div class="project-stat">340 tests</div>
                <div class="project-label">Produccion</div>
            </div>
            <div class="project-card">
                <div class="project-name">Proyecto Beta</div>
                <div class="project-stat">96 tests</div>
                <div class="project-label">Desarrollo</div>
            </div>
            <div class="project-card">
                <div class="project-name">Proyecto Gamma</div>
                <div class="project-stat">14 tests</div>
                <div class="project-label">Nueva</div>
            </div>
            <div class="project-card">
                <div class="project-name">Proyecto Delta</div>
                <div class="project-stat">Produccion</div>
                <div class="project-label">Estable</div>
            </div>
        </div>

        <div class="footer">
            <p>Reporte automatizado del portafolio</p>
        </div>
    </div>

    <script>
        const workCtx = document.getElementById('workChart').getContext('2d');
        new Chart(workCtx, {
            type: 'doughnut',
            data: {
                labels: ['Backend/DB', 'Frontend', 'Testing', 'Docs', 'Agentes'],
                datasets: [{
                    data: [25, 30, 20, 15, 10],
                    backgroundColor: ['#FB670B', '#16c784', '#4db6ff', '#b18cff', '#14B8A6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 10 } } }
                }
            }
        });
    </script>
</body>
</html>"""
    return html


if __name__ == "__main__":
    output_dir = Path(__file__).parent.parent / "reportes_checkpoint"
    output_dir.mkdir(parents=True, exist_ok=True)

    desktop_html = build_html_desktop()
    desktop_path = output_dir / "Dashboard_desktop.html"
    desktop_path.write_text(desktop_html, encoding="utf-8")
    print(f"Desktop: {desktop_path}")

    mobile_html = build_html_mobile()
    mobile_path = output_dir / "Dashboard_mobile.html"
    mobile_path.write_text(mobile_html, encoding="utf-8")
    print(f"Mobile: {mobile_path}")

    print(f"\nGeneradas en: {output_dir}")
