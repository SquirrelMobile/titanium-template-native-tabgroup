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

function handleClick(e) {
  var obj = {
    controller: "win",
    data: {
      controller: "partials/_detail",
      navbar: {
        btnLeft: {
          visible: true
        },
        logo: {
          visible: false
        },
        title: {
          visible: true,
          text: e.title
        }
      },
      data: e
    }
  };
  Alloy.Globals.events.trigger("openWindowInTab", obj);
}

var urlExample =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
function headerClick(e) {
  if (e.source.id === "btnPdf") {
    Alloy.Globals.loading.show();
    var client = Ti.Network.createHTTPClient({
      onload: function(e) {
        var f = Ti.Filesystem.getFile(
          Ti.Filesystem.applicationDataDirectory,
          "file.pdf"
        );
        f.write(this.responseData);
        if (OS_IOS) {
          var docViewer = Ti.UI.iOS.createDocumentViewer({ url: f.nativePath });
          docViewer.show();
        } else {
          var win = $.UI.create("Window");
          var pdfView = require("fr.squirrel.pdfview").createView({
            height: Ti.UI.FILL,
            width: Ti.UI.FILL,
            file: f
          });
          win.add(pdfView);
          win.open();
        }

        Alloy.Globals.loading.hide();
      },
      onerror: function(e) {
        Alloy.Globals.loading.hide();
      }
    });
    client.open("GET", urlExample);
    client.send();
  }
}
