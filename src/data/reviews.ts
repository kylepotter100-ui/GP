/**
 * Real Google reviews, quoted from the Google Reviews widget on the live site
 * (captured 2 November 2026). Excerpts are cut to three lines or fewer, never reworded; … marks a cut.
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
      'Came back from holiday to a new kitchen. First class workmanship no snags, just done right first time.',
  },
  {
    name: 'Matthew Baldwin',
    project: 'Media wall',
    quote:
      'We’re absolutely delighted with the media wall Gary installed in our front room, it’s completely transformed the space.',
  },
  {
    name: 'Ian Tidball',
    project: 'Car port to garage conversion',
    quote:
      'From the initial site survey right through to completion, everything was handled professionally and efficiently.',
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
      'As a piece of furniture it is simple, elegant and functional, constructed with Gary’s good eye for detail and precision.',
  },
  {
    name: 'Diana Robertshaw',
    project: 'Staircase',
    quote:
      'Right from the outset Gary has listened to what I wanted and the materials I wanted.',
  },
];
