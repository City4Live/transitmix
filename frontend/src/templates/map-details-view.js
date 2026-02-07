// Map Details View Templates
export const mapDetailsViewTemplate = `
<header>
  <h1>{{ name }}</h1>
  <div class="toggleSettings"></div>
  {# if (remixedFromId) { #}
    <div class="source">Remixed from <span class="remixedFrom">#{{ remixedFromId }}</span></div>
  {# } #}
  <div class="stats">
    This map: <label class="lineCount"></label> lines,
    <label class="distance"></label>,
    <label class="costWrapper"><label class="cost"></label> per year, </label>
    <label class="hoursWrapper"><label class="hours"></label> hrs / year, </label>
    <label class="buses"></label> buses at peak</div>
</header>

<div class="scrollable">
  <div class="lines">
    <!-- Lines are dynamically inserted here -->
  </div>
</div>

<div class="actions">
  <div class="left">
    <span class="add">Add a line</span>
  </div>

  <div class="right">
   <span class="export"></span>
   <span class="share">Share</span>
   <span class="remix">Remix</span>
  </div>
</div>

<div class="sharebox" style="display:none">
    <input type="text" />
    Download <a href="/api/maps/{{ id }}.kml">KML</a> or <a href="/api/maps/{{ id }}.zip">Shapefile</a>
`;

export const mapDetailsViewEmptyTemplate = `
<header>
  <h1>{{ name }}</h1>
  <div class="toggleSettings"></div>
  <p>Lovely city you've got there. But it sure could use some transit.<!-- ' Fix syntax coloring in Sublime--></p>
  <p>Start by <span class="add">adding a transit line</span>.</p>
</header>
<div class="advancedStart">
  <p>Want more control? Then <span class="toggleSettingsText">configure the settings</span> first.</p>
</div>
`;
