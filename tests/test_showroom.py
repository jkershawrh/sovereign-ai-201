import unittest
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
SHOWROOM = ROOT / "showroom"


class ShowroomTests(unittest.TestCase):
    def test_showroom_has_independent_playbook(self):
        playbook = yaml.safe_load((SHOWROOM / "default-site.yml").read_text())
        self.assertEqual(playbook["site"]["start_page"], "sovereign-ai-201::index.adoc")
        self.assertEqual(playbook["content"]["sources"], [{"url": "./content", "branches": "HEAD"}])

    def test_lab_is_complete_and_construction_led(self):
        antora = yaml.safe_load((SHOWROOM / "content/antora.yml").read_text())
        self.assertEqual(antora["name"], "sovereign-ai-201")
        self.assertEqual(antora["version"], "main")
        nav = (SHOWROOM / "content/modules/ROOT/nav.adoc").read_text()
        for page in ("01-prerequisite", "02-map-boundaries", "03-author-contract", "04-wire-controls", "05-qualify-paths", "06-break-fail-closed", "07-evidence-authority", "08-reclaim"):
            self.assertIn(page, nav)

    def test_lab_requires_every_201_artifact_and_failure_condition(self):
        text = "\n".join(path.read_text() for path in (SHOWROOM / "content/modules/ROOT/pages").glob("*.adoc"))
        for term in ("residency", "trust", "Secret", "Service", "NetworkPolicy", "MALFORMED_REQUEST", "INJECTION_BLOCKED", "DEPENDENCY_UNAVAILABLE", "correlation", "human", "reclaim"):
            self.assertIn(term, text)
        for state in ("LIVE", "REHEARSAL", "OFFLINE"):
            self.assertIn(state, text)

    def test_101_evidence_is_prerequisite_not_learner_work(self):
        text = (SHOWROOM / "content/modules/ROOT/pages/01-prerequisite.adoc").read_text()
        self.assertIn("Do not copy", text)
        self.assertIn("not 201 construction work", text)

    def test_starters_are_intentionally_incomplete(self):
        for path in (ROOT / "lab/starter").iterdir():
            self.assertIn("TODO", path.read_text(), path.name)


if __name__ == "__main__":
    unittest.main()
