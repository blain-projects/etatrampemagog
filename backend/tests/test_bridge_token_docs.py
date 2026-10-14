"""The OpenClaw bridge token is a secret: this repo's docs read it from .env.

AI skills/* is copied from blain-agent-kit, which guards it; these are the
files this repo owns that show how to call the bridge.
"""

import hashlib
import pathlib
import re
import unittest

REPO_ROOT = pathlib.Path(__file__).resolve().parents[2]

BRIDGE_DOCS = [
    "OPENCLAW.md",
    "README.md",
    "how_to_use_repo.md",
    "docker-compose.yml",
    "backend/.env.example",
]

# sha256 of the bridge token these docs used to show in clear (rotated 2026-10-13).
OLD_TOKEN_SHA256 = "df9e6855b553bc86892806ab9763f1a44658dc15bdee5e81ec0851922a99775a"

QUOTED_HEADER_LITERAL = re.compile(r"""['"]X-Bridge-Token['"]\s*:\s*['"]""")
PLAIN_HEADER_LITERAL = re.compile(r"""X-Bridge-Token:[ \t]*(?![$<\s])\S""")
ENV_TOKEN_VALUE = re.compile(r"^[ \t#-]*\w*BRIDGE\w*TOKEN[ \t]*=[ \t]*(?!\$\{)[^\s#]", re.M | re.I)
GETENV_FALLBACK = re.compile(r"""getenv\(\s*['"]\w*BRIDGE\w*TOKEN['"]\s*,""", re.I)


def bridge_docs() -> dict[str, str]:
    docs = {}
    for rel in BRIDGE_DOCS:
        path = REPO_ROOT / rel
        if path.exists():
            docs[rel] = path.read_text(encoding="utf-8")
    return docs


class BridgeTokenDocsTest(unittest.TestCase):
    def setUp(self) -> None:
        self.docs = bridge_docs()
        self.assertTrue(self.docs, "no bridge doc found to check")

    def test_old_token_is_gone(self) -> None:
        for rel, text in self.docs.items():
            for word in set(re.findall(r"[A-Za-z0-9_-]{20,}", text)):
                digest = hashlib.sha256(word.encode()).hexdigest()
                self.assertNotEqual(digest, OLD_TOKEN_SHA256, f"old bridge token in {rel}")

    def test_header_examples_read_the_token_from_env(self) -> None:
        for rel, text in self.docs.items():
            self.assertIsNone(QUOTED_HEADER_LITERAL.search(text), rel)
            self.assertIsNone(PLAIN_HEADER_LITERAL.search(text), rel)

    def test_env_examples_leave_the_token_empty(self) -> None:
        for rel, text in self.docs.items():
            self.assertIsNone(ENV_TOKEN_VALUE.search(text), rel)

    def test_no_getenv_fallback_for_the_token(self) -> None:
        for rel, text in self.docs.items():
            self.assertIsNone(GETENV_FALLBACK.search(text), rel)

    def test_secrets_scan_does_not_skip_the_bridge_token(self) -> None:
        script = REPO_ROOT / "scripts" / "validate-deploy-ready.sh"
        if not script.exists():
            self.skipTest("no validate-deploy-ready.sh")
        for line in script.read_text(encoding="utf-8").splitlines():
            if "grep -v" in line:
                self.assertNotIn("bridge", line.lower(), line.strip())


if __name__ == "__main__":
    unittest.main()
