// Feedback View Component
import { BaseView } from '../../framework/BaseView.js';
import { feedbackViewTemplate } from '../../templates/feedback-view.js';

export const FeedbackView = BaseView.extend({
  className: 'feedbackView',

  templateString: feedbackViewTemplate,

  events: {
    'click': 'expandFeedback',
    'mouseleave': 'hideFeedback',
  },

  expandFeedback: function() {
    this.$('.feedbackExpansion').show();
    this.$el.addClass('expanded');
  },

  hideFeedback: function() {
    this.$('.feedbackExpansion').hide();
    this.$el.removeClass('expanded');
  },
});

// Backward compatibility
if (typeof window !== 'undefined') {
  window.app = window.app || {};
  window.app.FeedbackView = FeedbackView;
}
