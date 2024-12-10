const DEV = false;
const backendUrl = DEV ? "http://localhost:8000" : "https://api.emurpg.com";

const config = {
  backendUrl: backendUrl,
  DISCORD_LINK: "https://discord.gg/QFynV24URr",
  WHATSAPP_LINK: "https://chat.whatsapp.com/IMoi88nhVWDDU5lS65dgLL",
  INSTAGRAM_LINK: "https://www.instagram.com/emurpgclub/",
  LINKEDIN_LINK: "https://www.linkedin.com/company/emu-rpg-club/",
  FOOTER_TEXT: "© 2024 EMU RPG Club. All rights reserved.",
  FOOTER_ICON_SIZE: 18,
};

const rpgQuotes = [
  // D&D and Fantasy References
  "You rolled a 17! By Moradin's beard, not bad at all!",
  "Natural 1... The bard's attempt to seduce the door fails miserably.",
  "You rolled a 15! The rogue successfully steals everything not nailed down.",
  "You rolled a 3... Time to split the party! What could go wrong?",
  "Natural 20! The paladin's disapproving stare pierces your very soul.",

  // Lord of the Rings References
  "You rolled a 12! One does not simply walk into better rolls.",
  "Natural 20! And my axe finds its mark perfectly!",
  "You rolled an 18! A wizard rolls precisely when he means to.",
  "You rolled a 2... Not all who wander are lost, but you definitely are.",
  "Natural 1... The eagles would have been useful right about now.",

  // Star Wars References
  "You rolled a 16! These aren't the dice you're looking for...",
  "Natural 20! Never tell me the odds - I just beat them!",
  "You rolled a 4... I find your lack of luck disturbing.",
  "You rolled a 19! Do or do not, there was no try needed here!",
  "Natural 1... I've got a bad feeling about this roll.",

  // Marvel References
  "You rolled a 14! I can do this all day, sometimes successfully.",
  "Natural 20! I am inevitable... and incredibly lucky!",
  "You rolled a 7... Mr. Stark, I don't feel so good about this roll.",
  "You rolled an 18! Wakanda rolls forever!",
  "Natural 1... Hulk SMASHED the wrong target.",

  // Game of Thrones References
  "You rolled a 3... Winter isn't the only thing coming - failure is too.",
  "Natural 20! A Lannister always crits their rolls.",
  "You rolled an 8... You know nothing about rolling well, Jon Snow.",
  "You rolled a 13! The North remembers... but you might want to forget this roll.",
  "Natural 1... Dracarys! Your character sheet bursts into flames.",

  // Video Game References
  "You rolled a 15! Hey you, you're finally rolling decently.",
  "Natural 20! The cake may be a lie, but this roll is the truth!",
  "You rolled a 6... War. War never changes, but these bad rolls might.",
  "You rolled a 17! It's dangerous to roll alone, take this success!",
  "Natural 1... Snake? SNAKE? SNAAAAKE! Mission failed.",

  // Anime References
  "You rolled a 19! This isn't even my final form's roll!",
  "Natural 20! BELIEVE IT! The power of friendship prevails!",
  "You rolled an 11... NANI?! This roll is not as expected!",
  "You rolled a 16! Your roll level is over 9000!",
  "Natural 1... Top 10 anime betrayals: by your own dice.",

  // Harry Potter References
  "You rolled a 18! Wingardium Leviosa these dice into success!",
  "Natural 20! After all this time? Always rolling perfectly.",
  "You rolled a 5... Not Slytherin material with that roll.",
  "You rolled a 12! 10 points to your house for trying!",
  "Natural 1... Your wand has chosen... poorly.",

  // Doctor Who References
  "You rolled a 13! Wibbly wobbly, dicey wicey stuff.",
  "Natural 20! The dice are bigger on the inside!",
  "You rolled a 9... EXTERMINATE that terrible roll!",
  "You rolled a 14! Allons-y! Into acceptable roll territory!",
  "Natural 1... Delete your roll history.",

  // Monty Python References
  "You rolled a 16! Nobody expects the Spanish Roll-quisition!",
  "Natural 20! Tis but a scratch - actually, it's a perfect hit!",
  "You rolled a 7... I fart in your general direction of rolling.",
  "You rolled an 11! We are the knights who say... mediocre!",
  "Natural 1... Bring out your dead character sheet!",

  // The Witcher References
  "You rolled a 15! Hmm... wind's howling with potential.",
  "Natural 20! How about a round of perfect Gwent rolls?",
  "You rolled a 4... Medallion's humming, bad roll incoming.",
  "You rolled a 17! What now, you piece of excellent luck?",
  "Natural 1... Looks like rain... of tears.",

  // Critical Role References
  "You rolled a 19! How do you want to roll this success?",
  "Natural 20! Life needs things to crit for!",
  "You rolled a 6... You can certainly try... and fail.",
  "You rolled a 13! Is it Thursday yet? Your rolls say maybe.",
  "Natural 1... Don't forget to love each other, despite this roll.",

  // Miscellaneous Pop Culture
  "You rolled a 18! May the rolls be ever in your favor!",
  "Natural 20! To infinity and beyond these dice!",
  "You rolled a 8... Say my name... Heisenfail.",
  "You rolled a 14! Autobots, roll out... decently!",
  "Natural 1... That's what she... didn't want to roll.",

  // Gaming Humor
  "You rolled a 16! Loading success... complete!",
  "Natural 20! Achievement Unlocked: Perfect Roll!",
  "You rolled a 5... Roll has stopped working. Would you like to send a report?",
  "You rolled a 12! Press F to pay respects to this mediocre attempt.",
  "Natural 1... 404: Good Roll Not Found.",

  // Meta RPG Quotes
  "You rolled a 17! The real treasure was the dice we rolled along the way.",
  "Natural 20! Plot armor working as intended!",
  "You rolled a 3... That's what my character would fail at.",
  "You rolled a 15! Anyone need a healing roll of moderate success?",
  "Natural 1... TPK incoming... hope you have backup characters!",

  // Additional Fantasy & RPG References
  "You rolled a 13! The tavern keeper asks 'You guys gonna fight or what?'",
  "Natural 20! Rocks fall, everyone lives spectacularly!",
  "You rolled a 7... The mimic was not impressed by your investigation check.",
  "You rolled a 16! The dragon would like to negotiate... with slightly less fire.",
  "Natural 1... Your stealth check alerted every guard in a 500-mile radius.",

  // More Star Wars
  "You rolled a 14! The Force is moderately strong with this one.",
  "Natural 20! This is the way... to roll perfectly!",
  "You rolled a 6... I'm altering the roll, pray I don't alter it further.",
  "You rolled an 18! Size matters not, but this roll sure does!",
  "Natural 1... Somehow, Palpatine returned... with worse luck.",

  // Extra Marvel & DC
  "You rolled a 15! With great power comes great probability.",
  "Natural 20! I... am... Natural Twenty! *snap*",
  "You rolled an 8... Batman's contingency plan didn't account for this roll.",
  "You rolled a 17! It's clobberin' time! And it works pretty well!",
  "Natural 1... Looks like the multiverse of madness leaked into your roll.",

  // More Video Game References
  "You rolled a 12! A NEW HAND TOUCHES THE BEACON... of mediocrity.",
  "Natural 20! Hey, you're finally awake... and rolling perfectly!",
  "You rolled a 5... The cake is a lie, and so is your rolling ability.",
  "You rolled a 16! Would you kindly... roll a bit better next time?",
  "Natural 1... YOU DIED. Dark Souls style.",

  // Additional Anime References
  "You rolled a 19! PLUS ULTRA roll!",
  "Natural 20! By the power of the Scout Regiment, a perfect strike!",
  "You rolled a 3... Even Aqua rolls better than this.",
  "You rolled a 14! Consecutive Normal Rolls!",
  "Natural 1... This must be the work of an enemy Stand!",

  // Extra Sci-Fi References
  "You rolled a 18! Resistance is futile, but rolling well isn't!",
  "Natural 20! To boldly roll where no one has rolled before!",
  "You rolled a 7... The spice must flow... but the rolls don't.",
  "You rolled a 15! I aim to misbehave... with moderate success.",
  "Natural 1... In space, no one can hear you fail.",

  // More Fantasy Literature
  "You rolled a 16! The Wheel of Time turns, and rolls come and pass.",
  "Natural 20! A perfect roll is never late, it arrives precisely when it means to!",
  "You rolled a 4... The First Law of Rolling: avoid getting cut.",
  "You rolled a 13! The Name of the Wind... whispers 'meh'.",
  "Natural 1... Winter came, and so did failure.",

  // Additional Pop Culture
  "You rolled a 17! As you wish... and roll quite well!",
  "Natural 20! Here's looking at you, perfect roll.",
  "You rolled a 6... I see dead rolls.",
  "You rolled a 15! Life is like a box of dice, you never know what you'll roll.",
  "Natural 1... Hasta la vista, good roll.",

  // Classic RPG Video Games
  "You rolled a 14! *Final Fantasy victory theme plays hesitantly*",
  "Natural 20! A wild CRITICAL HIT appeared!",
  "You rolled a 5... You must gather your party before venturing forth... again.",
  "You rolled a 16! Do a barrel roll! It helps sometimes!",
  "Natural 1... All your base are belong to fails.",

  // Modern Gaming
  "You rolled a 18! GG EZ... until the next roll.",
  "Natural 20! No microtransactions needed for this roll!",
  "You rolled a 2... Time to ragequit rolling.",
  "You rolled a 13! The RNG gods are feeling lukewarm today.",
  "Natural 1... This is definitely a skill issue.",

  // Internet Culture
  "You rolled a 15! Task failed successfully... into decent territory.",
  "Natural 20! POG roll!",
  "You rolled a 8... This roll needs some milk.",
  "You rolled a 17! Rolling stonks!",
  "Natural 1... *Windows XP shutdown sound*",

  // More Meta RPG
  "You rolled a 16! When the min-maxer actually rolls decently.",
  "Natural 20! The forever DM smiles upon you.",
  "You rolled a 3... Roll for emotional damage.",
  "You rolled a 14! The rules lawyer finds this... acceptable.",
  "Natural 1... Looks like we need another session zero.",

  // Community References
  "You rolled a 18! Troy and Abed rolling diiiice!",
  "Natural 20! This is the darkest, yet most successful timeline.",
  "You rolled a 4... Cool. Cool cool cool... not really.",
  "You rolled a 15! Streets ahead of a bad roll!",
  "Natural 1... POP POP! Goes your chance of success.",

  // Additional Video Game Franchises
  "You rolled a 17! A Solid Snake of a roll!",
  "Natural 20! Praise the Sun AND the dice!",
  "You rolled a 6... Not enough minerals for a better roll.",
  "You rolled a 13! Wasted potential.",
  "Natural 1... FATALITY... on your hopes.",

  // More Anime References
  "You rolled a 16! Omae wa mou... succeeding!",
  "Natural 20! THIS ROLL HAS BEEN PASSED DOWN THE ARMSTRONG LINE FOR GENERATIONS!",
  "You rolled a 5... Even Truck-kun would avoid this roll.",
  "You rolled a 14! Yare yare daze... could be worse.",
  "Natural 1... Top 10 saddest anime dice betrayals.",

  // Steins Gate References
  "You rolled a 19! El Psy Kongroo!",
  "Natural 20! Tuturu! The perfect roll!",
  "You rolled a 3... The choice of Steins Gate.",
  "You rolled a 14! The Organization is pleased with this roll.",
  "Natural 1... You've triggered a world line shift.",
  "You rolled a 17! The Future Gadget Lab approves of this roll.",
  "Your roll is a 18! The Phone Microwave is a success!",
  "Natural 20! The perfect roll is a choice of Steins Gate.",

  // Extra Meta Gaming
  "You rolled a 18! The dice weren't weighted after all!",
  "Natural 20! Local dice surpass all expectations!",
  "You rolled a 7... Have you tried turning the dice off and on again?",
  "You rolled a 15! Task manager says this roll is responding.",
  "Natural 1... This isn't even my worst roll today.",

  // Additional Geek Culture
  "You rolled a 16! May the odds be ever in... oh wait, wrong franchise.",
  "Natural 20! Achievement Unlocked: Actually Rolling Well For Once",
  "You rolled a 4... Instructions unclear, dice stuck in ceiling fan.",
  "You rolled a 13! This roll is rated PG - Pretty Generic.",
  "Natural 1... Error 404: Success not found.",

  // Minecraft References
  "You rolled a 17! That's a nice roll you have there... it'd be a shame if something happened to it.",
  "Natural 20! The dice are enchanted with Unbreaking III!",
  "You rolled a 3... Creepers gonna creep, and rolls gonna fail.",
  "You rolled a 14! The roll is a lie... or is it?",
  "Natural 1... You died. Respawn or quit?",

  //What's This supposed to be?
  "2344443543://5434454445.1215/14Q524529W22X13Q, Good luck with that!",
];

export { config, rpgQuotes };
