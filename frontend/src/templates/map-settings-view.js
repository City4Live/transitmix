// Map Settings View Template
export const mapSettingsViewTemplate = `
<h2>Line Defaults</h2>
<div class="closeSettings">&#x2715;</div>

<div class="innerSettings"</div>
  <div class="weekdays">
    <h3>Service Windows</h3>
    <div class="weekdayServiceWindows serviceWindows"></div>
  </div>

  <div class="weekends">
    <div class="weekendServiceWindows serviceWindows"></div>
  </div>

  <div class="additional">
    <h3>Advanced</h3>
    <div class="item"><input type="text" class="speed"> avg. speed</div>
    <div class="item"><input type="text" class="layover"> recovery time</div>
    <div class="item"><input type="text" class="hourlyCost"> per hour</div>
  </div>

  <div class="additional">
    <div class="item"><input type="text" class="weekdaysPerYear"> weekdays</div>
    <div class="item"><input type="text" class="saturdaysPerYear"> saturdays</div>
    <div class="item"><input type="text" class="sundaysPerYear"> sundays</div>
  </div>

  <div class="additional">
    <div class="item toggleParent serviceHoursToggle"><div class="toggle"></div> Show service hours, not cost</div>
    <div class="item toggleParent metricUnitsToggle"><div class="toggle"></div> Use metric units (km)</div>
    <div class="item">&nbsp;</div>
  </div>
</div>

<p>Will apply to new lines. You can also <span class="applyToAll">apply to all existing lines</span>.</p>
`;
