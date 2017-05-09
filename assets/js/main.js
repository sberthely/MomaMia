// Reference : http://www.adeveloperdiary.com/d3-js/create-stacked-bar-chart-using-d3-js/
// Functions to convert hex to rgb

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb_tuple) {
    // console.log(rgb_tuple);
    r = +rgb_tuple.split(",")[0];
    g = +rgb_tuple.split(",")[1];
    b = +rgb_tuple.split(",")[2];
    // console.log(r,g,b);
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// to shuffle an array
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

var imgData = JSON.parse($("#imgData")[0].innerHTML);

function get_top_images(color_id) {
    // console.log(imgData[color_id]['Film']);
    var top_images_data = [];
    // For every category for that color_id, getting top image in an array
    for(var key in imgData[color_id]) {
        top_images_data.push(imgData[color_id][key][0]);
        top_images_data.push(imgData[color_id][key][1]);
        top_images_data.push(imgData[color_id][key][2]);
        top_images_data.push(imgData[color_id][key][3]);
        top_images_data.push(imgData[color_id][key][4]);
        top_images_data.push(imgData[color_id][key][5]);
        top_images_data.push(imgData[color_id][key][6]);
    }
    // shuffle array and take top 10
    shuffle(top_images_data)
    // if not undefined, appending to div
    for (var i in top_images_data.slice(0,15)) {
        console.log(top_images_data[i]);
        if(top_images_data[i] == undefined)
        {
            continue;
        }
        else {
            //console.log(top_images_data[i]);
            // $('#img-grid').append("<img src='"+top_images_data[i]['url']+"' id='color-img'>"); 
            $('#img-grid').append(
                "<figure id='color-img'><a href='"+top_images_data[i]['URL']+"'><img src='"+top_images_data[i]['url']+"'/></a><figcaption>Title - "+top_images_data[i]['Title']+"<br>Dept - "+top_images_data[i]['Department']+"</figcaption></figure>"
            ) 
        }
        
    }
    // return top_images_data;

};

//get_top_images('color3');

var bar_data = d3.json("assets/data/crayolacolors.json", function(error, json) {
    if (error) return console.warn(error);
    data = json;

    // var yData = ["color1", "color2", "color3"];
    // defining the categories for stacking
    var yData = ['color0', 'color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7', 'color8', 'color9', 'color10', 'color11', 'color12', 'color13', 'color14', 'color15', 'color16', 'color17', 'color18', 'color19', 'color20', 'color21', 'color22', 'color23'];
    
    // defining margin, width and height of the svg
    var margin = {top: 20, right: 50, bottom: 30, left: 50},
            width = 1100 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;
     
    // defining the scale for the y axis - bands based on height of svg and padding b/n bands
    // domain defined later below
    var y = d3.scale.ordinal()
            //.domain(yData)
            .rangeRoundBands([0, height], .20);
    
    // same for x - defining range based on width set for the svg
    var x = d3.scale.linear()
            .rangeRound([170, width]);
     
    // defining the colors for the stacked categories  
    // var color = ["#222222","#F2F3F4","#F3C300"]
    var color = ['#FDD5B1',
                '#000000',
                '#4997D0',
                '#0095B7',
                '#6456B7',
                '#AF593E',
                '#FFA6C9',
                '#02A4D3',
                '#FED85D',
                '#8B8680',
                '#3AA655',
                '#2887C8',
                '#4F69C6',
                '#FF8833',
                '#ED0A3F',
                '#FF681F',
                '#BB3385',
                '#FD0E35',
                '#652DC1',
                '#F7468A',
                '#FFFFFF',
                '#FBE870',
                '#C5E17A',
                '#FFAE42'];
     
    // var yAxis = d3.svg.axis()
    //         .scale(y)
    //         .orient("right");
     
    var svg = d3.select("#bar-chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     
    // creating data in the format that is required for the bar chart

    var dataIntermediate = yData.map(function (c) {
        return data.map(function (d) {
            return {x: d.dept, y: d[c]};
        });
    });

    var dataStackLayout = d3.layout.stack()(dataIntermediate);
    // console.log(dataStackLayout);  

    //reversing x and y values
    var dataStackLayout = dataStackLayout.map(function (group) {
    return group.map(function (d) {
        // Invert the x and y values, and y0 becomes x0
        return {
            x: d.y,
            y: d.x,
            x0: d.y0
            };
        });
    });
    // console.log(dataStackLayout); 
    // console.log(d3.max(dataStackLayout[dataStackLayout.length - 1],
    //             function (d) { return d.x0 + d.x;}));
    
    y.domain(dataStackLayout[0].map(function (d) {
        return d.y;
    }));
    // console.log(dataStackLayout[0].map(function (d) {
    //     return d.y;
    // }));
     
    x.domain([0,
        d3.max(dataStackLayout[dataStackLayout.length - 1],
                function (d) { return d.x0 + d.x;})
        ])
      .nice();

    var layer = svg.selectAll(".stack")
            .data(dataStackLayout)
            .enter().append("g")
            .attr("class", "stack")
            .style("fill", function (d, i) {
                return color[i];
            });
    layer.selectAll("rect")
            .data(function (d) {
                // console.log(d);
                return d;
            })
            .enter().append("rect")
            .attr("y", function (d) {
                return y(d.y);
            })
            .attr("x", function (d) {
                return x(d.x0);
            })
            .attr("width", function (d) {
                return x(d.x0) + x(d.x);
            })
            .attr("height", y.rangeBand())
            .attr("class",function() {
                // getting the color value - this is a string of the type  rgb(100, 100, 100)
                color_val = d3.select(this).style("fill");
                // getting only the comma separated numbers
                color_val_stripped = color_val.slice(4,color_val.length-1);
                // converting to hex, without the #
                hex_val = rgbToHex(color_val_stripped);
                // console.log(hex_val);
                color_num = color.indexOf(hex_val.toUpperCase());
                class_name = "color"+(color_num);
                return class_name;
            })
            .on("mouseover", function(d){
                class_name = d3.select(this).attr("class");
                // console.log(class_name);
                 d3.selectAll("."+class_name).style("fill", function() {
                return d3.rgb(d3.selectAll("."+class_name).style("fill")).darker(0.3);
                });

                // Create a path between all rectangles

            })
            .on("mouseout", function(d){
                 class_name = d3.select(this).attr("class");
                 d3.selectAll("."+class_name).style("fill", function() {
                    return d3.rgb(d3.selectAll("."+class_name).style("fill")).brighter(0.3);
                });
            })
            .on("click", function(d){
                $('#img-grid').empty();
                class_name = d3.select(this).attr("class");
                // console.log(class_name);
                get_top_images(class_name);
            })
            ;

    layer.append("text")
        .data(function () {
                // console.log(data);
                return data;
        })
      .attr("x", function(d) {   return 0 })
      .attr("y", function(d, i) {return y(d.dept)+( y.rangeBand()/2)} )
      .attr("dy", ".1em")
      .attr("class", "bar-label")
      .text(function(d) { return d.dept; });

    layer.append("text")
        .data(function () {
                // console.log(data);
                return data;
        })
      .attr("x", function(d) {   return 0 })
      .attr("y", function(d, i) {return y(d.dept)+( y.rangeBand()/2)+15} )
      // .attr("dy", ".1em")
      .attr("class", "bar-label")
      .text(function(d) { return d.volume; });
     
   
});