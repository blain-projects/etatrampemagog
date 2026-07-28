import os
import sys

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.ramp_status import (
    RampStatusResponse,
    RampStatusValue,
    clear_ramp_status_cache,
    enrich_river_flow_from_loisirs,
    parse_ramp_status_from_html,
)

CLOSED_HTML = """
<html><body>
  <div class="alert">
    <h2>Rampe de mise à l'eau</h2>
    <p>La rampe de mise à l'eau du parc de la Pointe-Merry est actuellement
    fermée. Réouverture prévue le 24 mai 2026.</p>
  </div>
</body></html>
"""

OPEN_HTML = """
<html><body>
  <div class="content">
    <p>La rampe de mise à l'eau est ouverte pour la saison.</p>
  </div>
</body></html>
"""

NO_RAMPE_HTML = """
<html><body>
  <p>Aucun avis en cours pour les installations aquatiques.</p>
</body></html>
"""


@pytest.fixture(autouse=True)
def reset_cache() -> None:
    clear_ramp_status_cache()


def test_parse_closed_with_reopening_date() -> None:
    result = parse_ramp_status_from_html(CLOSED_HTML)

    assert result.status == RampStatusValue.CLOSED
    assert result.label == "Fermée"
    assert result.reopening_date == "2026-05-24"
    assert result.reopening_date_display == "24 mai 2026"
    assert result.excerpt is not None
    assert "fermée" in result.excerpt.lower()


def test_parse_open() -> None:
    result = parse_ramp_status_from_html(OPEN_HTML)

    assert result.status == RampStatusValue.OPEN
    assert result.label == "Ouverte"
    assert result.reopening_date is None


def test_parse_no_ramp_mention_defaults_open() -> None:
    result = parse_ramp_status_from_html(NO_RAMPE_HTML)

    assert result.status == RampStatusValue.OPEN
    assert result.label == "Ouverte"
    assert result.excerpt is None


LOISIRS_TABLE_HTML = """
<html><body>
  <table>
    <tr>
      <th>Débit d'évacuation</th>
      <th>Débit de la rivière (&le; 70 m 3 /s)</th>
      <th>Débit de la rivière (&gt; 70 m 3 /s)</th>
    </tr>
    <tr>
      <td>70 m 3 /s</td>
      <td>Navigation autorisée</td>
      <td>Navigation interdite</td>
    </tr>
  </table>
  <h2 id="ouverture-fermeture-rampe">Ouverture et fermeture de la rampe</h2>
</body></html>
"""


def test_enrich_river_flow_from_loisirs_table_when_missing() -> None:
    payload = RampStatusResponse(
        status=RampStatusValue.OPEN,
        label="Ouverte",
        source_url="https://example.test/avis",
        fetched_at=parse_ramp_status_from_html(OPEN_HTML).fetched_at,
    )

    enriched = enrich_river_flow_from_loisirs(payload, LOISIRS_TABLE_HTML)

    assert enriched.river_flow == "70 m3/s"


def test_loisirs_reading_overrides_an_existing_river_flow() -> None:
    """The loisirs page wins, because it is the page that can close the ramp.

    This reverses the original behaviour, which returned early whenever
    river_flow was already set. That early return meant a high reading on the
    loisirs page could never flip the status, so the site could show the ramp
    OPEN while navigation was actually forbidden — the parser defaults to OPEN
    when the avis page has no ramp-specific excerpt.

    Reading loisirs is what makes the >70 m3/s closure detectable, so its value
    is the one displayed. Deliberate: showing a stale flow next to a CLOSED
    status would be worse than showing the reading that caused the closure.
    """
    payload = RampStatusResponse(
        status=RampStatusValue.OPEN,
        label="Ouverte",
        river_flow="42 m3/s",
        source_url="https://example.test/avis",
        fetched_at=parse_ramp_status_from_html(OPEN_HTML).fetched_at,
    )

    enriched = enrich_river_flow_from_loisirs(payload, LOISIRS_TABLE_HTML)

    assert enriched.river_flow == "70 m3/s"


HIGH_FLOW_LOISIRS_HTML = """
<html><body>
  <table>
    <tr>
      <th>Débit de la rivière (&le; 70 m 3 /s)</th>
      <th>Débit de la rivière (&gt; 70 m 3 /s)</th>
    </tr>
    <tr>
      <td>90 m 3 /s</td>
      <td>Navigation interdite</td>
    </tr>
  </table>
</body></html>
"""


def test_high_flow_closes_the_ramp() -> None:
    """The safety case this whole change exists for.

    Above 70 m3/s navigation is forbidden. The avis page often has no
    ramp-specific excerpt, in which case the parser defaults to OPEN — so
    without this the site would tell people the ramp is open during exactly
    the conditions that forbid navigating.
    """
    payload = RampStatusResponse(
        status=RampStatusValue.OPEN,
        label="Ouverte",
        river_flow=None,
        source_url="https://example.test/avis",
        fetched_at=parse_ramp_status_from_html(OPEN_HTML).fetched_at,
    )

    enriched = enrich_river_flow_from_loisirs(payload, HIGH_FLOW_LOISIRS_HTML)

    assert enriched.river_flow == "90 m3/s"
    assert enriched.status is RampStatusValue.CLOSED
    assert enriched.label == "Fermée"
    assert "trop élevé" in enriched.ramp_info


def test_threshold_values_in_headers_are_not_read_as_measurements() -> None:
    """The header says '> 70 m 3 /s'; the measurement is the standalone value.

    The old parser matched the threshold in the column header instead of the
    reading, so a 90 m3/s river reported as 70 — under the limit, ramp open.
    """
    payload = RampStatusResponse(
        status=RampStatusValue.OPEN,
        label="Ouverte",
        river_flow=None,
        source_url="https://example.test/avis",
        fetched_at=parse_ramp_status_from_html(OPEN_HTML).fetched_at,
    )

    assert enrich_river_flow_from_loisirs(payload, HIGH_FLOW_LOISIRS_HTML).river_flow == "90 m3/s"
