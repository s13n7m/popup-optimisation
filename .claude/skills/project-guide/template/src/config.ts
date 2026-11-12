/**
 * Everything that makes this guide about one project. To reuse the guide for another
 * project, edit this file and src/content/. Nothing else should need to change.
 */
export const GUIDE = {
  title: 'My project guide',
  subtitle: 'Your step-by-step guide to building this project, one branch per stage.',
  /** Prefix for browser storage keys. Change it per project so guides do not share ticks. */
  storageKey: 'my-project-guide',
  /** Label for the cross-cutting thread tag (Card.ui), shown on cards and as a filter. */
  threadLabel: 'Frontend',
  /** Stage whose header links to the reference tab. Use '' to hide that button. */
  referenceStageId: 'data',
  /** The reference tab, for source or API how-tos. Remove the tab in App.tsx if unused. */
  reference: {
    tabLabel: 'Sources',
    title: 'Sources for the data stage',
    intro: 'What each outside source is for, how to get access, and what to watch out for. Check each docs link before relying on it.',
    tableHeading: 'Where each field comes from',
    listHeading: 'How to use each source',
  },
};
