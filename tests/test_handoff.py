import hashlib
import re
import unittest
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
HANDOFF_ROOT = ROOT / "handoff"


class HandoffTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.handoff = yaml.safe_load((HANDOFF_ROOT / "launchpad-handoff.yaml").read_text())

    def test_all_authority_remains_false(self):
        authority = self.handoff["factory_receipt"]["authority"]
        self.assertTrue(authority)
        self.assertTrue(all(value is False for value in authority.values()))
        proposal = yaml.safe_load((HANDOFF_ROOT / "catalog-certification.proposed.yaml").read_text())
        self.assertFalse(proposal["spec"]["certified"])
        self.assertFalse(proposal["spec"]["promotion_eligible"])
        self.assertEqual(proposal["spec"]["max_workshop_seats"], 0)

    def test_referenced_factory_evidence_is_digest_bound(self):
        factory = self.handoff["factory_receipt"]
        refs = [factory["artifacts"][name]["release_receipt"] for name in ("workload", "presentation")]
        refs.extend(factory["factory_evidence"].values())
        for ref in refs:
            path = HANDOFF_ROOT / ref["path"]
            actual = hashlib.sha256(path.read_bytes()).hexdigest()
            self.assertEqual(actual, ref["sha256"], path.name)

    def test_factory_images_are_immutable_and_overlay_uses_current_qualified_digests(self):
        factory = self.handoff["factory_receipt"]
        images = [factory["artifacts"][name]["image"] for name in ("workload", "presentation")]
        for image in images:
            self.assertRegex(image, r"@sha256:[0-9a-f]{64}$")
        overlay = (ROOT / "charts/sovereign-ai-201/values.published.yaml").read_text()
        self.assertIn("ghcr.io/jkershawrh/sovereign-ai-201-adapter", overlay)
        self.assertIn("sha256:868e1ced53d28cf07b02007849356b4f1ff78ff17d1d1dd0c2b04fedd6a20f6f", overlay)
        self.assertIn("ghcr.io/jkershawrh/sovereign-ai-201-presentation", overlay)
        self.assertIn("sha256:2baef1ba00a221d223f205d8179a8a6cb1ca3113539b6c2e53364c484fe7545a", overlay)

    def test_handoff_has_no_secret_values(self):
        text = "\n".join(path.read_text() for path in HANDOFF_ROOT.rglob("*.*") if path.is_file())
        self.assertIsNone(re.search(r"(?i)(password|bearer_token|private_key|kubeconfig|api[_-]?key[_-]?value)\s*:", text))


if __name__ == "__main__":
    unittest.main()
