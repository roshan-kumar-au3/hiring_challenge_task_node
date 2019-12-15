    $(document).ready(function () {
        $("#submit").on('click', function (e) {
            e.preventDefault();
            $('#state-container').empty();
            var states = [];
            var data = {
                cityOne: $("#cityOne").val(),
                cityTwo: $("#cityTwo").val(),
                cityThree: $("#cityThree").val(),
                cityFour: $("#cityFour").val(),
                cityFive: $("#cityFive").val()
            };
            console.log(data);
            $.ajax({
                url: "/state/" + data.cityOne,
                method: "GET",
                dataType: "json",
                success: function (data) {
                    states.push(data);
                    $('#state-container').append(`<li class="list-group-item"> ${data} <li>`)
                }
            });
            
            $.ajax({
                url: "/state/" + data.cityTwo,
                method: "GET",
                dataType: "json",
                success: function (data) {
                    states.push(data);
                    $('#state-container').append(`<li class="list-group-item"> ${data} <li>`)
                }
            });

             $.ajax({
                 url: "/state/" + data.cityThree,
                 method: "GET",
                 dataType: "json",
                 success: function (data) {
                     states.push(data);
                    $('#state-container').append(`<li class="list-group-item"> ${data} <li>`)
                 }
             });

             $.ajax({
                 url: "/state/" + data.cityFour,
                 method: "GET",
                 dataType: "json",
                 success: function (data) {
                     states.push(data);
                    $('#state-container').append(`<li class="list-group-item"> ${data} <li>`)
                 }
             });

             $.ajax({
                 url: "/state/" + data.cityFive,
                 method: "GET",
                 dataType: "json",
                 success: function (data) {
                     states.push(data);
                    $('#state-container').append(`<li class="list-group-item"> ${data} <li>`);
                    var mf = 1;
                    var m = 0;
                    var item;
                    for (var i = 0; i < states.length; i++) {
                        for (var j = i; j < states.length; j++) {
                            if (states[i] == states[j])
                                m++;
                            if (mf < m) {
                                mf = m;
                                item = states[i];
                            }
                        }
                        m = 0;
                    }

                    if(item === undefined) {
                        item = states[0]
                    }
                    
                    $('#state-container').append(`<li class="list-group-item">frequentState: ${item} <li>`)
                 }
             });
        });
    });