// your journal - everything on the site is built from these two lists


// entries ( newest or oldest first , the site sorts them by date )
//
// {
//     id      : 'first-entry',                    // used in the link : post.html?id=first-entry
//     title   : 'The title of the entry',
//     date    : '2026-11-07',                     // year - month - day
//     sub     : 'one line under the title',       // optional
//     excerpt : 'a short preview for the index',  // optional , otherwise the first sentence is used
//     body    : `
//         <p class="lead">The first paragraph , gets the big first letter.</p>
//         <h3>A chapter</h3>
//         <p>Normal text. <em>italic</em> , <mark>marker</mark>.</p>
//         <p data-note="a note in the margin">A paragraph with a side note.</p>
//         <blockquote>A big quote.</blockquote>
//     `,
// },

const ENTRIES = [

    {
        id    : 'the-painter',
        title : 'The painter doesn’t match the painting',
        date  : '2026-11-07',
        sub   : 'On the art, the artist, and why you don’t have to be finished to start.',
        body  : `
            <p class="lead">Human beings have this desperate need for the person who creates something beautiful to be beautiful themselves. People rarely separate the art from the artist. Human beings want the painter to match the painting, and the writer to embody the wisdom they put on the page. But history proves otherwise.</p>

            <h3>Caravaggio</h3>

            <p>Take Caravaggio. Caravaggio fundamentally changed what light and shadow could do in a painting. His work carries an emotional violence that still stops people in galleries four centuries later. However, he was also a murderer. He killed a man and spent his last years as a fugitive.</p>

            <h3>Dostoevsky</h3>

            <p>Dostoevsky is another perfect example. He wrote Crime and Punishment and The Brothers Karamazov, novels so psychologically deep that people are still using them to understand guilt and obsession, still using them to understand the architecture of self-destruction. And the man who spent his life dissecting the human mind was a fucking gambling addict. The same mind that mapped the interior landscape of guilt with surgical precision would sit down at a casino, lose everything, borrow money from his friends, lose that shit too, and then go home and write another three chapters about compulsion that would make psychiatrists weep. <mark>He could dissect the human mind on paper and couldn’t control his own hands when the wheel started spinning.</mark></p>

            <h3>The inverse mistake</h3>

            <p>I bring them up not because their talent redeems their character. It doesn’t. Talent has never redeemed character. I bring them up because people trapped in self-doubt make the inverse of the same mistake people make when they demand moral purity from artists. If you believe creation and character must be perfectly consistent, and you know your own character is flawed, then the conclusion writes itself: anything you produce must be contaminated by your imperfection. So you’d better wait until you’ve resolved every contradiction and healed every wound before you’re allowed to make something someone else might find valuable.</p>

            <blockquote>Talent has never redeemed <em>character</em>.</blockquote>

            <h3>Unfinished people</h3>

            <p>Except the people who made the things we still give a shit about weren’t finished people. They were fucked up. Absolutely fucked up. They were pieces of shit: addicts, cowards, assholes, hypocrites. Sometimes genuinely terrible human beings who somehow still made things nobody else could have made. And we’re sitting here waiting for some future version of ourselves that has it all figured out before we allow ourselves to start. <mark>That version is never coming.</mark> It has never come for anyone. If you keep waiting until you’re finally worthy of making something, you can spend your entire life waiting for a person who was never going to exist. <mark>The only person who gets to make the thing is the man standing here right now, and that has always been enough to start.</mark></p>
        `,
    },

    {
        id    : 'self-hate',
        title : 'Self-hate',
        date  : '2026-11-07',
        sub   : 'On the engine that got me here, and the finish line that kept moving.',
        body  : `
            <p class="lead">I don’t know if I would have gotten as far as I did without hating myself. I just didn’t realize how much of myself I was destroying in the process.</p>

            <h3>A terrible engine</h3>

            <p>Self-hatred was all I had. When you grow up without any real foundation of self-love, self-hatred becomes the engine. You hate yourself enough to keep trying to outrun the person you believe you are. And yes, it’s a terrible engine. It runs on the worst fuel imaginable, and it poisons everything it produces. But when it’s the only voice that’s ever pushed you forward, you start believing that without it you’d have no reason to move at all.</p>

            <blockquote>It runs on the worst fuel imaginable, and it poisons <em>everything</em> it produces.</blockquote>

            <h3>The finish line</h3>

            <p>I spent years believing that punishing myself was the path to redemption. That if I just suffered long enough, eventually I’d come out the other side as someone I could finally accept. But every time I got close to the person I thought I needed to become, my brain moved the finish line further back, and then I realized <mark>the race was designed to never end.</mark> Because if your ability to love yourself depends entirely on becoming the person you imagine you should be, you’ll spend your entire life withholding that love from the person who actually exists.</p>

            <p>Whenever something good came close enough to actually make me happy, my brain would just say: no, go fuck yourself. Happiness was something you had to purchase with enough pain, and I never had enough. Would you look at someone you love and tell them they don’t deserve to be happy because they haven’t suffered enough? You wouldn’t. You’d never fucking say that to them. But you’ll say it to yourself every day and not even notice you’re doing it, because the cruelty became so normal it started sounding like common sense.</p>

            <h3>Just love yourself</h3>

            <p>And then someone tells you, “Oh, just love yourself.” If you spent your whole life being punished for your mistakes, where exactly are you supposed to learn how to forgive yourself? If nobody ever taught you that you could be hurting and still deserve kindness, why would you suddenly know how to give it to yourself? You can’t love yourself out of self-hatred when self-hatred is the only relationship with yourself you’ve ever known. <mark>That capacity was never built.</mark></p>

            <h3>Some days</h3>

            <p>Most of my life looked like that war, and I was never suddenly healed or anything. I just started noticing when my own mind crossed from holding me accountable into tearing me apart. And over time, <mark>the days that used to be most days started to become some days.</mark> I still have self-hatred, and some days it still wins. But I stopped waiting to become someone worth caring about before I allowed myself to stop suffering. I spent years withholding acceptance from the person I was, because I believed it belonged to the person I would become. And I never understood that the person I would become had to be built by the person I refused to accept.</p>
        `,
    },

]


// margins ( sticky notes )
//
// { date : '2026-11-07', text : 'A short thought.' },

const MARGINS = [
]
