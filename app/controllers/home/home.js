/**
 * @class Controller.home
 * Display home view
 *
 */
import { Photo } from "classes/photos";
/**
 * @method Controller
 * Display home view, load home
 * @param  {Arguments} args Arguments passed to the controller
 */
(function constructor(args) {
  load();
})($.args);

function load() {
  Alloy.Globals.Api.photos({}, function(response) {
    var items = _.chain(response)
      .sortBy(function(obj) {
        return obj.id;
      })
      .map(function(obj) {
        var photo = new Photo(obj);
        return {
          properties: photo,
          template: "photo",
          title: {
            text: photo.title
          },
          image: {
            image: photo.thumbnailUrl
          }
        };
      })
      .value();

    $.list.load([Ti.UI.createListSection({ items: items })]);
  });
}

function handleClick(e) {}
