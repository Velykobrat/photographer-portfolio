import type { JournalArticle } from './journalArticles';

type ArticleCopy = Pick<JournalArticle, 'subtitle' | 'excerpt' | 'intro' | 'questions' | 'featuredQuote' | 'closing'>;
export const journalEnglish: Record<string, ArticleCopy> = {
  '12-questions-with-margaret': {
    subtitle: 'On authenticity, people in front of the camera, the little things that inspire her, and the hope of one day seeing her photographs on gallery walls.',
    excerpt: 'Twelve simple questions about photography, people, inspiration and where Margaret wants to go next.',
    intro: [
      'For Margaret, photography is about people first: their emotions, character, stories, and the moments when tension in front of the camera gradually disappears and something real remains.',
      'We asked her twelve simple questions, about photography as well as what she values, what inspires her and where she wants to go next.',
    ],
    questions: [
      { question: 'What are you like in everyday life?', answer: 'Down-to-earth and caring.' },
      { question: 'What brings you the most joy right now?', answer: 'Having my partner beside me, my cat and exciting shoots.' },
      { question: 'What do you value most in people?', answer: 'Authenticity.' },
      { question: 'What do you find beautiful that others might overlook?', answer: 'Morning meditation. Those quiet moments when you can pause and spend a little time with yourself.' },
      { question: 'When did photography enter your life?', answer: 'In 2019.' },
      { question: 'What do you enjoy most about the process of a shoot?', answer: 'People’s sincere emotions and the team spirit. I love the moment when everyone gets involved and we create something special together.' },
      { question: 'What do you find most difficult in photography so far?', answer: 'It is hard to single out one thing. I think there is always room to grow at every stage of the work, and that is what I like about it.' },
      { question: 'What kinds of people interest you in front of the camera?', answer: 'All kinds. I enjoy helping people open up, seeing them in a new way and finding their stories in the frame.' },
      { question: 'What do you want someone to feel during a shoot with you?', answer: 'Enjoyment of the process itself. And their own beauty.' },
      { question: 'What inspires you outside photography?', answer: 'Sport and the opportunity to become a better version of myself.' },
      { question: 'If money and trends were not a concern, what would you want to photograph?', answer: 'People’s stories. That is probably what interests me most: to create a beautiful image and preserve a little piece of someone’s story through photography.' },
      { question: 'How would you like to see yourself in a few years?', answer: 'A better version of myself. Someone who keeps growing, holds her own photography exhibitions and inspires both herself and others.' },
    ],
    featuredQuote: 'I enjoy helping people open up and seeing their stories in the frame.',
    closing: [
      'Margaret does not claim to have found all the answers. Photography remains a space for growth, new people and new stories.',
      'Perhaps that is her approach: noticing what is real, seeing beauty in a person and preserving their story in the frame.',
    ],
  },
  'beyond-the-frame': {
    subtitle: 'On authenticity, slow mornings, people in front of the camera, creative ease and the dream of one day showing her portraits at an exhibition in Paris.',
    excerpt: 'Margaret talks about her journey from modelling to photography, trust between photographer and subject, self-discipline and her fear of losing her creative spark.',
    intro: [
      'In our first conversation, Margaret returned several times to people: their authenticity, emotions and stories. This time, we wanted to go a little further and talk about who she is beyond the camera.',
      'About unhurried mornings, self-discipline, the modelling that started it all, working with insecurity in front of the camera and the dream of one day seeing her portraits on the walls of an exhibition in Paris.',
    ],
    questions: [
      { question: 'You said you value authenticity most in people. How do you know someone is authentic?', answer: 'Through the way they behave and communicate. You can feel it in how naturally someone remains themselves.' },
      { question: 'Is it easy for you to be yourself around other people?', answer: 'Yes.' },
      { question: 'You mentioned morning meditation. What does it give you, and what does your ideal morning look like?', answer: 'It is time for myself. I like a morning that starts at a calm pace, without rushing.' },
      { question: 'What does your ideal day away from work look like?', answer: 'A day when I am not rushing anywhere and can be in harmony with how I feel inside. Time with loved ones, and definitely an hour for table tennis.' },
      { question: 'Photography entered your life in 2019. What was happening then, and why did you pick up a camera?', answer: 'Modelling led me to photography. At some point, I felt I wanted more: to be in the frame and also create the images myself.' },
      { question: 'Do you remember the first shoot you were truly proud of?', answer: 'It was a shoot for a clothing brand. I felt a particular creative ease. The whole team was on the same wavelength, and the process unfolded very naturally.' },
      { question: 'You enjoy helping people open up. Is it easy for you to open up in front of a camera or another person?', answer: 'It used to be difficult. Now it is much easier.' },
      { question: 'What do you do when someone at a shoot seems very tense or unsure of themselves?', answer: 'I give them time to get used to it. I do not try to rush straight into shooting. It matters more to me that they relax first.' },
      { question: 'Is there a person or type of subject you would especially like to photograph one day?', answer: 'Yes. I would like to do a shoot for a world-famous celebrity.' },
      { question: 'What does a “beautiful person” mean to you?', answer: 'First of all, someone with a beautiful soul.' },
      { question: 'Sport is a way of improving yourself. Do you compete with yourself or compare yourself with others?', answer: 'I would not say I compete with myself directly. I simply work on improving myself without comparing myself with others.' },
      { question: 'Are you strict with yourself, or can you recognise your own progress?', answer: 'I can be quite disciplined, but I also know how to recognise my progress.' },
      { question: 'Where do you already feel much stronger than you did a few years ago?', answer: 'In almost everything: communicating with people, understanding equipment and working with light.' },
      { question: 'What are you most afraid of losing if photography one day becomes a major professional commitment?', answer: 'My creative spark.' },
      { question: 'Imagine your first photography exhibition. Where is it, and what photographs are on the walls?', answer: 'In Paris. And the walls are filled with portraits of people.' },
      { question: 'If someone could remember just one feeling after meeting you, what would it be?', answer: 'Lightness.' },
    ],
    featuredQuote: 'I like a day that unfolds without rushing, in harmony with how I feel inside.',
    closing: [
      'The word “lightness” appears in this conversation for a reason. It is there in the memory of her first important shoot, in the way Margaret works with people in front of the camera, and in what she hopes people feel after meeting her.',
      'Behind that lightness are discipline, constant learning and a desire to become stronger, without needing to compare herself with others.',
      'Perhaps that combination will one day lead her to that exhibition in Paris, with portraits on the walls and someone’s story behind each one.',
    ],
  },
};
