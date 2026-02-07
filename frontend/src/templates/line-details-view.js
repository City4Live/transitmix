// Line Details View Template
export const lineDetailsViewTemplate = `
<nav>
  <div class="back">&#8592; All lines</div>
  <div class="right">
    <div class="add">Add a line</div>
    <div class="delete">Delete</div>
  </div>
</nav>

<header style="background: {{ color }}">
  <div class="name" contenteditable="true"><!-- dynamically inserted --></div>
</header>

<div class="serviceWindows" style="background: {{ color2 }};">
  <div class="columns">
    <span class="windowName"></span>
    <span class="from">From</span>
    <span class="to">To</span>
    <span class="headway">Every</span>
  </div>

  <div class="windows">
    <!-- dynamically inserted -->
  </div>
</div>

<div class="outputs" style="background: {{ color3 }}">
  <h2>This line:</h2>
  <span class="distance">0 miles</span> <span class="showMileageOutputs"></span><br/>
  <span class="buses">0 buses</span> at peak <span class="showBusOutputs"></span><br/>
  <div class="costWrapper">
    <span class="cost">$0</span> / year <span class="showCostOutputs"></span>
  </div>
  <div class="revenueHoursWrapper" style="display:none">
    <span class="bigRevenueHours"></span> / year <span class="showCostOutputs"></span>
  </div>
</div>

<div class="outputs advancedOutputs mileageOutputs" style="background: {{ color3 }}">
  <h2>Distance:</h2>
  <span class="halfDistance">1.80 miles</span> each way<br/>
  <p>Support for differing inbound and outbound lines coming soon.</p>
</div>

<div class="outputs advancedOutputs busOutputs" style="background: {{ color3 }}">
  <h2>Bus assumptions:</h2>
  <input type="text" class="speed"> avg. speed<br/>
  <input type="text" class="layover"> recovery time<br/>
</div>

<div class="outputs advancedOutputs costOutputs" style="background: {{ color3 }}">
  <div class="dayCounts">
    Assuming: <input type="text" class="weekdaysPerYear"> weekdays,<br/>
    <input type="text" class="saturdaysPerYear"> saturdays,
    and <input type="text" class="sundaysPerYear"> sundays.
  </div>

  <span class="revenueHours">4504</span> service hours<br/>
  x <input type="text" class="hourlyCost"> per hour<br/>
  <p><a target="_blank" href="http://www.humantransit.org/02box.html">Read more</a> on transit costs.</p>
</div>
`;
