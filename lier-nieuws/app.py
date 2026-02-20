import os
import json
import csv
import io
import logging
from flask import Flask, render_template, request, jsonify, Response, stream_with_context
from dotenv import load_dotenv

# Fix SSL certificate path for Windows Python installations
try:
    import certifi
    os.environ.setdefault("SSL_CERT_FILE", certifi.where())
    os.environ.setdefault("REQUESTS_CA_BUNDLE", certifi.where())
except ImportError:
    pass

from database import init_db, get_all_sources, add_source, update_source, delete_source as db_delete_source
from database import get_articles, add_article, delete_article as db_delete_article, get_existing_urls
from scraper import scrape_all_sources
from ai_filter import filter_and_summarize

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Initialize database on import
init_db()


def _seed_sources():
    """Import the default Lier sources if the database is empty."""
    sources = get_all_sources()
    if sources:
        return

    logger.info("Seeding default sources...")
    default_sources = [
        # --- Stad & Bestuur ---
        ("Stad & Bestuur", "Stad Lier Algemeen Nieuws", "https://www.lier.be/"),
        ("Stad & Bestuur", "Agenda Gemeente- en OCMW-raad", "https://lier.be/agenda-gemeente-en-ocmw-raad"),
        ("Stad & Bestuur", "Zittingen & Verslagen", "https://www.lier.be/zittingen"),
        # --- Veiligheid ---
        ("Veiligheid", "Lokale Politie Lier Nieuws", "https://www.politie.be/5360/nieuws"),
        ("Veiligheid", "Brandweerzone Rivierenland", "https://rivierenland.hulpverleningszone.be/"),
        # --- Economie ---
        ("Economie", "Made in Mechelen (regio Lier)", "https://www.made-in.be/mechelen/"),
        # --- Zorg ---
        ("Zorg & Welzijn", "Heilig Hartziekenhuis Nieuws", "https://www.heilighartlier.be/nieuws/"),
        # --- Sport (hoofdclubs) ---
        ("Sport", "Lierse SK (Kempenzonen)", "https://www.lierse.com/"),
        ("Sport", "K. Lyra-Lierse", "https://lyralierse.be/"),
        ("Sport", "Royal Herakles HC (Hockey)", "https://herakles.be/"),
        # --- Cultuur ---
        ("Cultuur & Vrije Tijd", "CC De Mol Programmatie", "https://www.lierscultuurcentrum.be/nl/programma"),
        ("Cultuur & Vrije Tijd", "UiT in Lier (Kalender)", "https://ikorganiseerinlier.uitinlier.be/kalender"),
        ("Cultuur & Theater", "Teater Lier (Den Bril)", "https://denbril.be/"),
        # --- Erfgoed ---
        ("Erfgoed & Traditie", "Zimmertoren & Zimmermuseum", "https://zimmertoren.be/"),
        # --- Lokale Politiek ---
        ("Lokale Politiek", "N-VA Lier (Nieuws)", "https://lier.n-va.be/nieuws"),
        ("Lokale Politiek", "Missie2500 (CD&V Lier)", "https://afdeling.cdenv.be/lier"),
        ("Lokale Politiek", "Vooruit Lier", "https://nieuws.vooruit.org/lier"),
        # --- Media & Concurrentie ---
        ("Media & Concurrentie", "RTV Lier", "https://www.rtv.be/regio/lier"),
        ("Media & Concurrentie", "Lier Belicht", "https://www.lierbelicht.be/"),
        ("Media & Concurrentie", "Nnieuws Brandweer Rivierenland", "https://nnieuws.be/tags/brandweer-rivierenland"),
        ("Media & Concurrentie", "Radio Pallieter", "https://radiopallieter.be/"),
        ("Media & Concurrentie", "Het Nieuwsblad Lier", "https://www.nieuwsblad.be/regio/lier"),
        ("Media & Concurrentie", "Gazet van Antwerpen Lier", "https://www.gva.be/regio/lier"),
        # --- Jeugdverenigingen ---
        ("Jeugdverenigingen", "Chiro Lips Lier", "https://www.chirolips.be/"),
        ("Jeugdverenigingen", "Chiro Lier", "https://www.chirolier.be/"),
        ("Jeugdverenigingen", "Chiro Jut Lier", "https://www.chirojut.be/"),
        ("Jeugdverenigingen", "Scouting Lier", "https://scoutinglier.be/"),
        ("Jeugdverenigingen", "Scouts Lier", "https://scoutslier.be/"),
        ("Jeugdverenigingen", "KSA Lier", "https://ksalier.weebly.com/"),
        ("Jeugdverenigingen", "KLJ Lier-Noord", "https://www.kljliernoord.be/"),
        ("Jeugdverenigingen", "KLJ Lier-Zuid", "https://www.kljlierzuid.be/"),
        # --- Kleine clubs ---
        ("Kleine Clubs", "Mister 100 Biljartzaal Lier", "https://mister100-salledeau.be/biljardzaal-mister-100-lier/"),
        ("Kleine Clubs", "Chesslooks Schaakclub Lier", "https://www.chesslooks-lier.be/"),
        ("Kleine Clubs", "Pallieter Jogging Lier", "https://www.pallieterjogging.be/"),
        # --- Serviceclubs, kerk & senioren ---
        ("Serviceclubs & Verenigingen", "Lions Club Lier", "https://lionslier.be/onze-evenementen/"),
        ("Serviceclubs & Verenigingen", "Kiwanis Lier Twee Neten", "https://kiwanisliertweeneten.be/acties-en-nieuws/"),
        ("Serviceclubs & Verenigingen", "Rotary Lier", "https://www.rotarylier.be/"),
        ("Serviceclubs & Verenigingen", "Okra Lier-Lisp (Senioren)", "https://okra.be/antwerpen/lier-lisp/"),
        ("Serviceclubs & Verenigingen", "Neos Lier (Senioren)", "https://neosvzw.be/lier/agenda-activiteiten/"),
        ("Serviceclubs & Verenigingen", "Parochie H. Gummarus Lier", "https://www.kerknet.be/pastorale-eenheid-h-gummarus-z-beatrijs-lier/artikel/parochieblad"),
        ("Serviceclubs & Verenigingen", "Liers Genootschap", "https://www.liersgenootschap.be/"),
        ("Serviceclubs & Verenigingen", "Heren van Lier", "https://www.herenvanlier.be/"),
    ]

    for cat, desc, url in default_sources:
        add_source(cat, desc, url)

    logger.info(f"Seeded {len(default_sources)} default sources.")


# URLs to deactivate in existing databases — static pages, funeral homes, job boards, etc.
_URLS_TO_DEACTIVATE = [
    # Statische stadspagina's (geen nieuwswaarde)
    "https://www.lier.be/stadsbestuur/beleid-en-wetgeving/register-van-bekendmakingen",
    "https://www.lier.be/stadsbestuur/beleid-en-wetgeving/reglementen-stad-lier",
    "https://lier.be/perscontacten",
    "https://lier.be/ondernemen/info-voor-ondernemers",
    "https://www.lier.be/ondernemen/lierse-verenigingen-voor-ondernemers",
    "https://www.lier.be/ondernemen/hoe-start-ik-als-zelfstandige/lierse-verenigingen-voor-ondernemers/lier-shopping",
    "https://www.lier.be/vrije-tijd/verenigingen-in-lier",
    "https://www.lier.be/stadsbestuur/vacatures/word-vrijwilliger",
    "https://www.visitlier.be/nl/eten-en-drinken/streekproducten/liers-vlaaike",
    # Uitvaart / overlijdens
    "https://www.inmemoriam.be/nl/",
    "https://www.begrafenissenvandenbogaert.be/overlijdens.html",
    "https://www.funerarium-bosmans.be/online-condoleren/",
    "https://www.inmemoriam.be/nl/begrafenisondernemer/van-der-heyden-hellemans-lier-6473",
    # Jobsites
    "https://www.student.be/en/lier/student-jobs/",
    "https://www.jobat.be/nl/jobs/lier",
    # Broken SSL / nauwelijks content
    "https://www.leoxiii-lier.be/",
    "https://brandweervrienden.com/",
    # Statische clubpagina's (zelden nieuws)
    "https://rivierenland.brandweerzone.be/pagina/post-lier",
    "https://www.made-in.be/falingen/",
    "https://lierseclubvanbedrijven.nl/",
    "https://thofke.mivas.be/sociale-kruidenier",
    "https://lierseacademy.be/",
    "https://avll.be/",
    "https://guco.sportadministratie.be/",
    "https://www.zevenbergensport.be/",
    # Kleine toneelgezelschappen
    "https://www.arlecchinolier.be/",
    "http://www.deseine.be",
    # Overige statisch
    "https://www.hoplr.com/stad/lier",
    "https://www.natuurpunt.be/afdelingen/natuurpunt-de-wielewaal",
    "https://www.kiesjetoekomst.be/",
    "https://www.vlaamsbelang.org/activiteiten/vlaams-belang-lier-koningshooikt",
    "https://sporten.uitinlier.be/",
]


def _cleanup_sources():
    """Deactivate known-useless sources in existing databases."""
    from database import get_db
    conn = get_db()
    deactivated = 0
    for url in _URLS_TO_DEACTIVATE:
        cursor = conn.execute(
            "UPDATE sources SET active = 0 WHERE url = ? AND active = 1", (url,)
        )
        deactivated += cursor.rowcount
    conn.commit()
    conn.close()
    if deactivated:
        logger.info(f"Cleanup: {deactivated} nutteloze bronnen gedeactiveerd.")


# URLs to reactivate — previously deactivated sources that should be active again
_URLS_TO_REACTIVATE = [
    # Jeugdverenigingen
    "https://www.chirolips.be/",
    "https://www.chirolier.be/",
    "https://www.chirojut.be/",
    "https://scoutinglier.be/",
    "https://scoutslier.be/",
    "https://ksalier.weebly.com/",
    "https://www.kljliernoord.be/",
    "https://www.kljlierzuid.be/",
    # Kleine clubs
    "https://mister100-salledeau.be/biljardzaal-mister-100-lier/",
    "https://www.chesslooks-lier.be/",
    "https://www.pallieterjogging.be/",
    # Serviceclubs, kerk, senioren
    "https://lionslier.be/onze-evenementen/",
    "https://kiwanisliertweeneten.be/acties-en-nieuws/",
    "https://www.rotarylier.be/",
    "https://okra.be/antwerpen/lier-lisp/",
    "https://neosvzw.be/lier/agenda-activiteiten/",
    "https://www.kerknet.be/pastorale-eenheid-h-gummarus-z-beatrijs-lier/artikel/parochieblad",
    "https://www.liersgenootschap.be/",
    "https://www.herenvanlier.be/",
]


def _reactivate_sources():
    """Reactivate sources that were previously deactivated but should be active again."""
    from database import get_db
    conn = get_db()
    reactivated = 0
    for url in _URLS_TO_REACTIVATE:
        cursor = conn.execute(
            "UPDATE sources SET active = 1 WHERE url = ? AND active = 0", (url,)
        )
        reactivated += cursor.rowcount
    conn.commit()
    conn.close()
    if reactivated:
        logger.info(f"Reactivatie: {reactivated} bronnen opnieuw geactiveerd.")


# Seed default sources if empty, then clean up useless ones, then reactivate wanted ones
_seed_sources()
_cleanup_sources()
_reactivate_sources()


# ---- Routes ----

@app.route("/")
def index():
    return render_template("index.html")


# ---- API: Articles ----

@app.route("/api/articles")
def api_get_articles():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    articles, total = get_articles(page, per_page)
    total_pages = max(1, (total + per_page - 1) // per_page)
    return jsonify({
        "articles": articles,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
    })


@app.route("/api/articles/<int:article_id>", methods=["DELETE"])
def api_delete_article(article_id):
    db_delete_article(article_id)
    return jsonify({"ok": True})


# ---- API: Sources ----

@app.route("/api/sources")
def api_get_sources():
    sources = get_all_sources()
    return jsonify(sources)


@app.route("/api/sources", methods=["POST"])
def api_add_source():
    data = request.get_json()
    if not data or not all(k in data for k in ("category", "description", "url")):
        return jsonify({"error": "Vul categorie, beschrijving en URL in"}), 400

    ok = add_source(data["category"], data["description"], data["url"])
    if not ok:
        return jsonify({"error": "Deze URL bestaat al in de bronnen"}), 409
    return jsonify({"ok": True}), 201


@app.route("/api/sources/<int:source_id>/toggle", methods=["PUT"])
def api_toggle_source(source_id):
    data = request.get_json()
    active = 1 if data.get("active") else 0
    # We need to get the source first to preserve other fields
    sources = get_all_sources()
    source = next((s for s in sources if s["id"] == source_id), None)
    if not source:
        return jsonify({"error": "Bron niet gevonden"}), 404
    update_source(source_id, source["category"], source["description"], source["url"], active)
    return jsonify({"ok": True})


@app.route("/api/sources/<int:source_id>", methods=["DELETE"])
def api_delete_source(source_id):
    db_delete_source(source_id)
    return jsonify({"ok": True})


# ---- API: Diagnose ----

@app.route("/api/diagnose")
def api_diagnose():
    """Run diagnostics to check if everything is configured correctly."""
    results = []

    # 1. Check .env / API key
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        results.append({"step": "API Key", "status": "fail", "message": "ANTHROPIC_API_KEY is niet ingesteld. Maak een .env bestand aan in de lier-nieuws map met: ANTHROPIC_API_KEY=sk-ant-..."})
    elif api_key == "your-api-key-here":
        results.append({"step": "API Key", "status": "fail", "message": "Je gebruikt nog de placeholder key. Vervang 'your-api-key-here' in je .env door je echte Anthropic API key."})
    elif not api_key.startswith("sk-ant-"):
        results.append({"step": "API Key", "status": "warn", "message": f"API key begint met '{api_key[:8]}...' — normaal begint een Anthropic key met 'sk-ant-'. Controleer of dit klopt."})
    else:
        results.append({"step": "API Key", "status": "ok", "message": f"API key gevonden (begint met {api_key[:12]}...)"})

    # 2. Check active sources
    sources = get_all_sources(active_only=True)
    if not sources:
        results.append({"step": "Bronnen", "status": "fail", "message": "Geen actieve bronnen gevonden. Ga naar 'Bronnen beheren' en voeg bronnen toe."})
    else:
        results.append({"step": "Bronnen", "status": "ok", "message": f"{len(sources)} actieve bronnen gevonden."})

    # 3. Test scraping with first source
    if sources:
        from scraper import scrape_source, extract_page_content
        test_source = sources[0]
        result = scrape_source(test_source)
        content = extract_page_content(result)
        if result["status"] != "ok":
            results.append({"step": "Scraping", "status": "fail", "message": f"Scraping van '{test_source['description']}' mislukt: {result['status']}"})
        elif not content or not content["articles"]:
            results.append({"step": "Scraping", "status": "warn", "message": f"Scraping van '{test_source['description']}' lukte maar leverde geen content op."})
        else:
            results.append({"step": "Scraping", "status": "ok", "message": f"Scraping OK: '{test_source['description']}' leverde {len(content['articles'])} items op."})

    # 4. Test API connection
    if api_key and api_key != "your-api-key-here":
        try:
            from ai_filter import get_client
            client = get_client()
            response = client.messages.create(
                model="claude-sonnet-4-5-20250929",
                max_tokens=50,
                messages=[{"role": "user", "content": "Zeg enkel 'OK' als je dit leest."}],
            )
            results.append({"step": "Anthropic API", "status": "ok", "message": f"API verbinding werkt! Antwoord: {response.content[0].text}"})
        except Exception as e:
            error_msg = str(e)
            if "401" in error_msg or "authentication" in error_msg.lower():
                results.append({"step": "Anthropic API", "status": "fail", "message": "API key is ongeldig (401 Unauthorized). Controleer je key op console.anthropic.com."})
            elif "insufficient" in error_msg.lower() or "credit" in error_msg.lower() or "billing" in error_msg.lower():
                results.append({"step": "Anthropic API", "status": "fail", "message": "Geen credits/billing. Voeg credits toe op console.anthropic.com/settings/billing."})
            else:
                results.append({"step": "Anthropic API", "status": "fail", "message": f"API fout: {error_msg}"})

    return jsonify(results)


# ---- API: Settings (API Key) ----

def _env_file_path():
    """Return the path to the .env file in the lier-nieuws directory."""
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")


@app.route("/api/settings/apikey")
def api_get_apikey():
    """Check if an API key is configured (returns masked version)."""
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if api_key and api_key != "your-api-key-here":
        masked = api_key[:12] + "..." + api_key[-4:] if len(api_key) > 16 else api_key[:8] + "..."
        return jsonify({"has_key": True, "masked": masked})
    return jsonify({"has_key": False, "masked": ""})


@app.route("/api/settings/apikey", methods=["POST"])
def api_save_apikey():
    """Save the API key to .env and activate it immediately."""
    data = request.get_json()
    api_key = (data.get("api_key") or "").strip()

    if not api_key:
        return jsonify({"error": "Vul een API key in."}), 400

    if not api_key.startswith("sk-"):
        return jsonify({"error": "Dit lijkt geen geldige Anthropic API key. Die begint met 'sk-'."}), 400

    # Write to .env file
    env_path = _env_file_path()
    try:
        # Read existing .env content (if any) and replace/add the key
        env_lines = []
        key_found = False
        if os.path.exists(env_path):
            with open(env_path, "r") as f:
                for line in f:
                    if line.strip().startswith("ANTHROPIC_API_KEY="):
                        env_lines.append(f"ANTHROPIC_API_KEY={api_key}\n")
                        key_found = True
                    else:
                        env_lines.append(line)
        if not key_found:
            env_lines.append(f"ANTHROPIC_API_KEY={api_key}\n")

        with open(env_path, "w") as f:
            f.writelines(env_lines)

        # Activate immediately in the running process
        os.environ["ANTHROPIC_API_KEY"] = api_key

        logger.info("API key opgeslagen en geactiveerd.")
        return jsonify({"ok": True, "message": "API key opgeslagen en meteen actief!"})

    except Exception as e:
        logger.error(f"Fout bij opslaan API key: {e}")
        return jsonify({"error": f"Kon .env niet opslaan: {e}"}), 500


# ---- API: Search ----

@app.route("/api/search", methods=["POST"])
def api_search():
    """Start a news search. Uses Server-Sent Events to stream progress."""
    def generate():
        try:
            # 1. Get active sources
            sources = get_all_sources(active_only=True)
            if not sources:
                yield _sse({"type": "error", "message": "Geen actieve bronnen gevonden. Voeg bronnen toe via 'Bronnen beheren'."})
                return

            # 2. Scrape all sources
            def progress_cb(current, total, source_name):
                # We can't yield from inside a callback, so we store progress
                pass

            scraped_content = []
            total = len(sources)
            scrape_ok = 0
            scrape_fail = 0

            for i, source in enumerate(sources):
                yield _sse({"type": "progress", "current": i + 1, "total": total, "source": source["description"]})
                from scraper import scrape_source, extract_page_content
                import time

                result = scrape_source(source)
                content = extract_page_content(result)
                if content and content["articles"]:
                    scraped_content.append(content)
                    scrape_ok += 1
                    logger.info(f"  OK: {source['description']} -> {len(content['articles'])} items")
                else:
                    scrape_fail += 1
                    logger.warning(f"  LEEG: {source['description']} (status: {result['status']})")
                time.sleep(0.3)

            logger.info(f"Scraping klaar: {scrape_ok} bronnen met content, {scrape_fail} lege bronnen")

            if not scraped_content:
                logger.warning("Geen enkele bron leverde content op. Controleer je internetverbinding.")
                yield _sse({"type": "done", "new_articles": 0})
                return

            # 3. Get existing URLs for deduplication
            existing_urls = get_existing_urls()

            # 4. AI analysis
            yield _sse({"type": "analyzing"})
            logger.info(f"AI-analyse gestart met {len(scraped_content)} bronnen en {len(existing_urls)} bestaande URLs...")
            articles = filter_and_summarize(scraped_content, existing_urls)
            logger.info(f"AI-analyse klaar: {len(articles)} leads gevonden")

            if not articles:
                yield _sse({"type": "done", "new_articles": 0})
                return

            # 5. Save to database
            yield _sse({"type": "saving", "count": len(articles)})
            new_count = 0
            for art in articles:
                bullets = json.dumps(art.get("bullets", []), ensure_ascii=False)
                ok = add_article(
                    title=art.get("title", "Geen titel"),
                    summary=art.get("summary", ""),
                    bullets=bullets,
                    source_url=art.get("source_url", ""),
                    original_url=art.get("original_url", ""),
                    original_date=art.get("original_date", "onbekend"),
                )
                if ok:
                    new_count += 1

            yield _sse({"type": "done", "new_articles": new_count})

        except Exception as e:
            logger.error(f"Search error: {e}", exc_info=True)
            error_msg = str(e)
            if "401" in error_msg or "authentication" in error_msg.lower():
                error_msg = "API key is ongeldig. Klik op 'Diagnose' om te testen."
            elif "insufficient" in error_msg.lower() or "credit" in error_msg.lower():
                error_msg = "Geen API credits. Voeg credits toe op console.anthropic.com."
            elif "ANTHROPIC_API_KEY" in error_msg:
                error_msg = "API key niet gevonden. Maak een .env bestand aan met je ANTHROPIC_API_KEY."
            yield _sse({"type": "error", "message": error_msg})

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


def _sse(data):
    """Format data as a Server-Sent Event."""
    return f"data: {json.dumps(data, ensure_ascii=False)}\n\n"


# ---- Main ----

if __name__ == "__main__":
    app.run(debug=True, port=5000)
