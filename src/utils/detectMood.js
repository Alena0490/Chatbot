export const detectMood = (message) => {
  const text = message.toLowerCase();

  // PARTY - oslava, nadšení, úspěch
  const partyKeywords = [
    'hurá', 'oslav', 'gratuluj', 'výhra', 'povedlo',
    'úspěch', 'bomba', '🎉', '🎊', '🥳', 
    'přesně', 'geniáln', 'konečně', 'joo', 'perfektní', 'skvělé'
  ];
  if (partyKeywords.some(word => text.includes(word))) {
    return 'party';
  }

   // LAUGH - smích, vtip, zábava
  const laughKeywords = [
    'haha', 'ha ha', 'hehe', 'hihi', 'lol', 'vtip', 'legrace', 
     'směšné', 'legrační', 'sranda', 'vtipné',
    '😂', '🤣', '😄', '😆', 'rofl', 'vtipálek'
  ];
  if (laughKeywords.some(word => text.includes(word))) {
    return 'laugh';
  }
  
  // SAD - omluvy, chyby, smutek
  const sadKeywords = [
    'omlouv', 'bohužel', 'chyba', 'promiň', 
    'lituj', 'škoda', 'nestihl', 'mrzí'
  ];
  if (sadKeywords.some(word => text.includes(word))) {
    return 'sad';
  }
  
  // LOVE - pomoc, podpora, láska
  const loveKeywords = [
    'pomohu', 'rád', 'rád ti', 'pomůžu', 'skvělé', 'výborně', 
    'super', 'fantastické', 'miluji', '❤️', '💕', 'potěšení', 'lask'
    // ← PŘIDEJTE DALŠÍ!
  ];
  if (loveKeywords.some(word => text.includes(word))) {
    return 'love';
  }
  
  // THINKING - vysvětlování, analýza
  const thinkingKeywords = [
    'protože', 'proto', 'funguje', 'znamená', 'vysvětl', 
    'jak to', 'důvod', 'záleží', 'závisí', 'mechanismus', 
    'proces', 'principu', 'způsob'
    // ← PŘIDEJTE DALŠÍ!
  ];
  if (thinkingKeywords.some(word => text.includes(word))) {
    return 'thinking';
  }

   // ANGRY - zlost, frustrace, silné negativní emoce
  const angryKeywords = [
    'sakra', 'do háje', 'fuj', 'hnusné', 'hrozné', 
    'strašné', 'mizerné', 'katastrofa', 'proboha',
    'nesmysl', 'blbost', 'frustruji', 'šílím', 
    'štve', '😠', '😡', '🤬', '💢'
  ];
  if (angryKeywords.some(word => text.includes(word))) {
    return 'angry';
  }
  
  // SURPRISED - překvapení, objevy
  const surprisedKeywords = [
    'wow', 'zajímavé', 'vidím', 'aha', 'našel', 'objevil',
    'neuvěřitelné', 'překvap', 'fakt', 'vážně', 'no tohle'
    // ← PŘIDEJTE DALŠÍ!
  ];
  if (surprisedKeywords.some(word => text.includes(word))) {
    return 'surprised';
  }
  
  // COOL - instrukce, návody, akce
  const coolKeywords = [
    'zkus', 'udělej', 'klikni', 'otevři', 'přidej', 'změň', 
    'napiš', 'stiskni', 'vyber', 'najdi', 'spusť', 'vytvoř'
    // ← PŘIDEJTE DALŠÍ!
  ];
  if (coolKeywords.some(word => text.includes(word))) {
    return 'cool';
  }

  // SLEEPY - klid, odpočinek, únava
  const sleepyKeywords = [
    'unav', 'spánek', 'odpočin', 'klidně', 'pomalu',
    'časem', 'počkej', 'trpělivost', 'relax', 'pauza',
    'chvíli', 'moment', 'vydechnout', 'pomaličku'
  ];
  if (sleepyKeywords.some(word => text.includes(word))) {
    return 'sleepy';
  }
  
  // BASIC - výchozí
  return 'basic';
};