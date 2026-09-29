export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === "/health") {
      return new Response(JSON.stringify({
        ok: true,
        service: "MYREA TECH",
        version: "MVP"
      }), {
        headers: { "content-type": "application/json; charset=utf-8" }
      })
    }

    return new Response(
      `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MYRÉA TECH</title>
<style>
body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f6f7fb;color:#111827}
main{max-width:900px;margin:0 auto;padding:64px 24px}
.card{background:white;border:1px solid #e5e7eb;border-radius:20px;padding:32px;box-shadow:0 10px 30px rgba(0,0,0,.06)}
h1{font-size:42px;margin:0 0 12px}
p{font-size:18px;line-height:1.6;color:#4b5563}
.badge{display:inline-block;padding:7px 12px;border-radius:999px;background:#eef2ff;color:#3730a3;font-weight:600}
</style>
</head>
<body><main><div class="card">
<span class="badge">MVP déployé</span>
<h1>MYRÉA TECH</h1>
<p>Transformez les idées, les efforts et les compétences en valeur durable.</p>
<p>La plateforme est opérationnelle sur Cloudflare Workers.</p>
</div></main></body></html>`,
      { headers: { "content-type": "text/html; charset=utf-8" } }
    )
  }
}
