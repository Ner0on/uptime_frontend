
var rss_url = "https://www.readability.com/rseero/latest/feed";

$.ajax({
  url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(rss_url),
  dataType: 'JSONP',
  type: 'GET',
  success: function(data){
    $(data.responseData.feed.entries).each(function(){
      apiParser(this);
    });

    $('#rss-content').on('click', 'div', function(){
      var title = $( this ).find('h5').text();
      var content = $( this ).find('span').text();

      $('#myModalLabel').text(title);
      $('.modal-body').text(content);
    });
    
  }
});

function apiParser(data,index){
  var apiFullUrl = 'https://www.readability.com/api/content/v1/parser?url=' + encodeURIComponent(data.link) + '/&token=21dc3f8a30a5aaff87db894fc5edf977813573a7&callback';
  $.ajax({
    url: apiFullUrl,
    dataType: 'JSONP',
    type: 'GET',
    success: function(data){
      appendHtml(data);
    }
  })
}

function appendHtml(data){
  data.content = replaceString(data.content);
  data.content = decodeHtml(data.content);
  data.excerpt = decodeHtml(data.excerpt);
  data.lead_image_url = grabImage(data.lead_image_url);

  var template = $('#articleDiv').html();
  var html = Mustache.to_html(template, data);
  
  if($('#rss-content .row:last-child').children().length == 3){
    $('#rss-content').append('<div class="row"></div>')
  }

  $('#rss-content .row:last-child').append(html);

}

function decodeHtml(text){
  var decoded = $('<div/>').html(text).text();
  return decoded;
}

function replaceString(string){
  var replaced = string.replace(/(<([^>]+)>)/ig,"");
  return replaced;
}

function grabImage(image_url){
  if(image_url == null){
    var img =  "http://www.armidabooks.com/wp-content/uploads/2014/10/no_pic_available.jpg";
  }else{
    var img = image_url.split(" ")[0];
  }  
  return img;
}