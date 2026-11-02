import type { Recommendation } from './recommendations.types'

// All of them on the LinkedIn profile, so visitors can check the quotes.
// Moves to the `profile` global with the rest of the mock.
export const LINKEDIN_RECOMMENDATIONS_URL = 'https://www.linkedin.com/in/alejandromejiac/details/recommendations/'

// From the LinkedIn export (Recommendations_Received.csv, 2026-10-28): the
// thirteen recommendations visible on LinkedIn, newest first; the hidden ones
// stay hidden. Quotes are word for word (only their em dashes became
// commas, colons or semicolons). `role` and `company` are where they worked
// with Alejandro when they wrote it, never where they work now (LinkedIn
// exports the current ones; Alejandro confirmed each, 2026-10-29). Freelance
// clients whose company he doesn't remember are a "Client" with no company. The featured four make one
// point together: bring him a wild idea and he finds a way to build it,
// learning whatever it takes, with a designer's eye and an engineer's hands. Moves to the `recommendations` collection once
// the pages are signed off.
export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'veronika-sadkova',
    name: 'Veronika Sadkova',
    role: 'UI/UX Designer',
    company: 'ChromaWay',
    date: '2025-09-29',
    quote:
      'I had the pleasure of working with Alejandro for more than one year at the ChromaWay. As a UI/UX designer, I collaborated with him on a daily basis, from the very first project requirements to final support activities.\n\nWhat I value most about Alejandro is that he is not only a great developer but also someone who deeply understands design. He brought his own experience and ideas into the process, always suggesting creative solutions and making every feature pixel-perfect. I could come to him with any crazy idea, and he would turn it into reality: fast, reliable, and always within deadlines.\n\nOn top of his strong skills, Alejandro is a fantastic teammate: open, supportive, and never afraid of challenges. He made our work enjoyable and inspiring. Honestly, he is one of the best developers I’ve ever worked with, and any team would be lucky to have him!',
    excerpt:
      'What I value most about Alejandro is that he is not only a great developer but also someone who deeply understands design. … I could come to him with any crazy idea, and he would turn it into reality: fast, reliable, and always within deadlines.',
    featured: true,
  },
  {
    id: 'miguel-aymes',
    name: 'Miguel Aymes',
    role: 'Art Director',
    company: 'ChromaWay',
    date: '2025-09-12',
    quote:
      'I had the pleasure of working with Alejandro on our team, and I can confidently say he was an exceptional developer and teammate. From day one, he stood out as a true collaborator, always eager to help us bring our visual concepts to life.\n\nWhat impressed me most was his mindset: “impossible” was never in his vocabulary. Even when faced with challenges outside of his immediate knowledge, he would research, experiment, and find solutions to make things happen. That determination not only pushed projects forward but also created an environment of trust and creativity within the team.\n\nBeyond execution, Alejandro contributed valuable insights on enhancing user experience and refining visual design. He is resourceful, solution-oriented, and genuinely collaborative. Actively engaged in discussions, offering perspectives that made our work stronger and more impactful. Working with someone who was not just technically skilled, but also deeply invested in the quality and usability of what we built was refreshing and a game-changer for us.',
    excerpt:
      'What impressed me most was his mindset: ‘impossible’ was never in his vocabulary. Even when faced with challenges outside of his immediate knowledge, he would research, experiment, and find solutions to make things happen.',
    featured: true,
  },
  {
    id: 'olena-riabchenko',
    name: 'Olena Riabchenko',
    role: 'Project Coordinator',
    company: 'ChromaWay',
    date: '2025-06-24',
    quote:
      'It’s not every day that you get to work with a front-end developer like Alejandro. From day one, he’s been a key partner &, honestly, a beloved member of the design team, bridging creativity and code with precision, empathy, and a strong sense of purpose.\n\nAlejandro is the kind of teammate every designer & manager dreams of. He not only brings concepts to life exactly as envisioned, but often enhances them through thoughtful suggestions and meticulous attention to detail. His understanding of user experience, responsiveness, and pixel-perfect execution ensures that our designs don’t just look good; they perform beautifully.\n\nOne of the qualities I admire most about Alejandro is his solution-driven mindset. He never says “it can’t be done.” Instead, he asks “how can we make it happen?” Whether facing a tight deadline, a complex animation, or an unexpected technical constraint, he always approaches challenges with calm determination and creativity. And somehow, he doesn’t just meet expectations; he exceeds them, consistently pushing the boundaries of what we thought was possible.\n\nBeyond his technical skills, Alejandro is a true team builder. His positive attitude, willingness to share knowledge, and respectful communication style create an inclusive and empowering environment. He supports others, lifts team morale, and fosters collaboration across disciplines. Working with him doesn’t just improve the product; it improves the process.\n\nIn short, Alejandro is not just a fantastic developer; he’s a catalyst for great teamwork and better outcomes. Any team would be lucky to have his expertise, mindset, and spirit on board.',
    excerpt: 'He never says ‘it can’t be done.’ Instead, he asks ‘how can we make it happen?’',
    featured: true,
  },
  {
    id: 'roman-tsymbryla',
    name: 'Roman Tsymbryla',
    role: 'Motion Designer',
    company: 'ChromaWay',
    date: '2025-06-23',
    quote:
      'Working with Alejandro Mejía has been a great experience. He’s a great front-end developer who consistently takes on challenges and delivers with precision. His attention to detail is outstanding, and his positive, collaborative attitude makes him a pleasure to work with. Any team would be lucky to have him.',
  },
  {
    id: 'guillermo-carandini',
    name: 'Guillermo Carandini',
    role: 'Marketing Lead',
    company: 'ChromaWay',
    date: '2025-06-05',
    quote:
      'Alejandro is an outstanding web developer and a fantastic team player. What truly sets him apart is his strong work ethic, flexibility, and deep commitment to the projects he’s involved in, especially in a space as complex as crypto. From day one, he integrated seamlessly into the team, collaborating closely with designers and artists, bringing a great sense of empathy, positivity, and natural motivation. He consistently delivers solutions on time, combining a sharp aesthetic sense with impressive technical expertise. In that regard, Alejandro is the full package. Highly recommended!',
    excerpt:
      'He consistently delivers solutions on time, combining a sharp aesthetic sense with impressive technical expertise. In that regard, Alejandro is the full package.',
    featured: true,
  },
  {
    id: 'michael-kondratenko',
    name: 'Michael Kondratenko',
    role: 'Creative Director',
    company: 'ChromaWay',
    date: '2025-03-17',
    quote:
      'I had the pleasure of working with Alejandro Mejia for almost a year on the Chromia / ChromaWay project, and I can confidently say that he is one of the best developers I’ve ever collaborated with.\n\nAs a designer, I worked closely with Alejandro on websites and landing pages, and his attention to detail is truly exceptional. He has a rare ability to bring even the most complex design concepts to life with pixel-perfect execution. His technical expertise, precision, and problem-solving skills ensure that every project meets the highest standards.\n\nBeyond his skills, Alejandro is a fantastic team player: reliable, proactive, and always open to feedback. Working with him was an absolute pleasure, and I would highly recommend him to anyone looking for a top-tier developer.',
  },
  {
    id: 'jaime-luis-quintanar',
    name: 'Jaime Luis Quintanar',
    role: 'Project Manager',
    company: 'BairesDev',
    date: '2023-10-12',
    quote:
      'Alejandro has been working in a project for the past year, and I can say he is always conducting himself very professionally. He keeps delivering and exceeding expectations, and is very talented in communicating status, deadlines, and objectives.',
  },
  {
    id: 'nathan-rutman',
    name: 'Nathan Rutman',
    role: 'Senior Software Engineer',
    company: 'Fieldguide',
    date: '2023-10-04',
    quote:
      'Alejandro was able to help our team implement a number of valuable additions to our product. He implemented new UIs, added end-to-end tests, and implemented bug fixes. He helped us surface and clarify requirements, and ramped on new tools/frameworks in our stack. Through it all, Alejandro was easy to collaborate with throughout the entire process, which is critical for any healthy engineering team.',
  },
  {
    id: 'zack-leo-davisson',
    name: 'Zack Leo Davisson',
    role: 'Client',
    relationship: 'Freelance website',
    date: '2020-04-24',
    quote:
      'Alejandro’s work was excellent. It was a pleasure to work with a freelancer who was as dependable, responsive, and talented as Alejo',
  },
  {
    id: 'dylan-donlon-moyer',
    name: 'Dylan Donlon-Moyer',
    role: 'Product Manager',
    company: '10Pearls',
    date: '2020-04-24',
    quote:
      'Alejandro is an incredible UI/UX talent and an absolutely wonderful colleague to work with. He is responsive, friendly, and efficient in his duties, and is always eager to continue learning and improving the products he creates. He faithfully brings even the most complex designs to life and can always be counted on to build reliable and beautiful frameworks for any project. I would love to have Alejandro on all of my teams!',
  },
  {
    id: 'liliana-patricia-franco-uribe',
    name: 'Liliana Patricia Franco Uribe',
    role: 'Project Manager',
    company: 'Integro',
    date: '2020-04-22',
    quote:
      'Are you looking for a good team player? Then Alejo is definitely the right match. He is a great UI designer with a keen eye for details. He is always ready to help the team, ready to learn new things and ready for challenges. I worked with him for about one year and I would definitely repeat the experience.',
  },
  {
    id: 'emily-biondo',
    name: 'Emily Biondo',
    role: 'Product Designer',
    company: '10Pearls',
    date: '2020-04-15',
    quote:
      'Alejandro is amazing at his job. He has an intuitive sensibility for UX and UI, and is a fantastic collaborator. Working with him was effortless: he was always responsive, always confident we could arrive at a solution, and always came through with effective, beautiful interfaces. I wish I could work with a thousand Alejandros.',
    excerpt:
      'He has an intuitive sensibility for UX and UI, and is a fantastic collaborator. … I wish I could work with a thousand Alejandros.',
  },
  {
    id: 'dillon-dubois',
    name: 'Dillon DuBois',
    role: 'Client',
    relationship: 'Freelance website',
    date: '2020-04-14',
    quote:
      'Working with Alejo has been an absolute pleasure. He helped me design an entire wholesale real estate web page from scratch that is now working smoothly as a powerful lead generation asset. Throughout the entire process, Alejo’s responsiveness, professionalism, and expertise were off the charts. Any changes I needed were made quickly and efficiently. I can’t recommend Alejo enough!',
  },
]

/** A recommendation by its id, if there is one. */
export function findRecommendation(id: string): Recommendation | undefined {
  return RECOMMENDATIONS.find((recommendation) => recommendation.id === id)
}
