export interface Rhyme {
    id: string;
    title: string;
    emoji: string;
    category: 'nursery-rhyme' | 'action-rhyme' | 'counting-rhyme';
    ageGroup: string;
    content: string;
    stars: number;
}

export interface Story {
    id: string;
    title: string;
    emoji: string;
    category: 'fairy-tale' | 'fable' | 'adventure' | 'bedtime';
    ageGroup: string;
    pages: string[];
    moral?: string;
    stars: number;
}

export interface Song {
    id: string;
    title: string;
    emoji: string;
    category: 'classic' | 'educational' | 'action-song';
    lyrics: string[];
    stars: number;
}

export const rhymes: Rhyme[] = [
    {
        id: 'twinkle-twinkle',
        title: 'Twinkle Twinkle Little Star',
        emoji: '⭐',
        category: 'nursery-rhyme',
        ageGroup: '2-5',
        stars: 10,
        content: `Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky.

When the blazing sun is gone,
When he nothing shines upon,
Then you show your little light,
Twinkle, twinkle, through the night.`
    },
    {
        id: 'jack-and-jill',
        title: 'Jack and Jill',
        emoji: '🏔️',
        category: 'nursery-rhyme',
        ageGroup: '2-5',
        stars: 10,
        content: `Jack and Jill went up the hill
To fetch a pail of water.
Jack fell down and broke his crown,
And Jill came tumbling after.

Up Jack got, and home did trot,
As fast as he could caper,
He went to bed to mend his head
With vinegar and brown paper.`
    },
    {
        id: 'humpty-dumpty',
        title: 'Humpty Dumpty',
        emoji: '🥚',
        category: 'nursery-rhyme',
        ageGroup: '2-5',
        stars: 10,
        content: `Humpty Dumpty sat on a wall,
Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.`
    },
    {
        id: 'mary-had-a-little-lamb',
        title: 'Mary Had a Little Lamb',
        emoji: '🐑',
        category: 'nursery-rhyme',
        ageGroup: '2-5',
        stars: 10,
        content: `Mary had a little lamb,
Its fleece was white as snow;
And everywhere that Mary went
The lamb was sure to go.

It followed her to school one day,
Which was against the rules;
It made the children laugh and play,
To see a lamb at school.`
    },
    {
        id: 'baa-baa-black-sheep',
        title: 'Baa, Baa, Black Sheep',
        emoji: '🐑',
        category: 'nursery-rhyme',
        ageGroup: '2-4',
        stars: 10,
        content: `Baa, baa, black sheep,
Have you any wool?
Yes sir, yes sir,
Three bags full.

One for the master,
One for the dame,
And one for the little boy
Who lives down the lane.`
    },
    {
        id: 'one-two-buckle',
        title: 'One, Two, Buckle My Shoe',
        emoji: '👟',
        category: 'counting-rhyme',
        ageGroup: '3-6',
        stars: 15,
        content: `One, two, buckle my shoe;
Three, four, knock at the door;
Five, six, pick up sticks;
Seven, eight, lay them straight;
Nine, ten, a big fat hen!`
    },
    {
        id: 'head-shoulders',
        title: 'Head, Shoulders, Knees & Toes',
        emoji: '🙋',
        category: 'action-rhyme',
        ageGroup: '2-5',
        stars: 15,
        content: `Head, shoulders, knees and toes,
Knees and toes!
Head, shoulders, knees and toes,
Knees and toes!

And eyes, and ears, and mouth, and nose,
Head, shoulders, knees and toes,
Knees and toes!`
    },
    {
        id: 'itsy-bitsy-spider',
        title: 'Itsy Bitsy Spider',
        emoji: '🕷️',
        category: 'action-rhyme',
        ageGroup: '2-5',
        stars: 10,
        content: `The itsy bitsy spider
Climbed up the waterspout.
Down came the rain
And washed the spider out.

Out came the sun
And dried up all the rain,
And the itsy bitsy spider
Climbed up the spout again.`
    },
    {
        id: 'london-bridge',
        title: 'London Bridge Is Falling Down',
        emoji: '🌉',
        category: 'nursery-rhyme',
        ageGroup: '2-5',
        stars: 10,
        content: `London Bridge is falling down,
Falling down, falling down.
London Bridge is falling down,
My fair lady.

Build it up with iron bars,
Iron bars, iron bars.
Build it up with iron bars,
My fair lady.`
    },
    {
        id: 'hickory-dickory',
        title: 'Hickory Dickory Dock',
        emoji: '🐭',
        category: 'counting-rhyme',
        ageGroup: '2-5',
        stars: 10,
        content: `Hickory, dickory, dock,
The mouse ran up the clock.
The clock struck one,
The mouse ran down,
Hickory, dickory, dock.

Hickory, dickory, dock,
The mouse ran up the clock.
The clock struck two,
The mouse said "Boo!"
Hickory, dickory, dock.`
    },
    {
        id: 'hey-diddle-diddle',
        title: 'Hey Diddle Diddle',
        emoji: '🌙',
        category: 'nursery-rhyme',
        ageGroup: '2-5',
        stars: 10,
        content: `Hey diddle diddle,
The cat and the fiddle,
The cow jumped over the moon.
The little dog laughed
To see such sport,
And the dish ran away with the spoon.`
    },
    {
        id: 'little-bo-peep',
        title: 'Little Bo Peep',
        emoji: '🐑',
        category: 'nursery-rhyme',
        ageGroup: '2-5',
        stars: 10,
        content: `Little Bo Peep has lost her sheep
And doesn't know where to find them.
Leave them alone,
And they'll come home,
Wagging their tails behind them.`
    },
    {
        id: 'rain-rain-go-away',
        title: 'Rain, Rain, Go Away',
        emoji: '🌧️',
        category: 'nursery-rhyme',
        ageGroup: '2-4',
        stars: 10,
        content: `Rain, rain, go away,
Come again another day.
Little Johnny wants to play,
Rain, rain, go away.

Rain, rain, go away,
Come again another day.
All the children want to play,
Rain, rain, go away.`
    },
    {
        id: 'pat-a-cake',
        title: 'Pat-a-Cake',
        emoji: '🎂',
        category: 'action-rhyme',
        ageGroup: '2-4',
        stars: 15,
        content: `Pat-a-cake, pat-a-cake, baker's man,
Bake me a cake as fast as you can.
Pat it, and prick it, and mark it with B,
And put it in the oven for baby and me!

Pat-a-cake, pat-a-cake, baker's man,
Bake me a cake as fast as you can.
Roll it up, roll it up,
And throw it in a pan!
Pat-a-cake, pat-a-cake, baker's man.`
    },
];

export const stories: Story[] = [
    {
        id: 'three-little-pigs',
        title: 'The Three Little Pigs',
        emoji: '🐷',
        category: 'fairy-tale',
        ageGroup: '3-7',
        stars: 25,
        moral: 'Hard work and perseverance pay off in the end.',
        pages: [
            'Once upon a time, there were three little pigs who left home to build their own houses. Their mother told them, "Whatever you do, build your houses strong!"',
            'The first little pig was lazy. He quickly built his house out of straw. "This will do!" he said, and went off to play.',
            'The second little pig built his house out of sticks. It took a bit longer, but he was happy with it. "Good enough!" he said.',
            'The third little pig worked very hard. He built his house out of bricks, one by one. It took a long time, but it was very strong.',
            'Then came the Big Bad Wolf! He went to the straw house and said, "Little pig, little pig, let me come in!" "Not by the hair on my chinny chin chin!" said the pig.',
            '"Then I\'ll huff, and I\'ll puff, and I\'ll blow your house in!" And he did! The first pig ran to his brother\'s stick house.',
            'The wolf came to the stick house. "Little pigs, little pigs, let me come in!" "Not by the hair on our chinny chin chins!" And the wolf blew that house down too!',
            'Both pigs ran to the brick house. The wolf huffed and puffed, but he could NOT blow the brick house down! He tried and tried until he was blue in the face.',
            'The wolf tried to come down the chimney, but the clever third pig had a pot of boiling water waiting! The wolf yelped and ran away, never to return. The three pigs lived happily ever after! 🎉',
        ],
    },
    {
        id: 'tortoise-and-hare',
        title: 'The Tortoise and the Hare',
        emoji: '🐢',
        category: 'fable',
        ageGroup: '3-7',
        stars: 25,
        moral: 'Slow and steady wins the race!',
        pages: [
            'Once upon a time, there was a very fast hare who loved to boast. "I am the fastest animal in the whole forest!" he would say every day.',
            'A quiet little tortoise heard this and said, "I\'ll race you." Everyone laughed! A tortoise racing a hare? How silly!',
            'The race began. The hare zoomed ahead so fast that the tortoise was just a tiny dot behind him. "This is too easy!" laughed the hare.',
            '"I\'m so far ahead, I\'ll take a little nap under this tree," said the hare, yawning. And he fell fast asleep.',
            'Meanwhile, the tortoise kept walking. Step by step, slowly but surely. He never stopped, not even once.',
            'When the hare finally woke up, he saw the tortoise was almost at the finish line! He ran as fast as he could, but it was too late.',
            'The tortoise crossed the finish line first! Everyone cheered! The hare learned an important lesson that day: slow and steady wins the race! 🏆',
        ],
    },
    {
        id: 'goldilocks',
        title: 'Goldilocks and the Three Bears',
        emoji: '🐻',
        category: 'fairy-tale',
        ageGroup: '3-7',
        stars: 25,
        moral: 'Always respect other people\'s belongings and property.',
        pages: [
            'Once upon a time, there were three bears who lived in a cozy cottage in the woods — Papa Bear, Mama Bear, and Baby Bear.',
            'One morning, they made porridge for breakfast. "It\'s too hot!" said Mama Bear. "Let\'s go for a walk while it cools down."',
            'While they were out, a little girl named Goldilocks came to their house. She knocked, but no one answered. So she walked right in!',
            'She tasted Papa Bear\'s porridge — "Too hot!" She tasted Mama Bear\'s porridge — "Too cold!" She tasted Baby Bear\'s porridge — "Just right!" And she ate it all up!',
            'Then she sat in Papa Bear\'s chair — "Too hard!" Mama Bear\'s chair — "Too soft!" Baby Bear\'s chair — "Just right!" But she sat so hard that it broke!',
            'Goldilocks was sleepy. She tried Papa Bear\'s bed — "Too hard!" Mama Bear\'s bed — "Too soft!" Baby Bear\'s bed — "Just right!" And she fell fast asleep.',
            'When the bears came home, Baby Bear cried, "Someone\'s been eating my porridge, sitting in my chair, and... someone\'s sleeping in my bed!"',
            'Goldilocks woke up, saw three bears staring at her, and jumped out the window! She ran all the way home and never visited the bears\' house again. She learned to always ask before using things that aren\'t hers! 🏠',
        ],
    },
    {
        id: 'ugly-duckling',
        title: 'The Ugly Duckling',
        emoji: '🦢',
        category: 'fairy-tale',
        ageGroup: '4-8',
        stars: 30,
        moral: 'True beauty comes from within, and everyone is special in their own way.',
        pages: [
            'On a beautiful summer day, a mother duck sat on her eggs, waiting for them to hatch. One by one, adorable yellow ducklings popped out!',
            'But the last egg was bigger than the rest. When it hatched, out came a duckling that looked different — grey, clumsy, and not like the others at all.',
            '"What an ugly duckling!" said the other animals. The poor duckling was so sad. Nobody wanted to play with him.',
            'The ugly duckling decided to run away. He wandered through cold fields and harsh winters, always feeling alone and different.',
            'Spring came at last. The duckling found a beautiful lake. He saw his reflection in the water and gasped — he wasn\'t an ugly duckling anymore!',
            'He had grown into a beautiful, graceful swan! The most magnificent swan on the whole lake. Other swans came to admire him.',
            'The once ugly duckling was now the most beautiful of them all. He learned that sometimes you just need time to become who you\'re meant to be! ✨',
        ],
    },
    {
        id: 'little-red-riding-hood',
        title: 'Little Red Riding Hood',
        emoji: '🧒',
        category: 'fairy-tale',
        ageGroup: '4-8',
        stars: 30,
        moral: 'Always listen to your parents and be careful with strangers.',
        pages: [
            'Once upon a time, a sweet little girl always wore a red riding hood. Everyone called her Little Red Riding Hood.',
            '"Take this basket of goodies to Grandma\'s house," said her mother. "And remember, stay on the path and don\'t talk to strangers!"',
            'In the forest, a sly wolf stopped her. "Where are you going, little girl?" Red Riding Hood told him about Grandma\'s house.',
            'The wolf ran ahead and got to Grandma\'s house first! He tricked Grandma and dressed up in her clothes, getting into her bed.',
            'When Red Riding Hood arrived, something seemed different. "Grandma, what big eyes you have!" "All the better to see you with, my dear!"',
            '"Grandma, what big ears you have!" "All the better to hear you with!" "Grandma, what big teeth you have!" "All the better to eat you with!"',
            'Just then, a brave woodcutter heard the commotion and came to save the day! He chased the wolf far away into the forest.',
            'Grandma was safe, and Red Riding Hood learned an important lesson: always listen to your parents and never talk to strangers! 🌲',
        ],
    },
];

export const songs: Song[] = [
    {
        id: 'old-macdonald',
        title: 'Old MacDonald Had a Farm',
        emoji: '🐄',
        category: 'classic',
        stars: 15,
        lyrics: [
            '🐄 Old MacDonald had a farm, E-I-E-I-O!',
            'And on his farm he had a cow, E-I-E-I-O!',
            'With a "moo moo" here and a "moo moo" there,',
            'Here a "moo," there a "moo," everywhere a "moo moo!"',
            'Old MacDonald had a farm, E-I-E-I-O!',
            '',
            '🐷 Old MacDonald had a farm, E-I-E-I-O!',
            'And on his farm he had a pig, E-I-E-I-O!',
            'With an "oink oink" here and an "oink oink" there,',
            'Here an "oink," there an "oink," everywhere an "oink oink!"',
            'Old MacDonald had a farm, E-I-E-I-O!',
            '',
            '🐔 Old MacDonald had a farm, E-I-E-I-O!',
            'And on his farm he had a chicken, E-I-E-I-O!',
            'With a "cluck cluck" here and a "cluck cluck" there,',
            'Here a "cluck," there a "cluck," everywhere a "cluck cluck!"',
            'Old MacDonald had a farm, E-I-E-I-O! 🎵',
        ],
    },
    {
        id: 'wheels-on-bus',
        title: 'The Wheels on the Bus',
        emoji: '🚌',
        category: 'action-song',
        stars: 15,
        lyrics: [
            '🚌 The wheels on the bus go round and round,',
            'Round and round, round and round.',
            'The wheels on the bus go round and round,',
            'All through the town!',
            '',
            '🚪 The doors on the bus go open and shut,',
            'Open and shut, open and shut.',
            'The doors on the bus go open and shut,',
            'All through the town!',
            '',
            '👶 The babies on the bus go "Wah, wah, wah!"',
            '"Wah, wah, wah!" "Wah, wah, wah!"',
            'The babies on the bus go "Wah, wah, wah!"',
            'All through the town!',
            '',
            '🤫 The mommies on the bus go "Shh, shh, shh!"',
            '"Shh, shh, shh!" "Shh, shh, shh!"',
            'The mommies on the bus go "Shh, shh, shh!"',
            'All through the town! 🎶',
        ],
    },
    {
        id: 'abc-song',
        title: 'The ABC Song',
        emoji: '🔤',
        category: 'educational',
        stars: 20,
        lyrics: [
            'A B C D E F G,',
            'H I J K L M N O P,',
            'Q R S, T U V,',
            'W X, Y and Z.',
            '',
            'Now I know my ABCs,',
            'Next time won\'t you sing with me? 🎵',
            '',
            'A B C D E F G,',
            'H I J K L M N O P,',
            'Q R S, T U V,',
            'W X, Y and Z.',
            '',
            '26 letters from A to Z,',
            'Now I\'ve sung my ABCs! 🌟',
        ],
    },
    {
        id: 'if-youre-happy',
        title: 'If You\'re Happy and You Know It',
        emoji: '😊',
        category: 'action-song',
        stars: 15,
        lyrics: [
            '👏 If you\'re happy and you know it, clap your hands!',
            'If you\'re happy and you know it, clap your hands!',
            'If you\'re happy and you know it,',
            'And you really want to show it,',
            'If you\'re happy and you know it, clap your hands!',
            '',
            '🦶 If you\'re happy and you know it, stomp your feet!',
            'If you\'re happy and you know it, stomp your feet!',
            'If you\'re happy and you know it,',
            'And you really want to show it,',
            'If you\'re happy and you know it, stomp your feet!',
            '',
            '🎉 If you\'re happy and you know it, shout "Hooray!"',
            'If you\'re happy and you know it, shout "Hooray!"',
            'If you\'re happy and you know it,',
            'And you really want to show it,',
            'If you\'re happy and you know it, shout "Hooray!" 🌈',
        ],
    },
    {
        id: 'row-your-boat',
        title: 'Row, Row, Row Your Boat',
        emoji: '🚣',
        category: 'classic',
        stars: 10,
        lyrics: [
            '🚣 Row, row, row your boat,',
            'Gently down the stream.',
            'Merrily, merrily, merrily, merrily,',
            'Life is but a dream.',
            '',
            '🐊 Row, row, row your boat,',
            'Gently down the stream.',
            'If you see a crocodile,',
            'Don\'t forget to scream! AHHH! 😱',
            '',
            '🦁 Row, row, row your boat,',
            'Gently to the shore.',
            'If you see a lion there,',
            'Don\'t forget to roar! ROAR! 🦁',
        ],
    },
];

export const wordGameWords = [
    { word: 'CAT', emoji: '🐱', hint: 'A furry pet that says meow' },
    { word: 'DOG', emoji: '🐶', hint: 'A loyal pet that says woof' },
    { word: 'SUN', emoji: '☀️', hint: 'It shines bright in the sky' },
    { word: 'STAR', emoji: '⭐', hint: 'Twinkle twinkle little ...' },
    { word: 'MOON', emoji: '🌙', hint: 'It comes out at night' },
    { word: 'FISH', emoji: '🐟', hint: 'It swims in the water' },
    { word: 'BIRD', emoji: '🐦', hint: 'It flies in the sky' },
    { word: 'TREE', emoji: '🌳', hint: 'It has leaves and branches' },
    { word: 'FROG', emoji: '🐸', hint: 'A green animal that goes ribbit' },
    { word: 'CAKE', emoji: '🎂', hint: 'You eat it on your birthday' },
    { word: 'RAIN', emoji: '🌧️', hint: 'Water falling from clouds' },
    { word: 'BOOK', emoji: '📚', hint: 'You read stories in this' },
    { word: 'BEAR', emoji: '🐻', hint: 'A big furry animal' },
    { word: 'DUCK', emoji: '🦆', hint: 'It says quack quack' },
    { word: 'LION', emoji: '🦁', hint: 'The king of the jungle' },
    { word: 'BALL', emoji: '⚽', hint: 'Round toy you can kick' },
    { word: 'BELL', emoji: '🔔', hint: 'It makes a ringing sound' },
    { word: 'SHIP', emoji: '🚢', hint: 'A big boat on the sea' },
    { word: 'ROSE', emoji: '🌹', hint: 'A beautiful red flower' },
    { word: 'SNOW', emoji: '❄️', hint: 'White and cold, falls in winter' },
];
