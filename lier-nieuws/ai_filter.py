import json
import os
import logging
import ssl
import httpx
from anthropic import Anthropic
from datetime import datetime

logger = logging.getLogger(__name__)


def _build_ssl_context():
    """Build an SSL context that works on Python 3.14 + Windows.

    Tries multiple strategies in order:
    1. certifi CA bundle loaded into an explicit SSLContext
    2. System default SSL context
    3. SSL verification disabled (last resort, logs a warning)
    """
    # Strategy 1: explicit SSLContext with certifi bundle
    try:
        import certifi
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        ctx.load_verify_locations(certifi.where())
        return ctx
    except Exception as e:
        logger.debug(f"SSL strategy 1 (certifi SSLContext) failed: {e}")

    # Strategy 2: system defaults
    try:
        ctx = ssl.create_default_context()
        return ctx
    except Exception as e:
        logger.debug(f"SSL strategy 2 (system defaults) failed: {e}")

    # Strategy 3: no verification (same fallback the scraper uses)
    logger.warning(
        "SSL-certificaatverificatie uitgeschakeld voor Anthropic API — "
        "kon geen werkende CA-bundel laden. Verbinding is nog steeds "
        "versleuteld (TLS), maar het certificaat wordt niet geverifieerd."
    )
    return False


_ssl_verify = _build_ssl_context()


def get_client(verify=None):
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY is niet ingesteld in .env")
    v = verify if verify is not None else _ssl_verify
    http_client = httpx.Client(verify=v, timeout=60.0)
    return Anthropic(api_key=api_key, http_client=http_client)


FILTER_PROMPT = """Je bent een ervaren regiojournalist die werkt voor HLN, de populairste nieuwssite van Vlaanderen.
Je focust op de gemeente {municipality_name} en omgeving (inclusief {sub_areas_text}).

Je krijgt een verzameling gescrapete webpagina's van lokale bronnen. Jouw taak:

1. SELECTEER alleen de items die nieuwswaardig zijn voor een regionaal publiek in {municipality_name}.
   Nieuwswaardig betekent:
   - Hard nieuws (ongelukken, criminaliteit, politieke beslissingen, ...)
   - Aankondigingen van evenementen, braderijen, festivals
   - Werken in de straat, mobiliteit, verkeer
   - Bijzondere verhalen van mensen uit {municipality_name}
   - Sport: wedstrijdresultaten, transfers, bijzondere prestaties
   - Openingen/sluitingen van winkels, horeca, bedrijven
   - Culturele evenementen, tentoonstellingen, voorstellingen
   - Sociale verhalen, vrijwilligerswerk, bijzondere initiatieven
   - Alles wat een regiojournalist zou opmerken

2. FILTER WEG:
   - Artikelen ouder dan 7 dagen (vandaag is {today})
   - Artikelen zonder duidelijke nieuwswaarde
   - Zuivere reclameboodschappen
   - Generieke info die niet verandert (openingsuren, vaste pagina's, ...)
   - Artikelen die al in onze database staan (zie lijst hieronder)

3. Voor elk geselecteerd artikel, geef:
   - title: een pakkende titel (in het Nederlands)
   - summary: een samenvatting in 1 zin
   - bullets: exact 3 bullet points die het verhaal duiden of pitchen voor de journalist
   - label: een van deze drie categorieën (kies de best passende):
       * "Nieuws" — hard nieuws uit {municipality_name}: ongelukken, criminaliteit, politiek, infrastructuur, verkeer, wegenwerken, veiligheid
       * "Mensen" — menselijke verhalen: portretten, handel/horeca, onderwijs, jeugd, sport, wijknieuws, vrijwilligers, verenigingen
       * "Agenda" — aankondigingen: evenementen, feesten, concerten, tentoonstellingen, culturele programmatie, markten
   - original_url: de exacte URL van het bronartikel (NIET de homepage van de bron)
   - source_url: de URL van de bron/website
   - original_date: de datum van publicatie (formaat: YYYY-MM-DD HH:MM of YYYY-MM-DD als uur onbekend)

BELANGRIJK:
- Gebruik ENKEL informatie die je vindt in de gescrapete data. Verzin NIETS.
- De original_url moet een echte, specifieke link zijn naar het artikel, niet de homepage.
- Als je geen datum kan vinden, gebruik dan de tekst "onbekend".
- Wees selectief: liever 3 goede leads dan 10 matige.
- Het label moet EXACT een van deze drie zijn: "Nieuws", "Mensen" of "Agenda".

Reeds bestaande artikelen in onze database (deze NIET opnieuw opnemen):
{existing_urls}

Antwoord ENKEL in geldig JSON-formaat:
{{
  "articles": [
    {{
      "title": "...",
      "summary": "...",
      "bullets": ["...", "...", "..."],
      "label": "Nieuws|Mensen|Agenda",
      "original_url": "...",
      "source_url": "...",
      "original_date": "..."
    }}
  ]
}}

Als er geen nieuwswaardige artikelen zijn, antwoord dan:
{{"articles": []}}
"""


ARTICLE_PROMPT = """Je bent een ervaren regiojournalist bij HLN, de populairste nieuwssite van Vlaanderen.
Je schrijft een artikel in de typische HLN-stijl:
- Korte, pakkende kop die nieuwsgierig maakt
- Een vetgedrukte intro van 1-2 zinnen die de kern samenvat
- Vlotte, toegankelijke taal — geen wollig taalgebruik
- Korte alinea's (2-3 zinnen max)
- Actieve schrijfstijl, dicht bij de lezer
- Menselijk en concreet, niet abstract

Je krijgt hieronder de informatie uit een nieuwslead. Schrijf hier een publicatieklaar artikel van.

CRUCIALE REGELS:
- Schrijf UITSLUITEND op basis van de informatie die hieronder staat. Voeg NIETS toe.
- Verzin GEEN quotes, GEEN namen die niet in de bron staan, GEEN extra details of omstandigheden.
- Als er weinig info is, schrijf dan een kort artikel (3-5 alinea's). Dat is prima.
- Als er meer info is, mag het langer zijn (6-10 alinea's).
- Gebruik NOOIT de woorden "aldus", "desgevallend" of andere archaïsche termen.
- Begin NIET met "In Lier..." — varieer je opening.
- Het artikel moet 100% feitelijk correct zijn op basis van de broninfo.

Structuur van je output (gebruik exact deze markdown-opmaak):
# [Pakkende kop]

**[Vetgedrukte intro van 1-2 zinnen]**

[Artikel in korte alinea's]

---
*Bron: [naam/url van de bron]*
"""


def generate_hln_article(article_data):
    """Generate an HLN-style article from a news lead using Claude."""
    client = get_client()

    # Build the context from the article data
    context = f"""Titel van de lead: {article_data.get('title', '')}
Samenvatting: {article_data.get('summary', '')}
Bullet points:
{chr(10).join('- ' + b for b in article_data.get('bullets', []))}
Label/categorie: {article_data.get('label', 'onbekend')}
Datum: {article_data.get('original_date', 'onbekend')}
Bron-URL: {article_data.get('original_url', '')}
Bronsite: {article_data.get('source_url', '')}"""

    messages = [
        {
            "role": "user",
            "content": f"{ARTICLE_PROMPT}\n\n--- BRONINFO ---\n{context}",
        }
    ]

    try:
        response = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=2048,
            messages=messages,
        )
    except Exception as e:
        if "SSL" in str(e) or "Connection" in str(e) or "ConnectError" in str(e):
            logger.warning(f"Article generation API call failed ({e}), retrying without SSL...")
            client = get_client(verify=False)
            response = client.messages.create(
                model="claude-sonnet-4-5-20250929",
                max_tokens=2048,
                messages=messages,
            )
        else:
            raise

    return response.content[0].text


def filter_and_summarize(scraped_content, existing_urls, municipality="lier", municipality_name="Lier", sub_areas=None):
    """Use Claude to filter and summarize scraped content into news leads."""
    if sub_areas is None:
        sub_areas = ["Koningshooikt", "Lisp"]
    client = get_client()
    today = datetime.now().strftime("%Y-%m-%d")

    # Build the content to send to Claude
    content_parts = []
    for source_data in scraped_content:
        source = source_data["source"]
        articles = source_data["articles"]

        source_text = f"\n--- BRON: {source['description']} ({source['category']}) ---\nURL: {source['url']}\n"
        for art in articles:
            source_text += f"\nTitel: {art.get('title', '(geen titel)')}\n"
            source_text += f"URL: {art.get('url', '')}\n"
            source_text += f"Datum: {art.get('date', 'onbekend')}\n"
            source_text += f"Tekst: {art.get('text', '')[:1500]}\n"
            if art.get("links"):
                source_text += "Links:\n"
                for link in art["links"][:10]:
                    source_text += f"  - {link['text']}: {link['url']}\n"

        content_parts.append(source_text)

    full_content = "\n".join(content_parts)

    # Truncate if too long (Claude has token limits)
    if len(full_content) > 150000:
        full_content = full_content[:150000] + "\n\n[AFGEKAPT - te veel content]"

    existing_urls_text = "\n".join(f"- {url}" for url in existing_urls) if existing_urls else "(geen bestaande artikelen)"

    sub_areas_text = " en ".join(sub_areas) if sub_areas else ""
    prompt = FILTER_PROMPT.format(
        today=today,
        existing_urls=existing_urls_text,
        municipality_name=municipality_name,
        sub_areas_text=sub_areas_text,
    )

    messages = [
        {
            "role": "user",
            "content": f"{prompt}\n\nHier zijn de gescrapete bronnen:\n\n{full_content}",
        }
    ]

    try:
        response = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=4096,
            messages=messages,
        )
    except Exception as e:
        # If the first attempt fails with an SSL/connection error, retry
        # with SSL verification disabled (same fallback the scraper uses).
        if "SSL" in str(e) or "Connection" in str(e) or "ConnectError" in str(e):
            logger.warning(
                f"API-aanroep mislukt ({e}), opnieuw proberen zonder SSL-verificatie..."
            )
            client = get_client(verify=False)
            try:
                response = client.messages.create(
                    model="claude-sonnet-4-5-20250929",
                    max_tokens=4096,
                    messages=messages,
                )
            except Exception as retry_err:
                logger.error(f"Claude API error (retry): {retry_err}")
                raise
        else:
            logger.error(f"Claude API error: {e}")
            raise

    try:
        response_text = response.content[0].text

        # Extract JSON from response
        # Sometimes the model wraps it in ```json ... ```
        json_match = response_text
        if "```json" in response_text:
            json_match = response_text.split("```json")[1].split("```")[0]
        elif "```" in response_text:
            json_match = response_text.split("```")[1].split("```")[0]

        result = json.loads(json_match.strip())
        return result.get("articles", [])

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse Claude response as JSON: {e}")
        logger.error(f"Response was: {response_text[:500]}")
        return []
