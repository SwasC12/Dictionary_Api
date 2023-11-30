function lookupWord(type) {
  const form = document.getElementById("lookup-form");
  form.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(event.target);
      const word = data.get("word");

      const options = {
          method: 'GET',
      };

      document.getElementById('results').innerHTML = `<p>Searching for <em>${word}</em>...</p>`;

      const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
      
      fetch(apiUrl, options)
          .then(response => response.json())
          .then(data => {
              const wordData = {
                  word: data[0].word,
                  phonetic: data[0].phonetic,
                  meanings: [],
                  audioLink: data[0].phonetics[0] ? data[0].phonetics[0].audio : null
              };

              data[0].meanings.forEach(meaning => {
                  const meaningData = {
                      partOfSpeech: meaning.partOfSpeech,
                      definitions: meaning.definitions,
                      examples: meaning.examples
                  };

                  // Extract synonyms or antonyms depending on the type
                  if (type === 'synonyms' && meaning.synonyms) {
                      meaningData.synonyms = Array.from(new Set(meaning.synonyms)); // Remove duplicates
                  } else if (type === 'antonyms' && meaning.antonyms) {
                      meaningData.antonyms = Array.from(new Set(meaning.antonyms)); // Remove duplicates
                  }

                  wordData.meanings.push(meaningData);
              });

              const template = document.getElementById('results-template').innerHTML;
              const compiledFunction = Handlebars.compile(template);
              document.getElementById('results').innerHTML = compiledFunction(wordData);
          });
  });
}

function synonymFunc() {
  const form = document.getElementById("synonym-form");
  form.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(event.target);
      const word = data.get("word");

      const options = {
          method: 'GET',
      };

      document.getElementById('synonym-result').innerHTML = `<p>Searching for <em>${word}</em>...</p>`;

      const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
      
      fetch(apiUrl, options)
          .then(response => response.json())
          .then(data => {
            data = {
              word: data[0].word,
//              phonetic: data[0].phonetic,
              meanings: data[0].meanings,
//              partOfSpeech: data[0].meanings[0].partOfSpeech,
//              definitions: data[0].meanings[0].definitions,
//              audio: data[0].phonetics[0].audio,
              synonyms: data[0].meanings[0].synonyms

          };
                console.log(data);
              const template = document.getElementById('sr-template').innerHTML;
              const compiledFunction = Handlebars.compile(template);
              document.getElementById('synonym-result').innerHTML = compiledFunction(data);
          });
  });;
}



function antonymFunc() {
  const form = document.getElementById("antonym-form");
  form.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(event.target);
      const word = data.get("word");

      const options = {
          method: 'GET',
      };

      document.getElementById('antonym-result').innerHTML = `<p>Searching for <em>${word}</em>...</p>`;

      const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

      fetch(apiUrl, options)
          .then(response => response.json())
          .then(data => {
            data = {
              word: data[0].word,
              meanings: data[0].meanings,

              antonyms: data[0].meanings[1].antonyms

          };
                console.log(data);
              const template = document.getElementById('ar-template').innerHTML;
              const compiledFunction = Handlebars.compile(template);
              document.getElementById('antonym-result').innerHTML = compiledFunction(data);
          });
  });;
}





// tag::router[]
window.addEventListener('load', () => {
const app = $('#app');

const defaultTemplate = Handlebars.compile($('#default-template').html());
const dictionaryTemplate = Handlebars.compile($('#dictionary-template').html());
const synonymTemplate = Handlebars.compile($('#synonym-template').html());
const antonymTemplate = Handlebars.compile($('#antonym-template').html());
const thesaurusTemplate = Handlebars.compile($('#thesaurus-template').html());

const router = new Router({
  mode:'hash',
  root:'index.html',
  page404: (path) => {
    const html = defaultTemplate();
    app.html(html);
  }
});

router.add('/dictionary', async () => {
  html = dictionaryTemplate();
  app.html(html);
  lookupWord();
});

router.add('/synonym', async () => {
  html = synonymTemplate();
  app.html(html);
  synonymFunc();
});

router.add('/antonym', async () => {
  html = antonymTemplate();
  app.html(html);
  antonymFunc();
});

router.add('/thesaurus', async () => {
  html = thesaurusTemplate();
  app.html(html);
});

router.addUriListener();

$('a').on('click', (event) => {
  event.preventDefault();
  const target = $(event.target);
  const href = target.attr('href');
  const path = href.substring(href.lastIndexOf('/'));
  router.navigateTo(path);
});

router.navigateTo('/');
});
// end::router[]