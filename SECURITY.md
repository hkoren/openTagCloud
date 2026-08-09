# Security policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 0.4.x   | ✅        |
| < 0.4   | ❌        |

Fixes land on the latest minor. All seven packages share a version and are
released together, so a security release bumps every package.

## Reporting a vulnerability

Please report privately through GitHub's
[private vulnerability reporting](https://github.com/hkoren/openTagCloud/security/advisories/new)
— use the **Report a vulnerability** button on the repository's Security tab.
Do not open a public issue for a suspected vulnerability.

Include the affected package and version, what an attacker can achieve, and a
reproduction (a minimal `items` array is usually enough). A response can be
expected within a week; this is a small project maintained in spare time.

## What is in scope

openTagCloud renders a tag cloud from data the host application supplies. That
data is frequently user-generated — tags typed by visitors, terms counted from
submitted content — so the library treats several `TagCloudItem` fields as
untrusted and validates them.

**Validated by the library:**

| Field    | Handling                                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `href`   | Only relative URLs and safe schemes (`http`, `https`, `mailto`, `tel`, `ftp`, `sms`) become links. `javascript:`, `data:` and obfuscated variants render as plain text. |
| `color`  | Restricted to the characters CSS colors need, so a value cannot terminate the declaration and inject others.                                                            |
| `weight` | Negative and non-finite values are clamped, so they cannot produce invalid CSS.                                                                                         |
| `label`  | Rendered as text, never as markup.                                                                                                                                      |

**Treated as trusted input — do not pass untrusted data:**

| Field   | Why                                                                                                                               |
| ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `class` | Appended to the tag's class list, so a caller can attach arbitrary classes. Intended for your own styling hooks.                  |
| `id`    | Used as a rendering key and the layout's scatter seed. Not reflected into the DOM as an identifier, but should be your own value. |

`ariaLabel` and `title`, when you pass functions or strings, are rendered as
text — but they are your content, not the library's, so they inherit whatever
trust your source has.

## Out of scope

- The layout is deterministic by design: identical input produces an identical
  arrangement, and the per-tag scatter seed is derived from the tag key. This is
  not a source of randomness and must not be relied on for anything security
  relevant.
- Denial of service from pathological input sizes. The packer is bounded (spiral
  probes cap out and collision testing is spatially hashed), but rendering tens
  of thousands of tags will still be slow — cap the list in your application.
