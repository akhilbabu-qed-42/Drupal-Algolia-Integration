const searchClient = algoliasearch('YOUR APPLICATION ID', 'YOUR SEARCH ONLY API KEY');
const { connectHits } = instantsearch.connectors;
// Initialize the search.
const search = instantsearch({
  indexName: 'demo_umami',
  searchClient: searchClient,
});




// Create the render function for the hits widget.
const renderHits = (renderOptions, isFirstRender) => {
  const { hits, widgetParams } = renderOptions;
  // Define the HTML structure of the widget. This is copied from the HTML structure of
  // cards in umami template.
  widgetParams.container.innerHTML = `
   <div class="grid--2">
     <div class="view-content">
       ${hits
      .map(
        item =>
          `<div class="views-row">
             <article class="umami-card">
               <div class="umami-card__wrapper">
                 <h2 class="umami-card__title">
                   <span>${instantsearch.highlight({ attribute: 'title', hit: item })}</span>
                 </h2>
                 <div class="umami-card__content">
                   <div class="field field--name-field-media-image">
                     <article class="media media--type-image media--view-mode-responsive-3x2">
                       <div class="field--name-field-media-image">
                         <img loading="lazy" src="${item.image_url}" />
                       </div>
                     </article>
                   </div>
                   <div class="umami-card__label-items field--label-inline">
                    <div class="field__item">${instantsearch.snippet({ attribute: 'aggregated_text_field', hit: item }) }</div>
                   </div>
                 </div>
                 <a class="umami-card__read-more" href="${item.page_url}">
                   ${Drupal.t('Read more')}
                 </a>
               </div>
             </article>
           </div>`
      )
      .join('')}
     </div>
   </div>
 `;
};


// Create the custom widget.
const customHits = connectHits(renderHits);


// Instantiate the custom hits widget.
search.addWidgets([
  customHits({
    container: document.querySelector('#hits'),
  }),

  // The search box widget with Umami specific classes.
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    cssClasses: {
      root: 'search-form',
      form: 'form-wrapper',
      input: 'form-search',
      submit: 'hidden',
      reset: 'hidden'
    },
  }),

  // Filter the results based on current language.
  instantsearch.widgets.configure({
    filters: 'search_api_language:' + drupalSettings.path.currentLanguage
  })
]);


search.start();
