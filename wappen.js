var center = [49.8884121, 10.8917493];
var mymap = L.map("map_field").setView(center, 14);

// var lc = L.control.locate().addTo(mymap)
// lc.start();
 
L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidW5pLWJhbWJlcmciLCJhIjoiY2ppYm1qYjM5MDgxZDNxcXJ6ajQ2cjl6eCJ9.w78AARbUih9yt6_IAYuKFg", 
  {
    maxZoom: 21,
    minZoom: 14,
    attribution: 
      'Map data &copy; ' +
      '<a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © ' +
      '<a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox.light",
    accessToken: "pk.eyJ1IjoidW5pLWJhbWJlcmciLCJhIjoiY2ppYm1qYjM5MDgxZDNxcXJ6ajQ2cjl6eCJ9.w78AARbUih9yt6_IAYuKFg"
}).addTo(mymap);


/**
mapbox.streets
mapbox.light
mapbox.dark
mapbox.satellite
mapbox.streets-satellite
mapbox.wheatpaste
mapbox.streets-basic
mapbox.comic
mapbox.outdoors
mapbox.run-bike-hike
mapbox.pencil
mapbox.pirates
mapbox.emerald
mapbox.high-contrast
**/


var url = "https://spreadsheets.google.com/feeds/list/1JATktjNADZe3oR1cxIUT0kY6lZZ-6P6pKtgIeC3h_qU/od6/public/values?alt=json";

function removeAllChildren(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

var slideIndex = 0;

function bind_info_slideshow(title, info, images) {
  return function() {
    slideshow = document.createElement("div");
    slideshow.setAttribute("class", "slideshow-container");

    var present_images = 0;
    for (var image_index = 0; image_index < images.length; image_index++) {
      var each_url = images[image_index];
      if (each_url == "") {
        break;
      }
      present_images +=1 ;
      var fade_slide = document.createElement("div");
      fade_slide.setAttribute("class", "mySlides")  
      var each_image = document.createElement("img");
      each_image.setAttribute("src", each_url);
      each_image.setAttribute("class", "slideImage");
      fade_slide.appendChild(each_image);
      slideshow.appendChild(fade_slide);
    }

    if (1 < present_images) {
      var prev_but = document.createElement("a");
      prev_but.setAttribute("class", "next");
      prev_but.setAttribute("onclick", "plusSlides(-1)");
      prev_but.appendChild(document.createTextNode(">"))
      slideshow.appendChild(prev_but);
      
      var next_but = document.createElement("a");
      next_but.setAttribute("class", "prev");
      next_but.setAttribute("onclick", "plusSlides(1)");
      next_but.appendChild(document.createTextNode("<"))
      slideshow.appendChild(next_but);
    }

    var image_container = document.getElementById("image_field");
    removeAllChildren(image_container);
    image_container.appendChild(slideshow);

    slideIndex = 0;
    showSlides(slideIndex);

    var text_container = document.getElementById("text_field")
    removeAllChildren(text_container);
    text_container.appendChild(title);
    text_container.innerHTML += "<br>" + info;
  }
}


function s(data) {
  $.each(data.feed.entry, function(index, value) {
    try {
      var long = parseFloat(value.gsx$longitude.$t);
      var lat = parseFloat(value.gsx$latitude.$t);

      var each_id = value.gsx$id.$t;
      var title = value.gsx$title.$t;
      var description = value.gsx$description.$t;
      var image_url = value.gsx$pictureurl.$t;
      var image_url2 = value.gsx$pictureurl2.$t;
      var image_url3 = value.gsx$pictureurl3.$t;
      var image_url4 = value.gsx$pictureurl4.$t;
      var image_url5 = value.gsx$pictureurl5.$t;

      var heading;
      var error = "";
      if (each_id == "") {
        error += "id missing!\n";
      }
      if (title == "") {
        error += "title missing!\n";
      }
      if (description == "") {
        error += "description missing!\n";
      }
      if (image_url == "") {
        error += "picture_url missing!\n";
      }

      var image_urls
      if (error.length < 1) {      	
        image_urls = [image_url, image_url2, image_url3, image_url4, image_url5];
        
      } else {
        title = error;
        description = "";
        image_urls = [];
      }

      heading = document.createElement("h2");
      heading.appendChild(document.createTextNode(title));

      var marker = L.marker([long, lat]);
      marker.addTo(mymap);

      marker.on("click", bind_info_slideshow(heading, description, image_urls));

    } catch (err) {
      console.log(err);
    }
  });
}
$.getJSON(url, s);


// Next/previous controls
function plusSlides(n) {
  slideIndex += n;
  showSlides(slideIndex);
}

function showSlides(n) {
  var slides = document.getElementsByClassName("mySlides");
  if (slideIndex < 0) {
    slideIndex = slides.length - 1;
  } else {
    slideIndex = n % slides.length;
  }

  for (var i = 0; i < slides.length; i++) {
    var each_slide = slides[i];
    if (i == slideIndex) {
      each_slide.style.display = "block";
    } else {
      each_slide.style.display = "none"; 
    }
  }
}