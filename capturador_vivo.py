#!/usr/bin/env python3
"""
AegisNet Capturador en Vivo (sin X).
Pesca canales Telegram publicos (t.me/s/) y RSS de verificadores/medios,
filtra por palabras clave y guarda cada captura con timestamp en JSON acumulativo.
Fuentes que responden hoy: Telegram (t.me/s/) y RSS.
"""
import json, os, re, sys, time, urllib.request, urllib.parse
from html.parser import HTMLParser

DATOS = "/home/deploy/aegisnet-botradar/VIVO"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AegisNetCapturador/1.0"

KEYWORDS = ["ceuta", "castillej", "ong", "cruce", "frontera", "migraci", "migrante",
            "tánger", "tanger", "marroqu", "nador", "asilo", "viola", "patera"]

TELEGRAM_CHANNELS = ["elfarodeceuta", "maldita_es"]

RSS_FEEDS = {
    "maldita": "https://maldita.es/feed/",
    "efe": "https://efe.com/feed/",
    "newtral": "https://www.newtral.es/feed/",
}

def http_get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.read().decode("utf-8", "ignore")

class TgParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.in_text = False; self.buf = []; self.items = []
        self.current = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class", "")
        if "tgme_widget_message_wrap" in cls:
            self.current = {}
        elif self.current is not None and "tgme_widget_message_text" in cls:
            self.in_text = True; self.buf = []
    def handle_data(self, data):
        if self.in_text: self.buf.append(data)
    def handle_endtag(self, tag):
        if tag == "a" and self.in_text:
            self.in_text = False
            self.current["text"] = " ".join("".join(self.buf).split())[:500]
            self.buf = []
            self.items.append(self.current); self.current = None

def grab_telegram(channel):
    out = []
    try:
        html = http_get(f"https://t.me/s/{channel}")
        p = TgParser(); p.feed(html)
        ts = re.findall(r'datetime="([^"]+)"', html)
        for i, item in enumerate(p.items):
            t = ts[i] if i < len(ts) else ""
            out.append({"fuente": f"telegram:{channel}", "ts": t, "texto": item.get("text","")})
    except Exception as e:
        out.append({"fuente": f"telegram:{channel}", "error": str(e)})
    return out

def grab_rss(name, url):
    out = []
    try:
        xml = http_get(url)
        entries = re.findall(r"<item>(.*?)</item>", xml, re.S)
        for it in entries[:50]:
            title = re.search(r"<title>(.*?)</title>", it, re.S)
            pub = re.search(r"<pubDate>(.*?)</pubDate>", it, re.S)
            link = re.search(r"<link>(.*?)</link>", it, re.S)
            out.append({
                "fuente": f"rss:{name}",
                "ts": pub.group(1).strip() if pub else "",
                "texto": (title.group(1).strip()[:500] if title else ""),
                "url": link.group(1).strip() if link else "",
            })
    except Exception as e:
        out.append({"fuente": f"rss:{name}", "error": str(e)})
    return out

def main():
    os.makedirs(DATOS, exist_ok=True)
    hoy = time.strftime("%Y-%m-%d")
    archivo = os.path.join(DATOS, f"vivo_{hoy}.json")
    registros = []
    if os.path.exists(archivo):
        try: registros = json.load(open(archivo))
        except: registros = []

    nuevos = []
    for ch in TELEGRAM_CHANNELS:
        nuevos += grab_telegram(ch)
    for name, url in RSS_FEEDS.items():
        nuevos += grab_rss(name, url)

    # filtrar por keyword
    filtrados = []
    for n in nuevos:
        txt = (n.get("texto") or "").lower()
        if n.get("error"):
            filtrados.append(n); continue
        if any(k in txt for k in KEYWORDS):
            filtrados.append(n)
        else:
            n["descartado"] = True
            filtrados.append(n)

    # dedupe por (fuente,texto)
    vistos = {(r.get("fuente"), r.get("texto")) for r in registros}
    for n in filtrados:
        clave = (n.get("fuente"), n.get("texto"))
        if clave not in vistos and n.get("texto"):
            registros.append(n); vistos.add(clave)

    json.dump(registros, open(archivo, "w"), ensure_ascii=False, indent=1)
    n_ceuta = sum(1 for r in registros if "ceuta" in (r.get("texto") or "").lower())
    n_total = len(registros)
    n_hoy = sum(1 for r in registros if hoy in (r.get("ts") or ""))
    print(f"OK: total={n_total} ceuta={n_ceuta} hoy={n_hoy} | nuevas={len(filtrados)} | {archivo}")

if __name__ == "__main__":
    main()
