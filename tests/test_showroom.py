import unittest
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
SHOWROOM = ROOT / "showroom"


class ShowroomTests(unittest.TestCase):
    def test_showroom_has_root_discoverable_playbook(self):
        playbook = yaml.safe_load((ROOT / "default-site.yml").read_text())
        self.assertEqual(playbook["site"]["start_page"], "sovereign-ai-201::index.adoc")
        self.assertEqual(
            playbook["content"]["sources"],
            [{"url": ".", "start_path": "showroom/content", "branches": "HEAD"}],
        )
        self.assertTrue((ROOT / "showroom/content/antora.yml").is_file())
        self.assertEqual(
            playbook["ui"]["bundle"]["url"],
            "https://github.com/rhpds/rhdp_showroom_theme/releases/download/v2.0.3/ui-bundle.zip",
        )

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

    def test_journey_is_story_led_and_follows_show_learn_do_prove(self):
        pages = SHOWROOM / "content/modules/ROOT/pages"
        index = (pages / "index.adoc").read_text()
        self.assertIn("claims analyst", index.lower())
        self.assertIn("customer outcome", index.lower())

        text = "\n".join(path.read_text() for path in pages.glob("*.adoc"))
        for phase in ("Show", "Learn", "Do", "Prove"):
            self.assertIn(f"== {phase}", text)

    def test_each_construction_stage_has_an_executable_participant_action(self):
        pages = SHOWROOM / "content/modules/ROOT/pages"
        stage_pages = [
            pages / f"{number:02d}-{slug}.adoc"
            for number, slug in (
                (1, "prerequisite"),
                (2, "map-boundaries"),
                (3, "author-contract"),
                (4, "wire-controls"),
                (5, "qualify-paths"),
                (6, "break-fail-closed"),
                (7, "evidence-authority"),
                (8, "reclaim"),
            )
        ]
        for page in stage_pages:
            self.assertIn('[source,bash,role="execute"]', page.read_text(), page.name)

        execute_count = sum(
            path.read_text().count('role="execute"') for path in pages.glob("*.adoc")
        )
        self.assertGreaterEqual(execute_count, 12)

    def test_operator_and_inference_claims_are_exercised_honestly(self):
        pages = SHOWROOM / "content/modules/ROOT/pages"
        controls = (pages / "04-wire-controls.adoc").read_text()
        self.assertIn("OpenShift Console", controls)
        self.assertIn("Workloads", controls)
        self.assertIn("NetworkPolicies", controls)

        qualify = (pages / "05-qualify-paths.adoc").read_text()
        self.assertIn("model_participated", qualify)
        self.assertIn("source_state", qualify)
        self.assertIn("LIVE", qualify)
        self.assertIn("REHEARSAL", qualify)
        self.assertIn("DEPENDENCY_UNAVAILABLE", qualify)

    def test_reclaim_defines_participant_and_platform_ownership(self):
        text = (SHOWROOM / "content/modules/ROOT/pages/08-reclaim.adoc").read_text()
        self.assertIn("participant-owned", text)
        self.assertIn("Launchpad-owned", text)
        self.assertIn("zero", text.lower())


if __name__ == "__main__":
    unittest.main()
