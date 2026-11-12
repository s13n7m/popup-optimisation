/**
 * Everything that makes this guide about one project. To reuse the guide for another
 * project, edit this file and src/content/. Nothing else should need to change.
 */
export const GUIDE = {
  title: 'Pop-up build guide',
  subtitle: 'Your step-by-step guide to building the predict-then-decide planner, one branch per stage.',
  /** Prefix for browser storage keys. Change it per project so guides do not share ticks. */
  storageKey: 'popup-guide',
  /** Label for the cross-cutting thread tag (Card.ui), shown on cards and as a filter. */
  threadLabel: 'Planner UI',
  /** Stage whose header links to the reference tab. Use '' to hide that button. */
  referenceStageId: 'build-the-data',
  /** The reference tab, for source or API how-tos. Remove the tab in App.tsx if unused. */
  reference: {
    tabLabel: 'Data sources',
    title: 'Data sources for stage 2',
    intro:
      'The plan is an open base list enriched with area statistics, with paid or restricted APIs used only on a shortlist. Test-drive outcomes stay simulated, because no API provides them. This page was written from memory, so open each docs link to confirm endpoints, field names, limits and licence terms before you build on it.',
    tableHeading: 'Where each column comes from',
    listHeading: 'How to use each source',
  },
};
