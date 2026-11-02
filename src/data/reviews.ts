/**
 * Real Google reviews, quoted from the Google Reviews widget on the live site
 * (captured 2 November 2026). Excerpts are cut to three lines or fewer (Section 4.10), never reworded:
 * … marks a cut inside a quote, and an excerpt may start at a later sentence of the review.
 * Decision D15: confirm with the owner that these may be quoted before launch.
 */
export interface Review {
  name: string;
  /** What the job was, from the review itself. */
  project: string;
  quote: string;
}

export const reviews: Review[] = [
  {
    name: 'Jocelyn Howell',
    project: 'Carpentry',
    quote:
      'Fantastic work, Gary has a great eye for detail. Exceptional skill and knowledge of his craft.',
  },
  {
    name: 'guy robinson',
    project: 'Kitchen refurbishment',
    quote:
      'First class workmanship no snags, just done right first time.',
  },
  {
    name: 'Matthew Baldwin',
    project: 'Media wall',
    quote:
      'We’re absolutely delighted with the media wall Gary installed … it’s completely transformed the space.',
  },
  {
    name: 'Ian Tidball',
    project: 'Car port to garage conversion',
    quote:
      'From the initial site survey … everything was handled professionally and efficiently.',
  },
  {
    name: 'Andrew Rice',
    project: 'Building work',
    quote:
      'Gary’s work is tidy and efficient. … He was also great working with and around the other trades on site.',
  },
  {
    name: 'Christine Ellingham',
    project: 'Fitted wardrobe',
    quote:
      'As a piece of furniture it is simple, elegant and functional …',
  },
  {
    name: 'Diana Robertshaw',
    project: 'Staircase',
    quote:
      'Right from the outset Gary has listened to what I wanted and the materials I wanted.',
  },
];
