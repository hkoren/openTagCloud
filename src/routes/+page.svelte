<script lang="ts">
  import { TagCloud, type TagCloudItem } from '$lib/index.js';

  // A weighted list of tags. `weight` drives the font size; `href` makes a tag a link.
  const languages: TagCloudItem[] = [
    { label: 'JavaScript', weight: 95, href: '#js' },
    { label: 'TypeScript', weight: 88, href: '#ts' },
    { label: 'Python', weight: 82, href: '#py' },
    { label: 'Rust', weight: 60, href: '#rust' },
    { label: 'Go', weight: 55, href: '#go' },
    { label: 'Svelte', weight: 70, href: '#svelte' },
    { label: 'Ruby', weight: 40, href: '#ruby' },
    { label: 'C++', weight: 45, href: '#cpp' },
    { label: 'Haskell', weight: 22, href: '#haskell' },
    { label: 'Elixir', weight: 30, href: '#elixir' },
    { label: 'Kotlin', weight: 38, href: '#kotlin' },
    { label: 'Swift', weight: 42, href: '#swift' },
    { label: 'Zig', weight: 18, href: '#zig' },
    { label: 'Clojure', weight: 20, href: '#clojure' },
    { label: 'PHP', weight: 48, href: '#php' },
    { label: 'Scala', weight: 26, href: '#scala' },
    { label: 'Lua', weight: 16, href: '#lua' },
    { label: 'C#', weight: 58, href: '#csharp' },
    { label: 'Dart', weight: 28, href: '#dart' },
    { label: 'Perl', weight: 12, href: '#perl' },
  ];

  // The `color` feature: give individual tags their own color (any CSS color).
  const sentiment: TagCloudItem[] = languages.map((t) => ({
    ...t,
    color: t.weight >= 65 ? '#16a34a' : t.weight <= 25 ? '#dc2626' : undefined,
  }));
</script>

<main>
  <h1>openTagCloud</h1>
  <p>A dependency-free, self-packing tag cloud component for Svelte 5.</p>

  <div class="box">
    <TagCloud items={languages} />
  </div>

  <h2>Custom sizes &amp; theming</h2>
  <p>
    Font range via <code>minPx</code>/<code>maxPx</code>; colors via the
    <code>--otc-color</code> and <code>--otc-hover-color</code> custom properties.
  </p>
  <div class="box themed">
    <TagCloud items={languages} minPx={14} maxPx={56} />
  </div>

  <h2>Per-tag color</h2>
  <p>
    Give any tag its own <code>color</code> (any CSS color, incl.
    <code>var(--…)</code>) to highlight or categorize — here green for the most popular, red for the
    least.
  </p>
  <div class="box">
    <TagCloud items={sentiment} />
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    color: #111;
    background: #fff;
  }
  main {
    max-width: 820px;
    margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
  }
  h1 {
    margin-bottom: 0.25rem;
  }
  p {
    color: #555;
  }
  code {
    background: #f2f2f2;
    padding: 0.1em 0.35em;
    border-radius: 4px;
    font-size: 0.9em;
  }
  .box {
    height: 320px;
    margin: 1rem 0 2rem;
    padding: 1rem;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    display: flex;
  }
  .themed {
    background: #0b1020;
    border-color: #0b1020;
    --otc-color: #a7b0c0;
    --otc-hover-color: #66e0c0;
  }
</style>
