// Feedback View Template
export const feedbackViewTemplate = `
<div class="feedbackHint">What is Transitmix?</div>
<div class="feedbackExpansion" style="display:none">
  <div class="feedbackDescription">This is an <a href="https://github.com/codeforamerica/transitmix/blob/master/README.md" target="_blank">early preview</a> of a transit planning app, made by <a href="http://codeforamerica.org/about/" target="_blank">Code for America</a>. Help make it better by <a href="mailto:transitmix@codeforamerica.org">emailing us</a> with feedback, or catch us on twitter: <a href="https://twitter.com/transitmixapp" target="_blank">@transitmixapp</a>.</div>
  <div class="feedbackDescription">Or sign up for email updates:</div>
   <form class="feedbackForm" action="https://tinyletter.com/transitmix" method="post" target="popupwindow" onsubmit="window.open('https://tinyletter.com/transitmix', 'popupwindow', 'scrollbars=yes,width=800,height=600');return true">
    <input type="text" style="width:250px" name="email" id="tlemail" placeholder="enter email address" />
    <input type="hidden" value="1" name="embed"/><input class="feedbackSubmit" type="submit" value="Subscribe" />
  </form>
</div>
`;
