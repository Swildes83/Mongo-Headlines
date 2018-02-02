// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
  
      $("#articles").append("<h5 data-id='" + data[i]._id + "'>" +  data[i].title + "</h5><p data-id='" + "'>Link: " + data[i].link + "</p>");
    }
  });
  
  // $("#getNewsBtn").click(function(){
  //
  // });
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "h5", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .done(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h5>" + data.title + "</h5>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
    
    
    // Whenever someone clicks a p tag
    $(document).on("click", ".note", function() {
      // Empty the notes from the note section
      // $("#titleinput").empty();
      // $("#bodyinput").empty();
      // Save the id from the p tag
      var thisId = $(this).attr("id");
    
      // Now make an ajax call for the Article
      $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      })
        // With that done, add the note information to the page
        .done(function(data) {
          console.log(data.note.length);
          for (i=0; i<data.note.length; i++){
          $("#notes"+data._id).append("<input id='titleinput"+data.note[i]._id+"'title' >");
          // A textarea to add a new note body
          $("#notes"+data._id).append("<textarea id='bodyinput" +data.note[i]._id+ "'name='body'></textarea>");
          //delete comment
          $("#notes"+data._id).append("<button id='" + data.note[i]._id + "' class='deletenote'>Delete Note</button>");  
          $("#notes"+data._id).append("<br>");    
          } //loop ends
    
    
          $("#notes"+data._id).append("<input id='titleinput'>");
          // A textarea to add a new note body
          $("#notes"+data._id).append("<textarea id='bodyinput'></textarea>");
          // A button to submit a new note, with the id of the article saved to it
          $("#notes"+data._id).append("<button id='" + data._id + "' class='savenote'>Save Note</button>");
          $("#notes"+data._id).append("<br>");
    
    
          // If there's a note in the article
          if (data.note) {
            console.log("Heeey");
                for (i=0; i<data.note.length; i++){
               // Place the title of the note in the title input
            $("#titleinput"+data.note[i]._id).val(data.note[i].title);
            // Place the body of the note in the body textarea
            $("#bodyinput"+data.note[i]._id).val(data.note[i].body);       
            }
    
          }
        });
    });
    
    // When you click the savenote button
    $(document).on("click", ".savenote", function() {
      // Grab the id associated with the article from the submit button
      var thisId = $(this).attr("id");
    console.log("Eto ID: " + thisId);
    console.log($("#titleinput").val());
    
      // Run a POST request to change the note, using what's entered in the inputs
      $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          // Value taken from title input
          title: $("#titleinput").val(),
          // Value taken from note textarea
          body: $("#bodyinput").val()
        }
      })
        // With that done
        .done(function(data) {
          // Log the response
          console.log(data);
          // Empty the notes section
         // $("#notes").empty();
        });
    
      // Also, remove the values entered in the input and textarea for note entry
      $("#titleinput").val("");
      $("#bodyinput").val("");
    });
    
    
    // When you click the delete note button
    $(document).on("click", ".deletenote", function() {
      // Grab the id associated with the article from the submit button
      var thisId = $(this).attr("id");
      console.log(thisId);
      $.ajax({
        method: "POST",
        url: "/deletenote/" + thisId,
        data: {
          // Value taken from title input
          title: $("#titleinput").val(),
          // Value taken from note textarea
          body: $("#bodyinput").val()
    
        }
      })
    
    
    });